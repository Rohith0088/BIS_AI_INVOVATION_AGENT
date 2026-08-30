from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from multilingual_agent import ask


app = FastAPI(
    title="BIS Multilingual RAG API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MultilingualQuestion(BaseModel):
    question: str = Field(
        min_length=2,
        max_length=2000,
    )
    language: str = "English"
    mode: Literal["consumer", "industry"] = "consumer"


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "multilingual-rag",
    }


@app.post("/answer")
def answer(request: MultilingualQuestion):
    result = ask(
        question=request.question,
        language=request.language,
    )
    return result
