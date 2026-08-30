# BIS Sahayak

BIS Sahayak is an evidence-oriented assistant for Bureau of Indian Standards (BIS) information. It combines a React and Express application with a Python retrieval-augmented generation (RAG) pipeline for BIS datasets, IS-number discovery, certification guidance, and user chat history.

## Project Overview

- React 19 and Vite frontend in `BIS-Sahayak-main/`
- Express and TypeScript backend with MySQL integration
- OpenRouter-compatible AI chat provider
- Standard Finder backed by BIS dataset IS-number search
- Login and signup with MySQL user records
- Chat messages saved against the logged-in user and conversation ID
- Python ingestion tools for CSV, Excel, PDF, and web-source data
- FAISS and LangChain support for retrieval and embeddings
- Dataset index containing BIS source metadata and IS numbers

This project uses RAG and embedding-index construction. It does not fine-tune or train a language model.

## Repository Structure

```text
BIS-Sahayak-main/   React frontend and Express API
bis_rag/            Python ingestion, retrieval, and dataset tools
bis_rag/datasets/   BIS source datasets
bis_rag/data/       Generated indexes and local retrieval data
```

## Requirements

- Node.js 20 or newer
- Python 3.10 or newer
- MySQL 8 or compatible MySQL server
- OpenRouter API key for live AI responses

## Configuration

Create local environment files from the variable names below. Never commit real credentials.

`BIS-Sahayak-main/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=bis_sahayak
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-4o-mini
BIS_LLM_MODEL=openai/gpt-4o-mini
BIS_EMBEDDING_MODEL=text-embedding-3-small
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
NODE_ENV=development
```

`bis_rag/.env`:

```dotenv
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
BIS_LLM_MODEL=openai/gpt-4o-mini
BIS_EMBEDDING_MODEL=text-embedding-3-small
MULTILINGUAL_TOP_K=2
MULTILINGUAL_DOCS=data/multilingual_documents.json
MULTILINGUAL_VECTOR_DIR=data/multilingual_faiss
```

## Run the Application

```powershell
cd BIS-Sahayak-main
npm install
npm run dev
```

Open `http://127.0.0.1:3000/`.

The server initializes the `bis_sahayak` database tables for users, standards, and chat messages. Ensure MySQL is running and the database credentials are valid.

## Deploy on Render

Set the Render service **Root Directory** to `BIS-Sahayak-main`, with:

```text
Build Command: npm install && npm run build
Start Command: npm run start
```

Add the variables from `BIS-Sahayak-main/.env.example` in Render's Environment settings. `DB_HOST=localhost` will not work on Render because it points to the Render container, not your local computer. Use a reachable managed MySQL host and allow Render's outbound connection. Never upload a real `.env` file or commit credentials.

## Build and Validate

```powershell
cd BIS-Sahayak-main
npm run build
npm run lint
```

Useful API checks:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
Invoke-RestMethod "http://127.0.0.1:3000/api/is-codes/search?q=IS%2016415"
```

## Dataset and RAG Workflow

From `bis_rag/`:

```powershell
python load_bis_datasets.py
python multilingual_ingest.py
python multilingual_agent.py --rebuild
```

The ingestion workflow creates searchable documents and indexes. Refresh the indexes whenever source datasets change.

## Important Data and Security Notes

- `.env` files are intentionally excluded from this repository.
- API keys and database passwords must remain local secrets and should be rotated if exposed.
- Use authorized BIS sources and respect BIS copyright and licensing terms.
- Treat AI output as informational guidance and verify current BIS notifications before compliance decisions.
- Production deployments should add secure sessions, HTTPS, rate limiting, request validation, and authenticated API authorization.
