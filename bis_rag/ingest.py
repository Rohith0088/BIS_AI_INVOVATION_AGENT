from __future__ import annotations
import tempfile
import argparse, hashlib, json, re, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests, yaml
from bs4 import BeautifulSoup
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer

UA = "BIS-RAG-ResearchBot/0.1 (+contact your-team@example.org)"


def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    return text


def fetch(url: str) -> tuple[str, str]:
    r = requests.get(url, headers={"User-Agent": UA}, timeout=40)
    r.raise_for_status()
    return r.headers.get("content-type", ""), r.content


def extract(url: str, content_type: str, raw: bytes) -> str:
    is_pdf = "pdf" in content_type.lower() or url.lower().endswith(".pdf")
    if is_pdf:
        temporary_path = None

        try:
            with tempfile.NamedTemporaryFile(
                prefix="bis-rag-",
                suffix=".pdf",
                delete=False,
            ) as temporary_file:
                temporary_file.write(raw)
                temporary_path = Path(temporary_file.name)

            reader = PdfReader(str(temporary_path))

            return clean(
                "\n".join(
                    page.extract_text() or ""
                    for page in reader.pages
                )
            )
        finally:
            if temporary_path is not None:
                temporary_path.unlink(missing_ok=True)

    soup = BeautifulSoup(raw, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    return clean(soup.get_text(" "))


def chunks(text: str, size=1200, overlap=180):
    words = text.split()
    out = []
    start = 0
    while start < len(words):
        end = min(len(words), start + size)
        part = " ".join(words[start:end]).strip()
        if len(part) >= 80:
            out.append(part)
        if end == len(words):
            break
        start = end - overlap
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", default="sources.yaml")
    ap.add_argument("--out", default="data/index.json")
    args = ap.parse_args()
    manifest = yaml.safe_load(
        Path(args.manifest).read_text(
            encoding="utf-8"
        )
    )
    records, seen = [], set()
    now = datetime.now(timezone.utc).isoformat()
    for source in manifest["sources"]:
        urls = [source["url"]]
        if source.get("service_url"):
            urls.append(source["service_url"])
        for url in urls:
            try:
                ctype, raw = fetch(url)
                text = extract(url, ctype, raw)
                digest = hashlib.sha256(
                    text.encode("utf-8")
                ).hexdigest()
                if not text or digest in seen:
                    continue
                seen.add(digest)
                for i, part in enumerate(chunks(text)):
                    records.append({
                        "id": f"{source['id']}:{i}",
                        "source_id": source["id"],
                        "authority": source["authority"],
                        "title": source["title"],
                        "url": url,
                        "retrieved_at": now,
                        "priority": source.get("priority", 3),
                        "text": part,
                    })
                print(f"OK {source['id']} {url}")
            except Exception as exc:
                print(f"WARN {source['id']} {url}: {exc}")
            time.sleep(0.25)
    texts = [r["text"] for r in records]
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=1,
        max_features=120000,
        sublinear_tf=True
    )
    matrix = vectorizer.fit_transform(texts) if texts else None
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "created_at": now,
        "records": records,
        "vectorizer": {
            "vocabulary": {
                str(k): int(v)
                for k, v in (
                    vectorizer.vocabulary_.items()
                    if texts else []
                )
            },
            "idf": vectorizer.idf_.tolist() if texts else []
        },
        "matrix": matrix.toarray().tolist() if matrix is not None else []
    }
    out.write_text(
        json.dumps(
            payload,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(records)} chunks to {out}")


if __name__ == "__main__":
    main()