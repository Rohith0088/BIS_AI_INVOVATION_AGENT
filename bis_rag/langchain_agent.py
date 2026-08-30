from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

INDEX_PATH = Path(os.getenv("BIS_INDEX", "data/index.json"))
VECTOR_DIR = Path(os.getenv("BIS_VECTOR_DIR", "data/faiss"))
CHAT_MODEL = os.getenv("BIS_LLM_MODEL", "openrouter/free")
EMBED_MODEL = os.getenv("BIS_EMBEDDING_MODEL", "text-embedding-3-small")
MIN_SCORE = float(os.getenv("BIS_MIN_SCORE", "0.18"))
TOP_K = int(os.getenv("BIS_TOP_K", "6"))

SYSTEM_PROMPT = """You are the BIS Standards and Services evidence assistant.
Answer only what is directly supported by the CONTEXT. Do not use general model knowledge.
Do not invent or estimate fees, dates, compulsory status, licence status, test facilities,
legal conclusions, eligibility, or process steps. Keep the answer limited to the user's
question. Cite every factual sentence using the exact source tags [S1], [S2], etc.
If the context does not directly answer the question, output exactly INSUFFICIENT_EVIDENCE.
If sources conflict, state that they conflict and cite both. Mention the source date or
retrieval date for time-sensitive information. Answer in the requested language.

CONTEXT:
{context}
"""

PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "Mode: {mode}\nLanguage: {language}\nQuestion: {question}"),
])


def documents_from_index(path: Path = INDEX_PATH) -> list[Document]:
    data = json.loads(path.read_text(encoding="utf-8"))
    docs = []
    for record in data["records"]:
        metadata = {k: record.get(k) for k in (
            "id", "source_id", "authority", "title", "url", "retrieved_at", "priority"
        )}
        docs.append(Document(page_content=record["text"], metadata=metadata))
    return docs


def build_vectorstore(index_path: Path = INDEX_PATH, vector_dir: Path = VECTOR_DIR) -> FAISS:
    """Create and persist a LangChain FAISS store from the existing BIS index."""
    if not index_path.exists():
        raise FileNotFoundError(f"Missing {index_path}; run ingest.py first.")
    embeddings = OpenAIEmbeddings(model=EMBED_MODEL)
    store = FAISS.from_documents(documents_from_index(index_path), embeddings)
    vector_dir.mkdir(parents=True, exist_ok=True)
    store.save_local(str(vector_dir))
    return store


def load_vectorstore(vector_dir: Path = VECTOR_DIR) -> FAISS:
    if not vector_dir.exists():
        return build_vectorstore(INDEX_PATH, vector_dir)
    embeddings = OpenAIEmbeddings(model=EMBED_MODEL)
    return FAISS.load_local(str(vector_dir), embeddings, allow_dangerous_deserialization=True)


def _context(docs: list[Document]) -> str:
    return "\n\n".join(
        f"[S{i}] {d.metadata.get('title')} | {d.metadata.get('url')} | retrieved {d.metadata.get('retrieved_at')}\n{d.page_content}"
        for i, d in enumerate(docs, start=1)
    )


def _citation_ids(text: str) -> set[str]:
    return set(re.findall(r"\[(S\d+)\]", text))


def ask(question: str, mode: str = "consumer", language: str = "English") -> dict[str, Any]:
    store = load_vectorstore()
    # similarity_search_with_relevance_scores returns normalized relevance where supported.
    pairs = store.similarity_search_with_relevance_scores(question, k=TOP_K)
    pairs = [(doc, float(score)) for doc, score in pairs if float(score) >= MIN_SCORE]
    if not pairs:
        return {
            "status": "INSUFFICIENT_EVIDENCE",
            "answer": "I could not find sufficient authoritative BIS evidence for that question. Please provide the IS number, product, or service name.",
            "citations": [],
            "scores": [],
        }
    docs = [doc for doc, _ in pairs]
    response = (PROMPT | ChatOpenAI(model=CHAT_MODEL, temperature=0, max_tokens=900)).invoke({
        "context": _context(docs), "question": question, "mode": mode, "language": language,
    })
    text = (response.content or "").strip()
    valid = {f"S{i}" for i in range(1, len(docs) + 1)}
    used = _citation_ids(text)
    if text == "INSUFFICIENT_EVIDENCE" or not used or not used.issubset(valid):
        return {
            "status": "INSUFFICIENT_EVIDENCE",
            "answer": "I could not verify an answer from the retrieved BIS sources. Please provide a more specific IS number or product.",
            "citations": [],
            "scores": [round(s, 4) for _, s in pairs],
        }
    citations = []
    for tag in sorted(used, key=lambda x: int(x[1:])):
        i = int(tag[1:]) - 1
        citations.append({"tag": tag, **docs[i].metadata, "score": round(pairs[i][1], 4)})
    return {"status": "ANSWERED", "answer": text, "citations": citations, "scores": [round(s, 4) for _, s in pairs]}


def main():
    parser = argparse.ArgumentParser(description="Grounded BIS LangChain RAG agent")
    parser.add_argument("question", nargs="+", help="Question to answer")
    parser.add_argument("--mode", choices=["consumer", "industry"], default="consumer")
    parser.add_argument("--language", default="English")
    parser.add_argument("--rebuild", action="store_true")
    args = parser.parse_args()
    if args.rebuild:
        build_vectorstore()
    print(json.dumps(ask(" ".join(args.question), args.mode, args.language), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
