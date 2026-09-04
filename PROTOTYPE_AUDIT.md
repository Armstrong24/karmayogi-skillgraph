# Karmayogi SkillGraph — PS 26101 Prototype Audit

## Implemented and working in the frontend prototype

| Problem statement capability | Prototype coverage |
| --- | --- |
| Role-based experience | Simulated Government SSO onboarding plus learner, NSSTA trainer, and ministry administrator workspaces |
| Competency profile | Editable officer role, department, qualification, experience, prior training, competency levels, evidence source, and confidence |
| Skill-gap assessment | Baseline diagnostic updates competency levels and persists them in browser storage |
| Personalized pathway | Gap-prioritized, prerequisite-aware iGOT/NSSTA course sequence with demo enrolment, learning history, adaptive feedback, and end-of-module assessments |
| Continuous updates | Passing a course assessment updates the learner Skill Passport and recommendation inputs |
| Uploaded-content assessment workflow | Trainer can select or upload material, view the secure ingestion/retrieval/generation pipeline, review representative MCQs and citations, regenerate, and approve |
| Learner analytics | Competency radar, required/current levels, confidence, primary deficit, learning hours, and pathway |
| Administrator analytics | KPIs, training-effectiveness metrics, cohort progress, departmental gap chart, clickable heatmap, officer lists, training-batch action, and CSV export |
| Emerging skills | AI/ML, government cloud/APIs, and change-management competencies plus workforce forecast |
| AI learner support | Role-aware prototype assistant with learner, trainer, admin, and Hindi quick-prompt support |
| Multilingual experience | English/Hindi authentication, navigation, learner diagnostics, learning controls, trainer RAG workflow, administrator analytics, architecture view, chart labels, feedback, and AI assistant; official source titles and citations remain in their original language |
| Security and architecture | Interactive production blueprint for SSO/RBAC, DPDP controls, AI governance, and ecosystem connectors |
| Demonstration controls | Persistent role/language selection, sign out, dark mode, and one-click data reset |
| Responsive and accessible UI | shadcn/ui primitives, semantic tokens, keyboard focus, dark theme, and responsive layouts |

## Simulated integrations — intentionally labelled in the UI

- iGOT catalogue synchronization, enrolment, completion, and publishing.
- AI competency inference from profile data.
- RAG retrieval, document/video parsing, LLM question generation, and citation verification.
- Predictive workforce analytics.
- PDF report generation.

These flows demonstrate the intended product experience but currently use local representative data and browser state.

## Required for a production implementation

1. **Identity and access:** Government SSO, RBAC enforcement, session management, and administrator audit logs.
2. **Secure backend:** API gateway, encrypted data storage, consent/retention controls, DPDP compliance, and security testing.
3. **iGOT/NSSTA connectors:** Approved API credentials, course catalogue mapping, enrolment webhooks, completion records, and retry/reconciliation jobs.
4. **AI/RAG services:** Malware-safe upload pipeline, OCR/transcription, chunking, embeddings, vector search, approved LLM, citation verification, evaluation, and human review.
5. **Competency engine:** Versioned role frameworks, evidence weighting, explainable scoring, calibration, bias checks, and assessor override.
6. **Learning capabilities:** Real course player/deep links, multilingual content, virtual labs, notifications, and learning-history sync.
7. **Analytics platform:** Event tracking, training-effectiveness measures, cohort comparisons, predictive model monitoring, and downloadable reports.
8. **Cloud readiness:** Containerized services, managed database/object storage, observability, backups, disaster recovery, autoscaling, and CI/CD.

## Recommended demo narrative

1. Open the learner profile and show evidence-backed gaps across statistical, technical, governance, and behavioural domains.
2. Complete the diagnostic and show the Skill Passport update.
3. Open the learning pathway, synchronize the representative iGOT/NSSTA catalogue, and complete a module quiz.
4. Ask SkillGraph AI why a course is recommended.
5. Switch to trainer, upload a source, generate grounded MCQs, inspect the citation, and approve an item.
6. Switch to admin, inspect the heatmap and emerging-skills forecast, assign a training batch, and export data.
