# BIS Consumer and Industry Expansion Datasets

These files extend the original BIS PDF-derived knowledge base with 33 curated question-answer records drawn from official BIS webpages accessed on 28 August 2026. The data is separated into consumer-focused and industry-focused records and retains source provenance for every row.

| File | Purpose | Records |
|---|---|---:|
| `consumer_focused.csv` | Consumer verification, hallmarking, complaints, consumer rights, and BIS Care guidance | 15 |
| `industry_focused.csv` | Product certification, QCOs, Scheme X, laboratories, FMCS, hallmarking businesses, and refinery guidance | 18 |
| `bis_extra_consumer_industry.csv` | Combined ingestion file | 33 |
| `source_registry.csv` | Deduplicated official source list | 9 |

The record columns are `record_id`, `audience`, `domain`, `question_or_intent`, `answer`, `keywords`, `source_title`, `source_url`, `source_last_updated`, `accessed_on`, and `provenance_note`. For RAG ingestion, use `question_or_intent` and `answer` as the primary semantic text, while retaining the remaining columns as metadata.

Operational details such as fees, portal behavior, licence validity, and regulatory scope can change. The `provenance_note` field flags records that should be rechecked against the live BIS page before a user relies on them for a transaction, filing, purchase, or compliance decision. These datasets are intended for retrieval and assistance, not as a substitute for the current BIS notification, QCO, regulation, product manual, or official portal.
