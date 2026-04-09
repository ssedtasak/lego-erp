# CLAUDE.md — LEGO ERP

Project-specific guidance for Claude Code when working in this repo. The parent `Documents/CLAUDE.md` (WAST framework) does **not** apply here — LEGO ERP is a separate software project, not a marketing workflow.

`SPEC.md` is the source of truth for feature status. `NEXT_STEPS.md` tracks phase progress. `AGENTS.md` describes the `.factory/droids/` role system.

---

## What this project is

A modular restaurant stock-management system with one web app backed by Supabase:

| App | Who | Stack | Hosted at |
|---|---|---|---|
| **Web dashboard** (`apps/web/`) | Owner | Next.js 14 App Router + Tailwind + `@supabase/ssr` | https://web-ten-sigma-95.vercel.app |
| **Supabase** | both | PostgreSQL + RLS | project `znahiswdfvqpcvvhpnjc` |

`tools/` holds Python helper scripts (e.g. `notify_low_stock.py`). `supabase/schema.sql` is the canonical DB schema — edit there, not in the Supabase dashboard.

---

## Repo layout

```
LEGOerp/
├── SPEC.md                 # PRD — feature status lives here
├── NEXT_STEPS.md           # Phase tracker
├── AGENTS.md               # Droid roles
├── apps/
│   └── web/                # Next.js dashboard
│       └── src/app/        # Pages: ingredients, inventory, transactions,
│                           #        reports, shopping-list, alerts, login
├── supabase/
│   └── schema.sql          # Tables, triggers, RPC functions, seed data
├── tools/                  # Python scripts
└── .github/workflows/
    └── deploy-pages.yml    # GitHub Pages deployment
```

## Database — what exists

Four tables: `ingredients`, `transactions` (IN/OUT), `staff_profiles`, `alerts`.

RPC functions (call these from the apps — do not INSERT into `transactions` directly):
- `record_stock_in(ingredient_id, amount, unit_price, staff_id, note)`
- `record_stock_out(ingredient_id, amount, staff_id, note)` — raises `Insufficient stock` if `current_qty < amount`
- `get_shopping_list()` — items where `current_qty < min_qty`
- `get_daily_expense(date)` — IN-transaction sum + count for a date

`total_price` in `transactions` is a generated column — never write to it.

---

## Environments & secrets

Two `.env` locations:

| File | Prefix | Consumed by |
|---|---|---|
| `apps/web/.env.local` | `NEXT_PUBLIC_*` / server-only | Next.js |
| `.env` (repo root) | mixed | Python tools in `tools/` |

**Never expose `SUPABASE_SERVICE_ROLE_KEY` in any client app.** Server actions / Python tools only.

---

## Deployment

| App | Method | Project |
|---|---|---|
| Web | GitHub Pages | https://ssedtasak.github.io/lego-erp/ |

GitHub Pages deploys automatically via `.github/workflows/deploy-pages.yml` on push to `main`.

---

## Running locally

```bash
# Web dashboard
cd apps/web && npm install && npm run dev     # http://localhost:3000

# Python tools
cd tools && pip install -r requirements.txt
python notify_low_stock.py
```

---

## Coding conventions

- **Indent:** 2 spaces. **TS** for `apps/`, **Python 3.12+** for `tools/`.
- **Styling:** Tailwind (utility classes). No CSS modules.
- **State:** React hooks only — no Redux/Zustand for this MVP.
- **Supabase calls:** `apps/web/` uses `@supabase/ssr`.
- **Transactions:** always go through the RPC functions above — never manual INSERTs.
- **Secrets:** `.env` files only. Never hardcode in source, never commit.

---

## When adding a feature

1. Update `SPEC.md` (PRD) with the feature row + status
2. Add schema changes to `supabase/schema.sql` — then apply via the Supabase SQL Editor
3. Build the page in `apps/web/src/app/<feature>/`
4. If it needs a cron / push, add a script in `tools/`
5. Update `NEXT_STEPS.md` phase tracker

Follow the LEGO principle: modules should be independent and composable. Future planned modules: POS (orders auto-deduct stock), HR (link transactions to staff), Supplier (link IN transactions to invoices).

---

## Droid system

`.factory/droids/` defines a team of workers (`cto`, `frontend-worker`, `backend-worker`, `qa-worker`, `devops-worker`, `docs-worker`, `research-worker`) at version 0.96.1. Standard flow: user → CTO plans → workers execute in parallel → CTO reviews → user. See `AGENTS.md` for the full protocol. For small single-file changes, skip the droid system and edit directly.

---

## Web-Only Mode (2026-04-09)

LIFF app removed. All stock management via web dashboard.
