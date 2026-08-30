# BIS RAG Data Catalog and Implementation Plan

## Executive summary

The SIH26107 brief calls for a trusted BIS knowledge and service-navigation platform, not a generic chatbot. The corpus therefore needs authoritative evidence for standards discovery, compulsory-certification status, product manuals, certification workflows, fees, testing laboratories, licence records, FAQs, complaints, legal rules, notifications, and multilingual navigation. BIS’s **Know Your Standard** facility is the central source because BIS describes it as a one-stop record for a selected standard, including the standard document, amendments, gazette notifications, testing and inspection scheme, licences, laboratories, classification details, and committee information [1].

There is not one verified, static “BIS training dataset” that covers all of these topics. The correct approach is to build a continuously refreshed evidence corpus from official BIS web pages, BIS service portals, public PDFs, and authorized APIs/exports. Do not fine-tune on copied BIS standards by default. Indian Standards are BIS publications and may be copyright or access controlled; use public metadata and links unless your organization has permission to store the full text [2].

## Source inventory

| Priority | Dataset or source | What to collect | Download/access link | Recommended refresh |
|---|---|---|---|---|
| 1 | Know Your Standard | IS-number/keyword metadata, standard status, amendments, notifications, product classification, testing/inspection information, licence/lab/committee links | [BIS Know Your Standard](https://www.bis.gov.in/know-your-standard/?lang=en); [service portal](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails) | 7 days; status and links 1–3 days |
| 1 | Public Indian Standards | Publicly offered or “Indigenous Indian Standards – Free Download” records; title, scope, edition, amendments, URL, access rights | [Published Standards portal](https://www.services.bis.gov.in/php/BIS_2.0/dgdashboard/Published_Standards) | 7 days |
| 1 | Compulsory certification/QCOs | Products, applicable scheme, IS number, QCO notification, effective date, upcoming QCOs | [Compulsory products](https://www.bis.gov.in/product-certification/products-under-compulsory-certification/?lang=en); [Scheme I](https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-i-mark-scheme/?lang=en); [Scheme II](https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/?lang=en); [Scheme IV](https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-4/?lang=en); [Scheme X](https://www.bis.gov.in/products-under-compulsory-certification-scheme-x/?lang=en); [upcoming QCOs](https://www.bis.gov.in/upcoming-qcos-notified-and-due-for-implementation/?lang=en) | 1–3 days |
| 1 | Product certification process | Scheme I/II/IV/X process, application steps, required documents, inspection, testing, grant/renewal/suspension rules | [Certification overview](https://www.bis.gov.in/product-certification/product-certification-overview/?lang=en); [process page](https://www.bis.gov.in/product-certification/product-certification-process/?lang=en); [apply for a licence](https://www.bis.gov.in/apply-for-a-license/?lang=en) | 7 days |
| 1 | Product manuals and inspection/testing schemes | Product-specific scope, raw materials, process controls, test equipment, sampling, frequency, acceptance criteria, marking/labeling | [Product manual archive](https://www.bis.gov.in/product-manual-archive/?lang=en); [product-specific guidelines](https://www.bis.gov.in/product-certification/product-specific-guidelines/?lang=en) | 7–14 days |
| 1 | Fees and marking charges | Application, processing, inspection, testing, marking fee tables and notifications; retain effective dates | [BIS product certification fee](https://www.bis.gov.in/product-certification/product-certification-fee/?lang=en) | 1–3 days |
| 1 | Testing facilities and charges | IS-wise tests, equipment, test charges, sample requirements, laboratory contacts | [Testing facilities and charges](https://www.bis.gov.in/laboratorys/testing-facility-and-testing-charges/?lang=en); [laboratory services overview](https://www.bis.gov.in/laboratorys/laboratory-services-overview/?lang=en) | 1–3 days |
| 1 | BIS recognized/empanelled laboratories | Laboratory name, location, scope, IS/test capability, recognition status, contact details | [BIS laboratory portal](https://www.bis.gov.in/laboratorys/laboratory-services-overview/?lang=en) | 1–3 days |
| 1 | Licence and registration records | Domestic and foreign licensees, IS/product, licence number, status, scope, validity where publicly exposed | [FMCS licensees](https://www.bis.gov.in/fmcs/licensee/?lang=en); [FMCS list service](https://www.services.bis.gov.in/php/BIS_2.0/fmcs/All_fmcs_list.php); [BIS online information](https://www.bis.gov.in/product-certification/online-information/?lang=en) | 1–3 days |
| 1 | Product-certification FAQs | Consumer and industry questions about eligibility, application, marking, testing, renewal, and complaints | [Product certification FAQ](https://www.bis.gov.in/product-certification/product-certification-faq/?lang=en) | 14 days |
| 1 | Laboratory FAQs | Where and how products can be tested, sample and test-related guidance | [Laboratory FAQ](https://www.bis.gov.in/laboratorys/laboratory-services-overview/laboratory-faq/?lang=en) | 14 days |
| 1 | BIS legal and regulatory corpus | BIS Act, Rules, Regulations, statutory definitions, powers, and applicable procedures | [BIS Act, Rules and Regulations](https://www.bis.gov.in/the-bureau/bis-act-rules-and-regulations/?lang=en); [India Code](https://www.indiacode.nic.in/) | 30 days |
| 1 | Notifications and gazettes | QCOs, amendments, effective dates, withdrawals, corrigenda, statutory notices | [e-Gazette of India](https://egazette.nic.in/); [BIS news/notifications](https://www.bis.gov.in/) | 1–7 days |
| 2 | Know Your Standard user manual | Portal field definitions and user workflow, useful for query routing and UI help | [User manual PDF](https://www.bis.gov.in/wp-content/uploads/2022/08/20220524_KYSP_Writeup-2-compressed.pdf) | 90 days |
| 2 | BIS annual reports and publications | Institutional context, service descriptions, historical programs; not a primary source for current fees/status | [BIS publications](https://www.bis.gov.in/publications/) | 30–90 days |
| 3 | NABL accreditation data | Independent lab accreditation and scope cross-check; do not substitute for BIS recognition | [NABL](https://nabl-india.org/) | 14 days |
| 3 | India Open Government Data | Search for Bureau of Indian Standards publisher datasets and APIs; ingest only records actually returned by the catalog | [data.gov.in](https://www.data.gov.in/) | 30 days |
| 3 | Multilingual support data | Language names, ISO/Bhashini language identifiers, terminology glossary, translated UI strings; translations must not override the English/source evidence | [Bhashini](https://bhashini.gov.in/) | Review with every API/version change |

## What is actually downloadable

Public PDFs and static files include many product manuals, QCO guidance, the Know Your Standard user manual, legal documents, and selected public standards. The BIS pages also expose dynamic service portals for standards, licences, and laboratory records. Treat these as **crawl/API sources**, not as a single file to download. Before ingestion, save the raw response, source URL, HTTP retrieval time, page title, content hash, language, and access-rights label.

The source manifest in `sources.yaml` is a conservative starter list. Add every linked PDF and structured endpoint discovered from the landing pages, but keep the landing page as a citation record. For dynamic portals that require JavaScript or POST requests, implement a dedicated connector after inspecting network requests and complying with BIS terms; do not guess endpoints or bypass authentication.

## Corpus schema

Each chunk should contain `source_id`, `authority`, `title`, `url`, `retrieved_at`, `published_at` when available, `effective_from` and `effective_to` for rules/fees, `document_type`, `language`, `access_rights`, `is_current`, `product`, `is_number`, `scheme`, `laboratory`, `licence_number`, and the extracted `text`. Use deterministic IDs based on source URL, page number/section, and content hash. Store tables as structured records in addition to text chunks so the agent can answer exact fee, status, and lab queries without relying only on prose retrieval.

## Accuracy controls

The API uses a minimum retrieval score and returns `INSUFFICIENT_EVIDENCE` when no passage clears the threshold. The answer prompt requires a citation for every factual sentence and disallows outside knowledge, invented fees, unverified compulsory status, and unsupported legal conclusions. For production, add a second deterministic verifier that checks that every citation number exists, each cited passage semantically entails the sentence, and the answer does not contain uncited dates, money amounts, IS numbers, or licence numbers.

For current status questions, prefer a recent BIS record over an older publication, prefer a direct BIS service record over a secondary explanation, and reject conflicting records unless the answer explicitly reports the conflict and supplies both dated citations. Answers should be short and directly responsive; no generic background should be added when the user asks for a specific fact.

## References

[1]: https://www.bis.gov.in/know-your-standard/?lang=en "BIS Know Your Standard"
[2]: https://www.bis.gov.in/terms-condition/?lang=en "BIS Terms and Conditions"
