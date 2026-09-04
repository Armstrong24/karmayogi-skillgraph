# Karmayogi SkillGraph — SIH 2026 (PS 26101)

AI-enabled Skill Intelligence & Learning Platform for India's Official Statistical System.

- **Problem Statement ID:** 26101
- **Theme:** Smart Education
- **Organization:** MoSPI — Data Informatics & Innovation Division (DIID)
- **Category:** Software

## What this prototype covers

- Simulated Government SSO onboarding + Learner / NSSTA Trainer / Ministry Administrator workspaces
- Competency profiles, skill-gap assessment & Skill Passport
- Gap-prioritized, prerequisite-aware iGOT Karmayogi / NSSTA TPAC learning pathways
- AI-powered MCQ & quiz generation from uploaded learning material (trainer RAG workflow, simulated)
- Learner & administrator analytics dashboards (competency radar, KPIs, heatmap, CSV export)
- Multilingual (English/Hindi), role-aware AI assistant, dark mode, responsive accessible UI (shadcn/ui + React + TypeScript + Vite)

> Integrations (iGOT APIs, LLM/RAG, predictive analytics) are intentionally simulated with local representative data and labelled in the UI. See `PROTOTYPE_AUDIT.md` for the full coverage matrix and production roadmap.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · shadcn/ui · Recharts

## Run locally

```bash
npm run install:app   # installs dependencies for the app
npm run dev           # starts dev server (Vite)
```

Then open the printed URL (default http://localhost:5173) in your browser.

Or run from inside the app folder:

```bash
cd "Sr no 101 Project/project"
npm install
npm run dev
```

## Other commands (run from repo root)

| Command | Description |
| --- | --- |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript check only |
