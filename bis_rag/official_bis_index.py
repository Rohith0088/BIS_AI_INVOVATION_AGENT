#!/usr/bin/env python3
"""
Official BIS index builder using Selenium.

This script loads the BIS official search pages and extracts IS-code-like records
into a JSON file that the app can use as a live official-source fallback index.
It intentionally avoids changing unrelated app code and is scoped to the Standard Finder.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, Iterable, List

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

ROOT = Path(__file__).resolve().parent
OUTPUT_PATH = ROOT / "data" / "official_bis_index.json"

BIS_SEARCH_URLS = [
    "https://www.bis.gov.in/know-your-standard/?lang=en",
    "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en",
    "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en",
]


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def is_standard_code(value: str) -> bool:
    return bool(re.search(r"\bIS\s*\d{2,6}(?:\s*[:\-]\s*\d{4})?\b", value, re.IGNORECASE))


def extract_codes_from_text(text: str) -> List[str]:
    matches = re.findall(r"\bIS\s*\d{2,6}\s*(?:[:\-]\s*\d{4})?\b", text, re.IGNORECASE)
    seen = set()
    results = []
    for match in matches:
        cleaned = re.sub(r"\s+", " ", match).strip()
        cleaned = re.sub(r"\s*[:-]\s*", ":", cleaned, count=1)
        if cleaned.upper().startswith("IS") and cleaned not in seen:
            seen.add(cleaned)
            results.append(cleaned)
    return results


def build_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1600,1200")
    options.add_argument("--user-agent=Mozilla/5.0 BIS-Official-Indexer")
    return webdriver.Chrome(options=options)


def collect_records() -> Dict[str, Dict[str, str]]:
    records: Dict[str, Dict[str, str]] = {}
    driver = build_driver()
    try:
        for url in BIS_SEARCH_URLS:
            driver.get(url)
            WebDriverWait(driver, 20).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            body_text = normalize_text(driver.find_element(By.TAG_NAME, "body").text)
            for code in extract_codes_from_text(body_text):
                normalized = code.upper().replace(" ", "")
                records.setdefault(normalized, {
                    "source": url,
                    "source_title": "BIS official website",
                    "year": "Not specified",
                    "summary": "Official BIS page record indexed from the BIS website.",
                    "category": "Official BIS / Standards",
                    "department": "BIS",
                    "scope": "Official source record from the BIS website.",
                    "isMandatoryQCO": False,
                })
    finally:
        driver.quit()
    return records


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    records = collect_records()
    with OUTPUT_PATH.open("w", encoding="utf-8") as file:
        json.dump(records, file, indent=2, ensure_ascii=False)
    print(f"Saved {len(records)} official BIS records to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
