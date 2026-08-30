from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

DOCS_PATH = Path(os.getenv("EXCEL_DOCS", "data/excel_documents.json"))
VECTOR_DIR = Path(os.getenv("EXCEL_VECTOR_DIR", "data/excel_faiss"))
CHAT_MODEL = os.getenv("BIS_LLM_MODEL", "openrouter/free")
EMBED_MODEL = os.getenv("BIS_EMBEDDING_MODEL", "text-embedding-3-small")
TOP_K = int(os.getenv("EXCEL_TOP_K", "6"))
MIN_SCORE = float(os.getenv("EXCEL_MIN_SCORE", "0.18"))

PROMPT = ChatPromptTemplate.from_messages([("system", """You answer questions only from the supplied Excel evidence. Do not use outside knowledge or invent values. Answer only the requested question. Cite every factual sentence with exact tags [S1], [S2], etc. If the evidence does not directly answer the question, output exactly INSUFFICIENT_EVIDENCE. Mention workbook, sheet, and row range when useful.\n\nEVIDENCE:\n{context}"""), ("human", "Question: {question}\nLanguage: {language}")])


def load_documents() -> list[Document]:
    if not DOCS_PATH.exists():
        raise FileNotFoundError(f"{DOCS_PATH} not found. Run excel_ingest.py first.")
    data = json.loads(DOCS_PATH.read_text(encoding="utf-8"))
    return [Document(page_content=x["text"], metadata=x["metadata"] | {"id": x["id"]}) for x in data["documents"]]


def build_index() -> FAISS:
    store = FAISS.from_documents(load_documents(), OpenAIEmbeddings(model=EMBED_MODEL))
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    store.save_local(str(VECTOR_DIR))
    return store


def load_index() -> FAISS:
    embeddings = OpenAIEmbeddings(model=EMBED_MODEL)
    if not VECTOR_DIR.exists():
        return build_index()
    return FAISS.load_local(str(VECTOR_DIR), embeddings, allow_dangerous_deserialization=True)


def ask(question: str, language: str = "English") -> dict[str, Any]:
    pairs = [(d, float(s)) for d, s in load_index().similarity_search_with_relevance_scores(question, k=TOP_K) if float(s) >= MIN_SCORE]
    if not pairs:
        return {"status": "INSUFFICIENT_EVIDENCE", "answer": "I could not find sufficient evidence in the Excel datasets for that question.", "citations": []}
    docs = [p[0] for p in pairs]
    context = "\n\n".join(f"[S{i}] workbook={d.metadata.get('file')} sheet={d.metadata.get('sheet')} rows={d.metadata.get('row_start')}-{d.metadata.get('row_end')}\n{d.page_content}" for i, d in enumerate(docs, 1))
    model = ChatOpenAI(model=CHAT_MODEL, temperature=0, max_tokens=900)
    text = model.invoke(PROMPT.format_messages(context=context, question=question, language=language)).content.strip()
    used = set(re.findall(r"\[(S\d+)\]", text))
    valid = {f"S{i}" for i in range(1, len(docs) + 1)}
    if text == "INSUFFICIENT_EVIDENCE" or not used or not used.issubset(valid):
        return {"status": "INSUFFICIENT_EVIDENCE", "answer": "I could not verify an answer from the retrieved Excel evidence.", "citations": []}
    citations = []
    for tag in sorted(used, key=lambda x: int(x[1:])):
        d, score = pairs[int(tag[1:]) - 1]
        citations.append({"tag": tag, **d.metadata, "score": round(score, 4)})
    return {"status": "ANSWERED", "answer": text, "citations": citations}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("question", nargs="*", help="Question to answer")
    parser.add_argument("--rebuild", action="store_true")
    parser.add_argument("--language", default="English")
    args = parser.parse_args()
    if args.rebuild:
        build_index()
        print(f"Created Excel FAISS index at {VECTOR_DIR}")
        if not args.question:
            return
    if not args.question:
        parser.error("provide a question, or use --rebuild by itself")
    print(json.dumps(ask(" ".join(args.question), args.language), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
