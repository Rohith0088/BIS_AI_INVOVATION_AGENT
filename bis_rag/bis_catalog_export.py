from __future__ import annotations

import argparse
import re
from pathlib import Path
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE = "https://www.bis.gov.in"
PAGES = {
    "scheme_i": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en",
    "scheme_ii": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en",
    "scheme_iv": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-4/?lang=en",
    "scheme_x": "https://www.bis.gov.in/products-under-compulsory-certification-scheme-x/?lang=en",
}
HEADERS = {"User-Agent": "BIS-catalog-exporter/1.0"}


def normalize(value):
    return re.sub(r"\s+", " ", str(value)).strip()


def export_page(name: str, url: str, out: Path) -> int:
    response = requests.get(url, headers=HEADERS, timeout=60)
    response.raise_for_status()
    html = response.text
    (out / "raw").mkdir(parents=True, exist_ok=True)
    (out / "raw" / f"{name}.html").write_text(html, encoding="utf-8")
    try:
        tables = pd.read_html(html)
    except (ValueError, ImportError):
        tables = []
    rows = []
    for table_no, table in enumerate(tables, 1):
        table = table.copy()
        table.columns = [normalize(c) for c in table.columns]
        table = table.fillna("")
        for _, record in table.iterrows():
            item = {"source_page": name, "source_url": url, "table_number": table_no}
            item.update({str(k): normalize(v) for k, v in record.to_dict().items()})
            rows.append(item)

    # BIS pages sometimes contain a complex table that pandas cannot parse.
    # Fall back to explicit rows so category headings and notification links survive.
    if not rows:
        soup_fallback = BeautifulSoup(html, "html.parser")
        for table_no, table in enumerate(soup_fallback.find_all("table"), 1):
            category = ""
            for tr in table.find_all("tr"):
                cells = tr.find_all(["th", "td"], recursive=False)
                values = [normalize(c.get_text(" ", strip=True)) for c in cells]
                if not values:
                    continue
                if len(cells) == 1 or any(c.get("colspan") for c in cells):
                    heading = values[0]
                    if heading.lower() not in {"sr no.", "is no.", "product"}:
                        category = heading
                    continue
                if len(values) >= 3 and re.search(r"\\d", values[0]) and "is no" not in values[0].lower():
                    links = [urljoin(url, a.get("href")) for a in tr.find_all("a", href=True)]
                    rows.append({"source_page": name, "source_url": url, "table_number": table_no, "category": category, "sr_no": values[0], "is_no": values[1], "product": values[2], "notification_details": " ".join(values[3:]), "notification_urls": " | ".join(links)})
    if rows:
        pd.DataFrame(rows).to_csv(out / f"{name}.csv", index=False, encoding="utf-8-sig")
    # Save every linked PDF URL for a separate authorized download step.
    soup = BeautifulSoup(html, "html.parser")
    pdfs = sorted({urljoin(url, a.get("href")) for a in soup.find_all("a", href=True) if ".pdf" in a["href"].lower()})
    (out / f"{name}_pdf_links.txt").write_text("\n".join(pdfs), encoding="utf-8")
    return len(rows)


def main():
    parser = argparse.ArgumentParser(description="Export official BIS compulsory product tables")
    parser.add_argument("--output", default="data/bis_catalog")
    parser.add_argument("--pages", nargs="*", choices=list(PAGES), default=list(PAGES))
    args = parser.parse_args()
    out = Path(args.output); out.mkdir(parents=True, exist_ok=True)
    total = 0
    for name in args.pages:
        try:
            count = export_page(name, PAGES[name], out)
            total += count
            print(f"OK {name}: {count} table rows")
        except Exception as exc:
            print(f"WARN {name}: {exc}")
    print(f"Exported {total} rows under {out}")
    print("Note: portal-only standards/licence data may require a dedicated authorized API connector.")


if __name__ == "__main__":
    main()
