from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import date, datetime
from pathlib import Path
from typing import Any

import pandas as pd

SUPPORTED = {".xlsx", ".xls", ".xlsm", ".xlsb", ".ods"}


def safe_value(value: Any) -> str:
    if pd.isna(value):
        return ""
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return str(value).strip()


def clean_column(name: Any, index: int) -> str:
    text = re.sub(r"\s+", " ", safe_value(name))
    return text if text else f"column_{index + 1}"


def row_text(columns: list[str], row: list[Any]) -> str:
    pairs = [f"{col}: {safe_value(val)}" for col, val in zip(columns, row)]
    return " | ".join(p for p in pairs if not p.endswith(": "))


def process_workbook(path: Path, rows_per_document: int) -> tuple[list[dict], dict]:
    docs, sheet_reports = [], []
    try:
        sheets = pd.read_excel(path, sheet_name=None, dtype=object)
    except Exception as exc:
        return [], {"file": str(path), "status": "error", "error": str(exc), "sheets": []}

    file_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    for sheet_name, frame in sheets.items():
        frame = frame.dropna(how="all").copy()
        frame.columns = [clean_column(c, i) for i, c in enumerate(frame.columns)]
        frame = frame.loc[:, ~frame.columns.duplicated()]
        columns = list(frame.columns)
        duplicate_rows = int(frame.duplicated().sum())
        report = {"sheet": str(sheet_name), "rows": int(len(frame)), "columns": columns, "duplicate_rows": duplicate_rows, "empty_cells": int(frame.isna().sum().sum()), "status": "ok"}
        sheet_reports.append(report)
        if not columns or frame.empty:
            continue
        summary = {"file": path.name, "sheet": str(sheet_name), "rows": len(frame), "columns": columns, "non_empty_by_column": {c: int(frame[c].notna().sum()) for c in columns}}
        docs.append({"id": f"excel-summary-{file_hash[:16]}-{len(docs)}", "text": f"Workbook: {path.name}\nSheet: {sheet_name}\nSheet summary: {json.dumps(summary, ensure_ascii=False)}", "metadata": {"source_type": "excel", "file": path.name, "path": str(path), "sheet": str(sheet_name), "row_start": 0, "row_end": 0, "file_hash": file_hash}})
        rows = [[safe_value(v) for v in row] for row in frame.itertuples(index=False, name=None)]
        for start in range(0, len(rows), rows_per_document):
            batch = rows[start:start + rows_per_document]
            body = "\n".join(f"row {start + i + 2}: {row_text(columns, row)}" for i, row in enumerate(batch))
            docs.append({"id": f"excel-rows-{file_hash[:16]}-{sheet_name}-{start}", "text": f"Workbook: {path.name}\nSheet: {sheet_name}\nColumns: {', '.join(columns)}\n{body}", "metadata": {"source_type": "excel", "file": path.name, "path": str(path), "sheet": str(sheet_name), "row_start": start + 2, "row_end": start + len(batch) + 1, "file_hash": file_hash}})
    return docs, {"file": str(path), "status": "ok", "file_hash": file_hash, "sheets": sheet_reports}


def main():
    parser = argparse.ArgumentParser(description="Batch-ingest Excel workbooks for the BIS RAG agent")
    parser.add_argument("--input", default="datasets", help="Folder containing Excel files")
    parser.add_argument("--output", default="data/excel_documents.json")
    parser.add_argument("--report", default="data/excel_quality_report.json")
    parser.add_argument("--rows-per-document", type=int, default=20)
    args = parser.parse_args()
    root = Path(args.input)
    files = sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED)
    all_docs, reports = [], []
    for path in files:
        docs, report = process_workbook(path, args.rows_per_document)
        all_docs.extend(docs)
        reports.append(report)
        print(f"{report['status'].upper():7} {path}")
    payload = {"documents": all_docs, "created_at": datetime.utcnow().isoformat() + "Z", "file_count": len(files), "document_count": len(all_docs)}
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    Path(args.report).write_text(json.dumps({"created_at": payload["created_at"], "file_count": len(files), "document_count": len(all_docs), "files": reports}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Indexed {len(files)} workbooks into {len(all_docs)} documents")
    print(f"Quality report: {args.report}")


if __name__ == "__main__":
    main()