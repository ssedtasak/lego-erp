# LEGO ERP Agent System v0.96.1

LEGO ERP is a modular restaurant stock management system built with Next.js, Vite/React (LINE LIFF), and Supabase.

## Droid Registry

All project droids are defined in `.factory/droids/` with version `0.96.1`.

| Droid | File | Purpose |
|-------|------|---------|
| **cto** | `cto.md` | Project Lead - receives requests, plans work, coordinates team |
| **frontend-worker** | `frontend-worker.md` | React/Vite/Next.js UI development |
| **backend-worker** | `backend-worker.md` | Supabase/API development |
| **qa-worker** | `qa-worker.md` | Testing & validation |
| **devops-worker** | `devops-worker.md` | Docker, CI/CD, Vercel deployment |
| **docs-worker** | `docs-worker.md` | Documentation (SPEC, README, API docs) |
| **research-worker** | `research-worker.md` | Codebase analysis & improvement suggestions |

---

## Workflow

### Standard Flow (via CTO)

```
User Request → CTO (receive + plan) → Workers (execute) → CTO (review) → User
```

1. **User submits request** → CTO receives
2. **CTO plans approach** → Breaks into tasks, identifies parallel work
3. **CTO asks for approval** → User confirms before launching workers
4. **Workers execute in parallel** → Independent tasks run concurrently
5. **CTO reviews results** → Quality gates, alignment with SPEC.md
6. **CTO reports back** → Summary, blockers, next steps

### Direct Worker Flow

For simple tasks, launch a worker directly:

```
Task tool → Worker executes → Results returned
```

---

## Parallel Work Rules

| Rule | Reason |
|------|--------|
| Independent tasks only | Workers must not block each other |
| One concern per worker | Clear ownership and accountability |
| Results combine into one PR | One feature = one PR |
| **User approves first** | CTO must get confirmation before parallel launch |

### Example: Multi-worker Request

```
User: "Implement low-stock alerts feature"

CTO Response:
"Plan: Launch 3 workers in parallel
  1. backend-worker: Add alert_threshold column + notification RPC
  2. frontend-worker: Build alert settings UI in dashboard
  3. qa-worker: Test stock threshold logic

Shall I proceed?"
```

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
