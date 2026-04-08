# CLAUDE.md — LEGO ERP

Project-specific guidance for Claude Code when working in this repo. The parent `Documents/CLAUDE.md` (WAST framework) does **not** apply here — LEGO ERP is a separate software project, not a marketing workflow.

`SPEC.md` is the source of truth for feature status. `NEXT_STEPS.md` tracks phase progress. `AGENTS.md` describes the `.factory/droids/` role system.

---

## What this project is

A modular restaurant stock-management MVP. Two user-facing apps backed by one Supabase database:

| App | Who | Stack | Hosted at |
|---|---|---|---|
| **Web dashboard** (`apps/web/`) | Owner | Next.js 14 App Router + Tailwind + `@supabase/ssr` | https://web-ten-sigma-95.vercel.app |
| **LINE LIFF app** (`apps/liff/`) | Staff | Vite + React + `@line/liff` + `@supabase/supabase-js` | https://lego-erp-liff.vercel.app |
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
│   ├── web/                # Next.js dashboard
│   │   └── src/app/        # Pages: ingredients, inventory, transactions,
│   │                       #        reports, shopping-list, alerts, login
│   └── liff/               # Vite + React LIFF app
│       ├── vercel.json     # Vercel build config (SPA rewrite)
│       ├── src/pages/      # StockIn.tsx, StockOut.tsx
│       └── src/lib/        # liff.ts (SDK init), supabase.ts
├── supabase/
│   ├── schema.sql          # Tables, triggers, RPC functions, seed data
│   ├── enable_rls.sql      # RLS policies
│   └── disable_rls.sql     # Emergency toggle
├── tools/                  # Python scripts
└── .github/workflows/
    └── deploy-liff.yml     # DISABLED (manual-only) — LIFF now on Vercel
```

## Database — what exists

Four tables: `ingredients`, `transactions` (IN/OUT), `staff_profiles` (LINE user map), `alerts`.

RPC functions (call these from the apps — do not INSERT into `transactions` directly):
- `record_stock_in(ingredient_id, amount, unit_price, staff_id, note)`
- `record_stock_out(ingredient_id, amount, staff_id, note)` — raises `Insufficient stock` if `current_qty < amount`
- `get_shopping_list()` — items where `current_qty < min_qty`
- `get_daily_expense(date)` — IN-transaction sum + count for a date

`total_price` in `transactions` is a generated column — never write to it.

---

## Environments & secrets

Three `.env` files exist — each app has its own:

| File | Prefix | Consumed by |
|---|---|---|
| `apps/liff/.env` | `VITE_*` | Vite at build time (baked into bundle) |
| `apps/web/.env.local` | `NEXT_PUBLIC_*` / server-only | Next.js |
| `.env` (repo root) | mixed | Python tools in `tools/` |

**`apps/liff/.env` is the canonical LIFF source of truth.** Current LIFF ID: `2009735486-xJeOKHB7`. If you see `…-Y7noXqIJ` anywhere, it's stale — the root `.env` still has it and should be cleaned up.

Vercel env vars (already persisted for project `lego-erp-liff`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_LINE_LIFF_ID`. `vercel deploy --prod` from `apps/liff/` works without `--build-env` flags.

**Never expose `SUPABASE_SERVICE_ROLE_KEY` in any client app.** Server actions / Python tools only.

---

## Deployment

| App | Method | Project |
|---|---|---|
| Web | Vercel git integration | `web` |
| LIFF | Vercel CLI from `apps/liff/` | `lego-erp-liff` |

For LIFF: `cd apps/liff && vercel deploy --prod`. A `.vercel/project.json` in `apps/liff/` links to the `lego-erp-liff` Vercel project (gitignored). Do **not** create `.vercel/` at the repo root — that caused 404s in the past (Vercel built from the root with no output).

The `deploy-liff.yml` GitHub Actions workflow is intentionally disabled (`workflow_dispatch` only). It targeted GitHub Pages and required `base: '/lego-erp/'` in Vite — both no longer true. Don't re-enable without reverting those changes.

---

## LIFF specifics (read before touching `apps/liff/`)

**The LIFF login 400 trap:** `liff.login()` redirects through LINE auth and back to a URL that **must exactly match** the Endpoint URL registered in the LINE Developer Console. If they drift (different host, trailing slash, sub-path), LINE responds 400.

Mitigations in current code:
- `liff.login({ redirectUri: ${origin}${BASE_URL} })` — deterministic, doesn't rely on `window.location.href`
- Init-error screen surfaces the LIFF ID + current URL so you can eyeball them against the console
- `base: '/'` in `vite.config.ts` — don't change unless also changing the host to a sub-path

When the LIFF app host changes, the LINE Developer Console Endpoint URL must be updated by hand (no API token available in this project). See LINE Console → channel `2009735486` → LIFF tab → app `2009735486-xJeOKHB7`.

---

## Running locally

```bash
# Web dashboard
cd apps/web && npm install && npm run dev     # http://localhost:3001

# LIFF app
cd apps/liff && npm install && npm run dev    # http://localhost:3000
# For actual LINE testing, expose via ngrok and temporarily point the LINE
# Console Endpoint URL at the ngrok https URL.

# Python tools
cd tools && pip install -r requirements.txt
python notify_low_stock.py
```

---

## Coding conventions

- **Indent:** 2 spaces. **TS** for `apps/`, **Python 3.12+** for `tools/`.
- **Styling:** Tailwind (utility classes). No CSS modules.
- **State:** React hooks only — no Redux/Zustand for this MVP.
- **Supabase calls:** `apps/web/` uses `@supabase/ssr`; `apps/liff/` uses `@supabase/supabase-js`. Don't mix.
- **Transactions:** always go through the RPC functions above — never manual INSERTs.
- **Secrets:** `.env` files only. Never hardcode in source, never commit.

---

## When adding a feature

1. Update `SPEC.md` (PRD) with the feature row + status
2. Add schema changes to `supabase/schema.sql` — then apply via the Supabase SQL Editor
3. Build the owner-side page in `apps/web/src/app/<feature>/`
4. Build the staff-side flow in `apps/liff/src/pages/` if applicable
5. If it needs a cron / push, add a script in `tools/`
6. Update `NEXT_STEPS.md` phase tracker

Follow the LEGO principle: modules should be independent and composable. Future planned modules: POS (orders auto-deduct stock), HR (link transactions to staff), Supplier (link IN transactions to invoices).

---

## Droid system

`.factory/droids/` defines a team of workers (`cto`, `frontend-worker`, `backend-worker`, `qa-worker`, `devops-worker`, `docs-worker`, `research-worker`) at version 0.96.1. Standard flow: user → CTO plans → workers execute in parallel → CTO reviews → user. See `AGENTS.md` for the full protocol. For small single-file changes, skip the droid system and edit directly.
