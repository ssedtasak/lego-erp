# LEGO ERP Agent System v0.98.0

LEGO ERP is a restaurant stock management system built with Next.js and Supabase.

## Droid Registry

All project droids are defined in `.factory/droids/`.

| Droid | File | Purpose |
|-------|------|---------|
| **cto** | `cto.md` | Project Lead - receives requests, plans work, coordinates team |
| **frontend-worker** | `frontend-worker.md` | React/Next.js UI development |
| **backend-worker** | `backend-worker.md` | Supabase/API development |
| **qa-worker** | `qa-worker.md` | Testing & validation |
| **devops-worker** | `devops-worker.md` | CI/CD, Vercel deployment |
| **docs-worker** | `docs-worker.md` | Documentation |
| **research-worker** | `research-worker.md` | Codebase analysis |
| **surveyor** | `surveyor.md` | Architectural mapping |
| **analyzer** | `analyzer.md` | Impact assessment |
| **risk-evaluator** | `risk-evaluator.md` | Risk hunting |
| **critic** | `critic.md` | Quality gates |

---

## Workflow

```
User Request → CTO (plan) → Workers → CTO Review → User
```

---

## Project Structure v0.98.0

```
LEGOerp/
├── apps/web/              # Next.js 14 dashboard
│   └── src/app/          # Pages: ingredients, inventory, reports, etc.
├── workflows/             # SOPs
│   ├── sarc-chain.md
│   ├── add-feature.md
│   └── fix-bug.md
├── skills/                # Reusable templates
│   ├── csv-security.md
│   └── code-review-checklist.md
├── supabase/
│   └── schema.sql        # DB schema + RPC functions
├── tools/                # Python scripts
└── .factory/droids/    # Agent definitions
```

---

## Build Commands

```bash
# Web Dashboard
cd apps/web && npm install && npm run dev

# Tests
cd apps/web && npm run test:run

# Deploy
cd apps/web && vercel deploy --prod
```

---

## Coding Standards

| Aspect | Rule |
|--------|------|
| **Indentation** | 2 spaces |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State** | React hooks only |

---

## Self-Improvement Loop

```
Bug found → Fix → Update workflow/skill → System gets stronger
```

---

## Web-Only Mode (2026-04-09)

LIFF app removed. All stock management via web dashboard.
