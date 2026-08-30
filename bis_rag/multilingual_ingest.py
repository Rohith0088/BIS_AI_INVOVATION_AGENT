from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

import nltk
import pandas as pd
from langdetect import DetectorFactory, detect
from pypdf import PdfReader

DetectorFactory.seed = 0

SUPPORTED = {".xlsx", ".xls", ".xlsm", ".xlsb", ".ods", ".pdf", ".csv"}


def language_of(text: str) -> str:
    sample = re.sub(r"\s+", " ", text or "").strip()[:5000]
    if not sample:
        return "unknown"

    if re.search(r"[\u0900-\u097F]", sample):
        return "hi"

    try:
        return detect(sample)
    except Exception:
        return "unknown"


def nltk_normalize(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()

    try:
        tokens = nltk.wordpunct_tokenize(text)
        return " ".join(tokens)
    except Exception:
        return text


def value(v: Any) -> str:
    if pd.isna(v):
        return ""

    if isinstance(v, (datetime, date)):
        return v.isoformat()

    return str(v).strip()


def column_name(v: Any, i: int) -> str:
    name = re.sub(r"\s+", " ", value(v))
    return name or f"column_{i + 1}"


def make_doc(
    text: str,
    metadata: dict[str, Any],
    doc_id: str
) -> dict[str, Any]:

    return {
        "id": doc_id,
        "text": text,
        "retrieval_text": nltk_normalize(text),
        "language": language_of(text),
        "metadata": metadata
    }


def excel_docs(
    path: Path,
    rows_per_document: int = 20
) -> tuple[list[dict], dict]:

    docs = []
    sheets_report = []

    try:
        sheets = pd.read_excel(
            path,
            sheet_name=None,
            dtype=object
        )
    except Exception as exc:
        return [], {
            "file": str(path),
            "type": "excel",
            "status": "error",
            "error": str(exc),
            "sheets": []
        }

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()[:16]

    for sheet, frame in sheets.items():

        frame = frame.dropna(
            how="all"
        ).copy()

        frame.columns = [
            column_name(c, i)
            for i, c in enumerate(frame.columns)
        ]

        frame = frame.loc[
            :,
            ~frame.columns.duplicated()
        ]

        cols = list(frame.columns)

        sheets_report.append({
            "sheet": str(sheet),
            "rows": int(len(frame)),
            "columns": cols,
            "duplicate_rows": int(
                frame.duplicated().sum()
            ),
            "empty_cells": int(
                frame.isna().sum().sum()
            )
        })

        rows = [
            [value(v) for v in row]
            for row in frame.itertuples(
                index=False,
                name=None
            )
        ]

        for start in range(
            0,
            len(rows),
            rows_per_document
        ):

            batch = rows[
                start:start + rows_per_document
            ]

            body = "\n".join(
                f"row {start + i + 2}: "
                + " | ".join(
                    f"{c}: {value(v)}"
                    for c, v in zip(cols, row)
                    if value(v)
                )
                for i, row in enumerate(batch)
            )

            text = (
                f"Workbook: {path.name}\n"
                f"Sheet: {sheet}\n"
                f"Columns: {', '.join(cols)}\n"
                f"{body}"
            )

            docs.append(
                make_doc(
                    text,
                    {
                        "source_type": "excel",
                        "file": path.name,
                        "path": str(path),
                        "sheet": str(sheet),
                        "row_start": start + 2,
                        "row_end": start + len(batch) + 1,
                        "file_hash": digest
                    },
                    f"excel-{digest}-{sheet}-{start}"
                )
            )

    return docs, {
        "file": str(path),
        "type": "excel",
        "status": "ok",
        "sheets": sheets_report
    }


def csv_docs(
    path: Path,
    rows_per_document: int = 20
) -> tuple[list[dict], dict]:

    docs = []

    try:
        frame = pd.read_csv(
            path,
            dtype=object,
            encoding="utf-8-sig"
        )
    except UnicodeDecodeError:
        try:
            frame = pd.read_csv(
                path,
                dtype=object,
                encoding="latin1"
            )
        except Exception as exc:
            return [], {
                "file": str(path),
                "type": "csv",
                "status": "error",
                "error": str(exc),
                "rows": 0
            }
    except Exception as exc:
        return [], {
            "file": str(path),
            "type": "csv",
            "status": "error",
            "error": str(exc),
            "rows": 0
        }

    frame = frame.dropna(
        how="all"
    ).copy()

    frame.columns = [
        column_name(c, i)
        for i, c in enumerate(frame.columns)
    ]

    frame = frame.loc[
        :,
        ~frame.columns.duplicated()
    ]

    cols = list(frame.columns)

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()[:16]

    rows = [
        [value(v) for v in row]
        for row in frame.itertuples(
            index=False,
            name=None
        )
    ]

    report = {
        "file": str(path),
        "type": "csv",
        "status": "ok",
        "rows": int(len(frame)),
        "columns": cols,
        "duplicate_rows": int(
            frame.duplicated().sum()
        ),
        "empty_cells": int(
            frame.isna().sum().sum()
        )
    }

    for start in range(
        0,
        len(rows),
        rows_per_document
    ):

        batch = rows[
            start:start + rows_per_document
        ]

        body = "\n".join(
            f"row {start + i + 2}: "
            + " | ".join(
                f"{c}: {value(v)}"
                for c, v in zip(cols, row)
                if value(v)
            )
            for i, row in enumerate(batch)
        )

        text = (
            f"CSV: {path.name}\n"
            f"Columns: {', '.join(cols)}\n"
            f"{body}"
        )

        docs.append(
            make_doc(
                text,
                {
                    "source_type": "csv",
                    "file": path.name,
                    "path": str(path),
                    "row_start": start + 2,
                    "row_end": start + len(batch) + 1,
                    "file_hash": digest
                },
                f"csv-{digest}-{start}"
            )
        )

    return docs, report


def pdf_docs(
    path: Path,
    pages_per_document: int = 3
) -> tuple[list[dict], dict]:

    docs = []
    pages = []

    try:
        reader = PdfReader(str(path))
    except Exception as exc:
        return [], {
            "file": str(path),
            "type": "pdf",
            "status": "error",
            "error": str(exc),
            "pages": 0
        }

    digest = hashlib.sha256(
        path.read_bytes()
    ).hexdigest()[:16]

    for number, page in enumerate(
        reader.pages,
        1
    ):

        text = page.extract_text() or ""

        pages.append({
            "page": number,
            "characters": len(text),
            "has_text": bool(text.strip())
        })

    for start in range(
        0,
        len(pages),
        pages_per_document
    ):

        selected = pages[
            start:start + pages_per_document
        ]

        text_parts = []

        for p in selected:

            page_text = (
                reader.pages[
                    p["page"] - 1
                ].extract_text()
                or ""
            )

            text_parts.append(
                f"Page {p['page']}:\n{page_text}"
            )

        text = (
            f"PDF: {path.name}\n"
            + "\n\n".join(text_parts)
        )

        docs.append(
            make_doc(
                text,
                {
                    "source_type": "pdf",
                    "file": path.name,
                    "path": str(path),
                    "page_start": selected[0]["page"],
                    "page_end": selected[-1]["page"],
                    "file_hash": digest
                },
                f"pdf-{digest}-{start + 1}"
            )
        )

    return docs, {
        "file": str(path),
        "type": "pdf",
        "status": "ok",
        "pages": len(pages),
        "pages_without_extractable_text": sum(
            not p["has_text"]
            for p in pages
        )
    }


def main():

    parser = argparse.ArgumentParser(
        description="Analyze multilingual Excel, CSV and PDF data for BIS RAG"
    )

    parser.add_argument(
        "--input",
        default="datasets"
    )

    parser.add_argument(
        "--output",
        default="data/multilingual_documents.json"
    )

    parser.add_argument(
        "--report",
        default="data/multilingual_quality_report.json"
    )

    parser.add_argument(
        "--rows-per-document",
        type=int,
        default=20
    )

    parser.add_argument(
        "--pages-per-document",
        type=int,
        default=3
    )

    args = parser.parse_args()

    root = Path(args.input)

    files = sorted(
        p
        for p in root.rglob("*")
        if p.is_file()
        and p.suffix.lower() in SUPPORTED
    )

    documents = []
    reports = []

    for path in files:

        if path.suffix.lower() == ".pdf":

            docs, report = pdf_docs(
                path,
                args.pages_per_document
            )

        elif path.suffix.lower() == ".csv":

            docs, report = csv_docs(
                path,
                args.rows_per_document
            )

        else:

            docs, report = excel_docs(
                path,
                args.rows_per_document
            )

        documents.extend(docs)
        reports.append(report)

        print(
            f"{report['status'].upper():7} {path}"
        )

    now = datetime.now(
        timezone.utc
    ).isoformat()

    Path(
        args.output
    ).parent.mkdir(
        parents=True,
        exist_ok=True
    )

    Path(
        args.output
    ).write_text(
        json.dumps(
            {
                "created_at": now,
                "file_count": len(files),
                "document_count": len(documents),
                "documents": documents
            },
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    Path(
        args.report
    ).write_text(
        json.dumps(
            {
                "created_at": now,
                "file_count": len(files),
                "document_count": len(documents),
                "files": reports
            },
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    print(
        f"Created {len(documents)} documents from {len(files)} files"
    )


if __name__ == "__main__":
    main()