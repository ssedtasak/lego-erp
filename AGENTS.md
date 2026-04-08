# Repository Guidelines

LEGO ERP is a modular restaurant stock management system built with Next.js, Vite/React (LINE LIFF), and Supabase.

## Project Structure

```
LEGOerp/
├── apps/
│   ├── web/                # Next.js 14 dashboard (Owner)
│   │   └── src/app/         # App Router pages
│   └── liff/               # Vite + React LINE app (Staff)
│       └── src/pages/      # Stock-in/out forms
├── supabase/
│   └── schema.sql         # DB schema + stored procedures
├── tools/                  # Python automation scripts
├── docs/                   # Setup guides
├── reports/               # Structured analysis outputs (Brand_ReportType.md)
├── outputs/                # Agent work-in-progress (brand/agent specific)
├── .tmp/                   # Temporary files (disposable, regenerated as needed)
└── SPEC.md                 # Product requirements (source of truth)
```

## Output Routing

| Output Type | Destination |
|-------------|-------------|
| Final data/tables | Google Sheets / Slides (cloud access) |
| Structured reports | `reports/<BrandName>_<ReportType>.md` |
| Agent drafts & WIP | `outputs/<AgentName>/` |
| Raw data / intermediates | `.tmp/` |
| Credentials / secrets | `.env` only — NEVER anywhere else |

## Build & Development Commands

```bash
# Web Dashboard (Owner)
cd apps/web && npm install && npm run dev

# LINE LIFF App (Staff)
cd apps/liff && npm install && npm run dev

# Python tools
cd tools && pip install -r requirements.txt
```

## Coding Standards

| Aspect | Rule |
|--------|------|
| **Indentation** | 2 spaces (no tabs) |
| **Language** | TypeScript for web/liff, Python 3.12+ for tools |
| **Styling** | Tailwind CSS (utility-first) |
| **State** | React hooks (useState, useEffect) — no Redux needed for MVP |

## Supabase Conventions

- All DB operations use Supabase client via `@supabase/ssr` (web) or `@supabase/supabase-js` (liff)
- Use RPC functions for complex operations (`record_stock_in`, `record_stock_out`, `get_shopping_list`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code

## File Naming

- Pages: `page.tsx` (Next.js App Router convention)
- Components: PascalCase (e.g., `StockInForm.tsx`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- LIFF pages: PascalCase in `/pages/` folder

## Testing

For MVP, manual testing via browser is acceptable. When adding tests:
- Use Playwright for E2E (web dashboard flows)
- Unit test DB functions via Supabase SQL Editor
- LIFF app testing requires LINE Lite or ngrok

## Parallel Work with Subagents

For tasks that can run independently, launch multiple workers in parallel using the Task tool.

### Available Workers

| Worker | Purpose |
|--------|---------|
| **cto** | Project Lead — receives requests, plans work, coordinates team |
| **frontend-worker** | React/Vite/TypeScript frontend development |
| **backend-worker** | Express/Node.js/PostgreSQL backend development |
| **qa-worker** | Testing & validation (unit, integration, e2e) |
| **devops-worker** | Docker, CI/CD, Railway deployment |
| **docs-worker** | Documentation (PRD, README, API docs) |
| **research-worker** | Codebase analysis, improvement suggestions |

### Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **frontend-design** | UI/UX best practices | Any React component |
| **browser-navigation** | Browser automation | E2E testing, UI validation |
| **security-review** | Security auditing | Before shipping auth/RBAC |
| **review** | Code review for PRs | PR review |
| **human-writing** | Natural writing | Documentation |
| **threat-model-generation** | STRIDE threat modeling | Security audits |

### CTO Worker Workflow

The **cto** worker coordinates the team:
1. User submits request → CTO receives
2. CTO plans approach and breaks down tasks
3. CTO delegates to appropriate workers (frontend, backend, qa, etc.)
4. Workers execute in parallel
5. CTO reviews results and reports back

### Launching Parallel Work

**Rule: User approves plan first** — don't launch parallel work without confirmation.

```
Example: User asks to "Implement comments feature"
CTO response: "Approving plan to launch 4 workers in parallel:
  1. backend-worker: Create comments API (routes + service)
  2. frontend-worker: Build comments UI component
  3. qa-worker: Write comments tests
  4. docs-worker: Update PRD
  
Shall I proceed?"
```

**Rules for Parallel Work:**
| Rule | Why |
|------|-----|
| Independent tasks only | Tasks must not depend on each other's output |
| One concern per worker | Each worker handles one specific piece |
| Results combine into one PR | Parallel work = one feature = one PR |

## Workflow

1. Read `SPEC.md` before modifying any feature
2. For multi-step tasks, plan with CTO first before launching workers
3. Make changes in the appropriate app directory
4. Test locally before pushing
5. Document any new environment variables in `.env.example`

## Architecture Notes

- **Web (Owner)**: Next.js 14 App Router, server-side data fetching, Supabase auth optional for MVP
- **LIFF (Staff)**: Vite + React, LINE Login via LIFF SDK, direct Supabase writes
- **Notifications**: Python cron job → LINE Notify API (see `tools/notify_low_stock.py`)

## Adding New Features

When extending LEGO ERP:

1. Update `SPEC.md` first with the new feature spec
2. Add DB schema changes to `supabase/schema.sql`
3. Build web page in `apps/web/src/app/<feature>/`
4. Build LIFF form in `apps/liff/src/pages/`
5. Add Python automation if needed in `tools/`

Follow the LEGO principle: modules are independent and composable.
