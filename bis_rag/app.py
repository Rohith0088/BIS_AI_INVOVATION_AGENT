import json
import os
import re
from pathlib import Path
from typing import Literal

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

INDEX_PATH = Path(os.getenv("BIS_INDEX", "data/index.json"))
MODEL = os.getenv("BIS_LLM_MODEL", "openrouter/free")
MIN_SCORE = float(os.getenv("BIS_MIN_SCORE", "0.16"))
TOP_K = int(os.getenv("BIS_TOP_K", "6"))
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing. Add it to the .env file.")

app = FastAPI(
    title="BIS Grounded RAG API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.onrender.com",
        "http://*.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
 )


def load_index():
    if not INDEX_PATH.exists():
        raise RuntimeError(
            f"Index not found: {INDEX_PATH}. Run ingest.py first."
        )

    data = json.loads(
        INDEX_PATH.read_text(encoding="utf-8")
    )
    vectorizer_data = data["vectorizer"]

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        vocabulary=vectorizer_data["vocabulary"],
        sublinear_tf=True,
    )
    vectorizer.idf_ = np.array(
        vectorizer_data["idf"]
    )
    vectorizer._tfidf.idf_ = vectorizer.idf_

    matrix = np.array(
        data["matrix"],
        dtype=float,
    )

    return data["records"], vectorizer, matrix


if INDEX_PATH.exists():
    records, vectorizer, matrix = load_index()
else:
    records = []
    vectorizer = None
    matrix = np.empty((0, 0))


class AskRequest(BaseModel):
    question: str = Field(
        min_length=3,
        max_length=2000,
    )
    mode: Literal["consumer", "industry"] = "consumer"
    language: str = "English"


def retrieve(question: str):
    if not records or vectorizer is None:
        return []

    question_vector = vectorizer.transform([question])
    scores = cosine_similarity(
        question_vector,
        matrix,
    )[0]
    order = np.argsort(scores)[::-1]

    evidence = []
    for index in order[:TOP_K]:
        score = float(scores[index])

        if score >= MIN_SCORE:
            item = dict(records[index])
            item["score"] = round(score, 4)
            evidence.append(item)

    return evidence


def answer_with_evidence(
    request: AskRequest,
    evidence: list[dict],
):
    if not evidence:
        return {
            "status": "INSUFFICIENT_EVIDENCE",
            "answer": (
                "I could not find sufficient authoritative BIS "
                "evidence for that question. Please provide the IS "
                "number, product, or service name."
            ),
            "citations": [],
            "confidence": 0.0,
        }

    context = "\n\n".join(
        (
            f"[{index + 1}] "
            f"{item.get('title', 'BIS source')} | "
            f"{item.get('url', '')} | "
            f"retrieved {item.get('retrieved_at', '')}\n"
            f"{item.get('text', '')}"
        )
        for index, item in enumerate(evidence)
    )

    system = f"""
You are a precise BIS information assistant for {request.mode} users.
Answer only from the supplied evidence.
Do not use outside knowledge.
Do not invent standards, clauses, dates, fees, licence requirements,
test values, or legal conclusions.
If the evidence does not directly answer the question, respond with:
INSUFFICIENT_EVIDENCE
Every factual statement must contain a citation such as [1] or [2].
Respond in {request.language}.

SUPPLIED BIS EVIDENCE:
{context}
"""

    client = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_API_BASE,
    )
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": request.question,
            },
        ],
        max_completion_tokens=900,
    )

    answer = (
        response.choices[0].message.content or ""
    ).strip()

    valid_numbers = set(
        range(1, len(evidence) + 1)
    )
    used_numbers = {
        int(number)
        for number in re.findall(
            r"\[(\d+)\]",
            answer,
        )
    }

    if (
        answer == "INSUFFICIENT_EVIDENCE"
        or not used_numbers
        or not used_numbers.issubset(valid_numbers)
    ):
        return {
            "status": "INSUFFICIENT_EVIDENCE",
            "answer": (
                "I could not verify an answer from the retrieved "
                "BIS sources. Please provide a more specific IS "
                "number or product."
            ),
            "citations": [],
            "confidence": 0.0,
        }

    confidence = min(
        0.99,
        max(
            0.35,
            sum(
                item.get("score", 0.0)
                for item in evidence[:2]
            )
            / 2
            + 0.25,
        ),
    )

    citations = []
    for number in sorted(used_numbers):
        item = evidence[number - 1]
        citations.append(
            {
                "source_id": item.get("source_id"),
                "title": item.get(
                    "title",
                    "BIS source",
                ),
                "url": item.get(
                    "url",
                    "https://www.bis.gov.in/",
                 ),
                "score": item.get("score", 0.0),
                "retrieved_at": item.get(
                    "retrieved_at"
                ),
                "clause_ref": item.get(
                    "clause_ref"
                ),
                "text": item.get("text", ""),
            }
        )

    return {
        "status": "ANSWERED",
        "answer": answer,
        "citations": citations,
        "confidence": round(confidence, 2),
    }


@app.get("/health")
def health():
    return {
        "ok": True,
        "chunks": len(records),
        "model": MODEL,
        "min_score": MIN_SCORE,
    }


@app.post("/answer")
def answer(request: AskRequest):
    evidence = retrieve(request.question)
    return answer_with_evidence(request, evidence)