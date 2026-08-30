# BIS Standards and Services RAG Starter

This project is a **retrieval-augmented generation** starter for the SIH26107 BIS assistant. It is intentionally evidence-first: it retrieves only indexed passages, requires a minimum retrieval score, asks the model to cite source IDs, and returns an abstention when the evidence is insufficient. It does not fine-tune the model; BIS knowledge should be refreshed by re-crawling the authoritative sources.

## 1. Install

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=...
export OPENAI_API_BASE=...   
```

## 2. Build the corpus

```bash
python ingest.py --manifest sources.yaml --out data/index.json
```

The crawler downloads HTML and PDF sources listed in `sources.yaml`, extracts text, preserves URL/title/date/type metadata, and creates a TF-IDF retrieval index. For production, replace the local TF-IDF index with a managed vector database and add dense embeddings, but keep the same metadata and answer gate.

## 3. Run the API

```bash
uvicorn app:app --reload --port 8000
curl -X POST http://localhost:8000/answer \
  -H 'content-type: application/json' \
  -d '{"question":"What is the BIS product certification process?","mode":"industry"}'
```

The response contains an answer, citations, confidence, and an abstention reason when applicable. A production UI should display the citation URL and retrieval timestamp.

## 4. LangChain agent

Install the updated requirements, then build the persistent FAISS vector store from the existing BIS index:

```bash
pip install -r requirements.txt
export OPENAI_API_KEY=...
python langchain_agent.py --rebuild ""
python langchain_agent.py --mode industry --language English "Which BIS certification process applies to my product?"
```

The LangChain implementation is in `langchain_agent.py`. It uses `langchain_openai.ChatOpenAI`, `OpenAIEmbeddings`, and `langchain_community.vectorstores.FAISS`. Set `BIS_LLM_MODEL` and `BIS_EMBEDDING_MODEL` if your OpenAI-compatible provider uses different model IDs. The first vector-store build may make one embedding request per chunk; rebuild only after the source index changes.

## 5. Grounding policy

The model is not allowed to use prior knowledge, invent fees, infer whether certification is compulsory, or provide a legal/compliance conclusion without a current authoritative source. If the retrieved passages do not directly support the question, the API returns `INSUFFICIENT_EVIDENCE`. Time-sensitive facts such as fees, licence status, laboratory availability, and compulsory-product lists must be re-indexed on a schedule and labeled with `retrieved_at`.

## 6. Important access constraint

Many complete Indian Standards are BIS-copyrighted and may require licensed purchase or portal access. Do not scrape, redistribute, or train on restricted PDFs unless BIS terms/licensing permit it. Index public metadata, public manuals, public FAQs, and links; retrieve restricted documents through an authorized BIS workflow.

## 7. Batch Excel workflow on Windows PowerShell

Create a `datasets` folder inside the project and copy all `.xlsx`, `.xls`, `.xlsm`, `.xlsb`, or `.ods` workbooks into it. Subfolders are supported.

```powershell
cd "E:\chrome\bis_rag_starter_langchain\bis_rag"
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:OPENAI_API_KEY = "sk-your-real-api-key"
python excel_ingest.py --input datasets --output data/excel_documents.json --report data/excel_quality_report.json
python excel_agent.py --rebuild
python excel_agent.py --language English "Which product has the highest value in the dataset?"
```

The first command analyzes every workbook and sheet, removes completely empty rows, normalizes column names, records duplicate rows and empty cells, and writes citation-ready row groups. The quality report is written to `data/excel_quality_report.json`. The second command creates `data/excel_faiss/`. The third command answers from the Excel evidence and cites the workbook, sheet, and row range.

To use a different input folder or smaller row groups, run:

```powershell
python excel_ingest.py --input "E:\data\bis-excel" --rows-per-document 10
```

Do not describe this as model training: it is **dataset ingestion and embedding-index construction**, which is the appropriate RAG workflow. Re-run `excel_ingest.py` and `excel_agent.py --rebuild` whenever the spreadsheets change.
