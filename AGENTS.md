# LEGO ERP Agent System v0.97.1

LEGO ERP is a modular restaurant stock management system built with Next.js, Vite/React (LINE LIFF), and Supabase.

## Droid Registry

All project droids are defined in `.factory/droids/` with version `0.97.0`.

| Droid | File | Purpose |
|-------|------|---------|
| **cto** | `cto.md` | Project Lead - receives requests, plans work, coordinates team |
| **frontend-worker** | `frontend-worker.md` | React/Vite/Next.js UI development |
| **backend-worker** | `backend-worker.md` | Supabase/API development |
| **qa-worker** | `qa-worker.md` | Testing & validation |
| **devops-worker** | `devops-worker.md` | Docker, CI/CD, Vercel deployment |
| **docs-worker** | `docs-worker.md` | Documentation (SPEC, README, API docs) |
| **research-worker** | `research-worker.md` | Codebase analysis & improvement suggestions |
| **surveyor** | `surveyor.md` | Architectural mapping and dependency tracking |
| **analyzer** | `analyzer.md` | Code modification and impact assessment |
| **risk-evaluator** | `risk-evaluator.md` | Vulnerability scanning and edge-case detection |
| **critic** | `critic.md` | Quality assurance and continuous refinement |

---

## Surveyor-Analyzer-RiskEvaluator-Critic Chain (SARC)

Before any code modification, all changes pass through this 4-agent pipeline:

```
User Request → SARC Chain → Implementation → CTO Review → User
```

### Chain Roles

| Agent | Role | Focus |
|-------|------|-------|
| **The Surveyor** | Maps architecture | All existing components, modules, dependencies |
| **The Analyzer** | Assesses changes | File-by-file impact, immediate consequences |
| **The Risk Evaluator** | Finds blind spots | Edge cases, vulnerabilities, failure modes |
| **The Critic** | Quality gates | Logic gaps, inefficiencies, unaddressed risks |

### Chain Workflow

```
1. Surveyor: "What is the current architecture? Map all connections."
2. Analyzer: "What needs to change? What breaks?"
3. Risk Evaluator: "What can go wrong? What are the edge cases?"
4. Critic: "Is the plan flawless? If not, send back to rework."
5. Only after Critic approval → Implementation phase begins
```

### SARC Input/Output

| Agent | Input | Output |
|-------|-------|--------|
| **Surveyor** | Feature request | Architecture map showing components + dependencies |
| **Analyzer** | Surveyor output + proposed changes | Impact report: files affected, consequences |
| **Risk Evaluator** | Analyzer output + implementation plan | Risk report: vulnerabilities, edge cases |
| **Critic** | All above | Approved plan OR revision orders |

### When to Use SARC

- New features touching multiple files
- Database schema changes
- Authentication/authorization changes
- Any change to shared utilities or RPC functions
- **Not needed for:** Simple UI tweaks, single-file changes, documentation fixes

### SARC Example

```
User: "Add supplier management module"

CTO: "This touches schema, web pages, LIFF pages, and RPCs.
      Launching SARC chain before implementation.
      
Surveyor: "Mapped 4 tables, 3 RPC functions, 6 pages, 2 apps.
          Found shared auth pattern in liff.ts and web lib/supabase.ts."
          
Analyzer: "Changes: 1 new table, 1 new RPC, 3 new pages.
          Impact: stock_out RPC must accept supplier_id.
          Breaking: existing stock_in signature changes."
          
Risk Evaluator: "Edge case: supplier deleted with outstanding orders.
                Edge case: concurrent stock-out during supplier invoice.
                Missing: supplier contact validation."
                
Critic: "Plan passes. BUT add CASCADE DELETE for supplier orders.
        Add unique constraint on supplier_name.
        Document breaking change in RPC signature."
        
Implementation approved with Critic's conditions.
```

---

## Standard Workflow (via CTO)

### SARC + CTO Combined Flow

```
User Request → CTO (receive + plan) → SARC Chain (if multi-file change) → Workers → CTO Review → User
```

1. **User submits request** → CTO receives
2. **CTO plans approach** → Decides if SARC chain is needed
3. **If SARC needed:** Surveyor → Analyzer → Risk Evaluator → Critic → Approval
4. **CTO asks for approval** → User confirms before launching workers
5. **Workers execute in parallel** → Independent tasks run concurrently
6. **CTO reviews results** → Quality gates, alignment with SPEC.md
7. **CTO reports back** → Summary, blockers, next steps

---

## Project Structure

```
LEGOerp/
├── apps/
│   ├── web/                    # Next.js 14 dashboard (Owner)
│   │   └── src/app/           # App Router pages
│   └── liff/                  # Vite + React LINE app (Staff)
│       └── src/pages/         # Stock-in/out forms
├── supabase/
│   └── schema.sql            # DB schema + stored procedures
├── tools/                     # Python automation scripts
├── docs/                      # Setup guides
├── reports/                   # Structured analysis outputs
├── outputs/                   # Agent work-in-progress
├── .tmp/                      # Temporary files
├── SPEC.md                    # Product requirements (source of truth)
└── .factory/
    └── droids/                # Droid definitions (v0.96.1)
```

## Output Routing

| Output Type | Destination |
|-------------|-------------|
| Final data/tables | Google Sheets / Slides |
| Structured reports | `reports/<BrandName>_<ReportType>.md` |
| Agent drafts & WIP | `outputs/<AgentName>/` |
| Raw data / intermediates | `.tmp/` |
| Credentials / secrets | `.env` only — NEVER anywhere else |

---

## Build Commands

```bash
# Web Dashboard (Owner)
cd apps/web && npm install && npm run dev

# LINE LIFF App (Staff)
cd apps/liff && npm install && npm run dev

# Python tools
cd tools && pip install -r requirements.txt
```

---

## Coding Standards

| Aspect | Rule |
|--------|------|
| **Indentation** | 2 spaces (no tabs) |
| **Language** | TypeScript for web/liff, Python 3.12+ for tools |
| **Styling** | Tailwind CSS (utility-first) |
| **State** | React hooks (useState, useEffect) — no Redux for MVP |

---

## Supabase Conventions

- Web: `@supabase/ssr` for server-side operations
- LIFF: `@supabase/supabase-js` for client-side
- RPC functions: `record_stock_in`, `record_stock_out`, `get_shopping_list`
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` client-side

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `apps/web/src/app/dashboard/page.tsx` |
| Components | PascalCase | `StockInForm.tsx` |
| Utilities | camelCase | `formatCurrency.ts` |
| LIFF pages | PascalCase in `/pages/` | `StockIn.tsx` |

---

## Testing

| Type | Target | Tool |
|------|--------|------|
| Unit | Backend services | Jest/vitest |
| Integration | API routes | Supabase SQL Editor |
| E2E | Web dashboard | Playwright |
| Manual | LIFF app | LINE Lite + ngrok |

For MVP, manual browser testing is acceptable.

---

## Adding New Features

1. Update `SPEC.md` with feature spec
2. Add DB schema changes to `supabase/schema.sql`
3. Build web page in `apps/web/src/app/<feature>/`
4. Build LIFF form in `apps/liff/src/pages/`
5. Add Python automation if needed in `tools/`

Follow the LEGO principle: modules are independent and composable.

---

## Architecture Notes

| App | Stack | Users | Auth |
|-----|-------|-------|------|
| **Web** | Next.js 14, App Router | Owner | Optional Supabase |
| **LIFF** | Vite + React | Staff | LINE Login via LIFF SDK |
| **Backend** | Supabase | Both | Row Level Security |

**Notifications**: Python cron job → LINE Notify API (`tools/notify_low_stock.py`)

---

## Self-Improvement Loop

Every failure is a chance to make the system stronger. When a bug is found or a risk is missed, follow this loop:

```
1. Identify what broke
2. Fix the tool or skill
3. Verify the fix works
4. Update the relevant workflow
5. Move on with a more robust system
```

### Self-Improvement Triggers

| Trigger | Action |
|---------|--------|
| Bug found in code | Fix bug, update fix-bug.md if pattern discovered |
| Risk missed by SARC | Update risk-evaluator.md with new risk type |
| New vulnerability found | Create/update skill (e.g., csv-security.md) |
| Better method discovered | Update relevant workflow |
| Common mistake | Add to NEXT_STEPS.md lessons learned |

### Lessons Learned Log (in NEXT_STEPS.md)

The NEXT_STEPS.md file contains a "Lessons Learned" section that documents:
- Auth mismatches (LINE vs Supabase)
- Schema change cascades
- Manual SQL Editor pitfalls
- CSV security vulnerabilities
- RLS policy mistakes

### Skill Versioning

Skills are versioned and dated:
```
## Skill Version
**v1.0** — Created YYYY-MM-DD after [event that prompted creation]
```

When a skill is updated, increment version and log what changed:
```
## Skill Version
**v1.1** — Updated YYYY-MM-DD after [reason]
- Added: [what was added]
- Fixed: [what was fixed]
```

---

## Project Structure v0.97.0

```
LEGOerp/
├── apps/
│   ├── web/                    # Next.js 14 dashboard (Owner)
│   │   └── src/app/           # App Router pages
│   └── liff/                  # Vite + React LINE app (Staff)
│       └── src/pages/         # Stock-in/out forms
├── workflows/                  # NEW: SOPs for common tasks
│   ├── sarc-chain.md          # SARC chain procedure
│   ├── add-feature.md         # Feature development SOP
│   └── fix-bug.md            # Bug fix SOP
├── skills/                     # NEW: Reusable prompt templates
│   ├── csv-security.md        # CSV escaping + formula injection
│   └── code-review-checklist.md
├── supabase/
│   └── schema.sql            # DB schema + stored procedures
├── tools/                     # Python automation scripts
├── docs/                      # Setup guides
├── reports/                   # Structured analysis outputs
├── outputs/                   # Agent work-in-progress
├── .tmp/                      # Temporary files
├── SPEC.md                    # Product requirements (source of truth)
├── NEXT_STEPS.md              # Phase tracker + lessons learned
├── AGENTS.md                  # This file
└── .factory/
    └── droids/               # Droid definitions (v0.97.0)
```
