from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()
DOCS_PATH = Path(os.getenv("MULTILINGUAL_DOCS", "data/multilingual_documents.json"))
VECTOR_DIR = Path(os.getenv("MULTILINGUAL_VECTOR_DIR", "data/multilingual_faiss"))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
CHAT_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
EMBED_MODEL = os.getenv("OPENROUTER_EMBEDDING_MODEL", "openai/text-embedding-3-small")
TOP_K = min(int(os.getenv("MULTILINGUAL_TOP_K", "4")), 4)
MIN_SCORE = float(os.getenv("MULTILINGUAL_MIN_SCORE", "0.18"))
MAX_CONTEXT_CHARS = int(os.getenv("MULTILINGUAL_MAX_CONTEXT_CHARS", "24000"))
MAX_DOCUMENT_CHARS = int(os.getenv("MULTILINGUAL_MAX_DOCUMENT_CHARS", "6000"))
MAX_OUTPUT_TOKENS = int(os.getenv("MULTILINGUAL_MAX_OUTPUT_TOKENS", "600"))

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing from bis_rag/.env")

PROMPT = ChatPromptTemplate.from_messages([("system", """You are a precise multilingual BIS RAG assistant. Answer only from the supplied evidence. Preserve names, numbers, dates, IS numbers, fees, and technical values exactly as written. Do not translate or alter a value. Do not use outside knowledge. Cite each factual sentence with [S1], [S2], etc. If the evidence does not directly support the answer, output exactly INSUFFICIENT_EVIDENCE. Answer in the user's requested language. Format the answer as readable paragraphs. Do not use Markdown tables. When listing products, put every BIS IS number on its own new line in this format: IS number — product/material — status [S1].\n\nEVIDENCE:\n{context}"""), ("human", "Question: {question}\nRequested language: {language}")])


def format_answer(text: str) -> str:
    """Render model output for a terminal instead of printing escaped JSON."""
    text = (text or "").replace("\\\\n", "\n").replace("\\n", "\n").replace("\\r", "")
    cleaned = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            if cleaned and cleaned[-1] != "":
                cleaned.append("")
            continue
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if cells and not all(set(c) <= {"-", ":", " "} for c in cells):
                line = " — ".join(cells)
            else:
                continue
        cleaned.append(line)
    text = "\n".join(cleaned).strip()
    # Start a new line before each IS number, including IS 1786 (Part 1), IS/IEC, etc.
    text = re.sub(r"(?<!^)(?<!\n)(?=\bIS(?:\s*/\s*IEC)?\s*\d)", "\n", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def load_documents() -> list[Document]:
    if not DOCS_PATH.exists():
        raise FileNotFoundError(f"{DOCS_PATH} not found. Run multilingual_ingest.py first.")
    data = json.loads(DOCS_PATH.read_text(encoding="utf-8"))
    return [Document(page_content=x["text"], metadata=x["metadata"] | {"id": x["id"], "language": x.get("language", "unknown")}) for x in data["documents"]]


def openrouter_headers() -> dict[str, str]:
    return {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "BIS Sahayak Multilingual RAG",
    }


def create_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=EMBED_MODEL,
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        default_headers=openrouter_headers(),
    )


def create_chat_model() -> ChatOpenAI:
    return ChatOpenAI(
        model=CHAT_MODEL,
        temperature=0,
        max_tokens=MAX_OUTPUT_TOKENS,
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        default_headers=openrouter_headers(),
    )


def build_index() -> FAISS:
    store = FAISS.from_documents(load_documents(), create_embeddings())
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    store.save_local(str(VECTOR_DIR))
    return store


def load_index() -> FAISS:
    if not VECTOR_DIR.exists():
        return build_index()
    return FAISS.load_local(str(VECTOR_DIR), create_embeddings(), allow_dangerous_deserialization=True)


def ask(question: str, language: str = "English") -> dict[str, Any]:
    pairs = [(d, float(s)) for d, s in load_index().similarity_search_with_relevance_scores(question, k=TOP_K) if float(s) >= MIN_SCORE]
    if not pairs:
        return {"status": "INSUFFICIENT_EVIDENCE", "answer": "पर्याप्त प्रमाण नहीं मिला / Insufficient evidence in the indexed datasets.", "citations": []}
    docs = [x[0] for x in pairs]
    context_parts = []
    used_docs = []
    total_chars = 0
    for i, d in enumerate(docs, 1):
        header = f"[S{i}] file={d.metadata.get('file')} type={d.metadata.get('source_type')} sheet={d.metadata.get('sheet', '')} pages={d.metadata.get('page_start', '')}-{d.metadata.get('page_end', '')} language={d.metadata.get('language', '')}\n"
        remaining = MAX_CONTEXT_CHARS - total_chars - len(header)
        if remaining <= 200:
            break
        body = d.page_content[:min(MAX_DOCUMENT_CHARS, remaining)]
        context_parts.append(header + body)
        used_docs.append(d)
        total_chars += len(header) + len(body)
    docs = used_docs
    context = "\n\n".join(context_parts)
    model = create_chat_model()
    try:
        text = model.invoke(PROMPT.format_messages(context=context, question=question, language=language)).content.strip()
    except Exception as exc:
        message = str(exc)
        if "Prompt tokens limit exceeded" in message or "code': 402" in message or '"code": 402' in message:
            return {"status": "INSUFFICIENT_EVIDENCE", "answer": "The request was too large for the current API balance. Try a shorter question or reduce MULTILINGUAL_MAX_CONTEXT_CHARS and MULTILINGUAL_MAX_DOCUMENT_CHARS in .env.", "citations": []}
        raise
    used = set(re.findall(r"\[(S\d+)\]", text)); valid = {f"S{i}" for i in range(1, len(docs) + 1)}
    if text == "INSUFFICIENT_EVIDENCE" or not used or not used.issubset(valid):
        return {"status": "INSUFFICIENT_EVIDENCE", "answer": "I could not verify an answer from the indexed evidence.", "citations": []}
    citations = []
    for tag in sorted(used, key=lambda x: int(x[1:])):
        d, score = pairs[int(tag[1:]) - 1]
        citations.append({"tag": tag, **d.metadata, "score": round(score, 4)})
    return {"status": "ANSWERED", "answer": text, "citations": citations}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("question", nargs="*")
    parser.add_argument("--rebuild", action="store_true")
    parser.add_argument("--language", default="English")
    args = parser.parse_args()
    if args.rebuild:
        build_index(); print(f"Created {VECTOR_DIR}")
        if not args.question: return
    if not args.question: parser.error("provide a question or use --rebuild")
    result = ask(" ".join(args.question), args.language)
    print(f"Status: {result['status']}\n")
    print(format_answer(result["answer"]))
    if result.get("citations"):
        print("\nSources:")
        for citation in result["citations"]:
            location = citation.get("file", "unknown file")
            if citation.get("sheet"):
                location += f" | sheet: {citation['sheet']} | rows: {citation.get('row_start', '')}-{citation.get('row_end', '')}"
            if citation.get("page_start"):
                location += f" | pages: {citation['page_start']}-{citation.get('page_end', '')}"
            print(f"[{citation['tag']}] {location} | {citation.get('source_url', '')}")


if __name__ == "__main__":
    main()
