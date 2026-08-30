#!/usr/bin/env python3
"""
Load all BIS datasets from the datasets folder and extract IS codes.
Creates an index for fast lookups in the AI bot and Standard Finder.
"""

import json
import os
from pathlib import Path
from typing import Optional
import pandas as pd

DATASETS_DIR = Path(__file__).parent / "datasets"
OUTPUT_INDEX = Path(__file__).parent / "data" / "is_codes_index.json"


def extract_is_codes_from_csv(csv_path: Path) -> dict:
    """Extract IS codes and product info from CSV files."""
    is_codes = {}
    try:
        df = pd.read_csv(csv_path, encoding='utf-8', nrows=1000)
        
        # Look for columns that might contain IS codes
        for col in df.columns:
            if 'is' in col.lower() or 'code' in col.lower() or 'standard' in col.lower():
                for value in df[col].dropna().unique():
                    code_str = str(value).strip()
                    if 'IS' in code_str.upper() and ':' in code_str:
                        parts = code_str.split(':')
                        if len(parts) == 2:
                            year = parts[1].strip()
                            if year.isdigit() and 1980 <= int(year) <= 2026:
                                is_codes[code_str] = {
                                    'source': csv_path.name,
                                    'year': year
                                }
        
        # Also look for product/category columns
        for col in df.columns:
            if any(x in col.lower() for x in ['product', 'category', 'type', 'title', 'name']):
                is_codes[f"_{csv_path.stem}_{col}"] = {
                    'column': col,
                    'source': csv_path.name
                }
                
    except Exception as e:
        print(f"Error processing {csv_path.name}: {e}")
    
    return is_codes


def load_all_datasets() -> dict:
    """Load and index all BIS datasets."""
    print(f"🔍 Loading datasets from {DATASETS_DIR}")
    
    all_is_codes = {}
    dataset_stats = {
        'csv_files': 0,
        'excel_files': 0,
        'pdf_files': 0,
        'total_is_codes': 0
    }
    
    # Process CSV files
    for csv_file in DATASETS_DIR.glob("*.csv"):
        print(f"  📄 Processing {csv_file.name}...")
        is_codes = extract_is_codes_from_csv(csv_file)
        all_is_codes.update(is_codes)
        dataset_stats['csv_files'] += 1
        dataset_stats['total_is_codes'] += len(is_codes)
    
    # Process Excel files
    for xlsx_file in DATASETS_DIR.glob("*.xlsx"):
        print(f"  📊 Processing {xlsx_file.name}...")
        try:
            xls = pd.ExcelFile(xlsx_file)
            for sheet in xls.sheet_names[:3]:  # First 3 sheets to avoid huge files
                df = pd.read_excel(xlsx_file, sheet_name=sheet, nrows=500)
                for col in df.columns:
                    if 'is' in col.lower() or 'code' in col.lower():
                        for val in df[col].dropna().unique():
                            code_str = str(val).strip()
                            if 'IS' in code_str.upper() and ':' in code_str:
                                all_is_codes[code_str] = {'source': xlsx_file.name, 'sheet': sheet}
            dataset_stats['excel_files'] += 1
            dataset_stats['total_is_codes'] += len([k for k in all_is_codes if k.startswith('IS')])
        except Exception as e:
            print(f"  ⚠️  Error processing {xlsx_file.name}: {e}")
    
    print(f"\n✅ Discovered {dataset_stats['total_is_codes']} IS codes")
    print(f"   CSV files: {dataset_stats['csv_files']}")
    print(f"   Excel files: {dataset_stats['excel_files']}")
    
    return all_is_codes, dataset_stats


def save_is_code_index(is_codes: dict, output_path: Path) -> None:
    """Save IS code index for fast lookups."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(is_codes, f, indent=2, ensure_ascii=False)
    print(f"💾 Saved IS code index to {output_path}")


def ingest_datasets() -> None:
    """Placeholder - datasets are ready for ingestion into vector store."""
    print("\n🚀 Datasets are ready for vector store ingestion.")
    print("   To build the multilingual FAISS index, run: python multilingual_agent.py --rebuild")


if __name__ == "__main__":
    # Step 1: Extract IS codes from datasets
    is_codes, stats = load_all_datasets()
    save_is_code_index(is_codes, OUTPUT_INDEX)
    
    # Step 2: Note about ingestion
    ingest_datasets()
    
    print("\n✨ Dataset indexing complete! IS codes are now searchable in the AI Bot and Standard Finder.")

