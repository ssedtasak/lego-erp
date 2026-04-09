# LEGO ERP: Restaurant MVP — Product Requirements Document

## 1. Objective

- Real-time tracking of ingredient stock levels (in/out)
- Staff can log data easily via LINE (no app switching)
- Owner gets a clear picture of ingredient costs and purchase needs

---

## 2. User Roles

| Role | Description |
|------|-------------|
| **Staff** | Log stock-in (receiving) and stock-out (usage) via LINE LIFF |
| **Owner** | View reports, manage ingredients, set min stock levels via Web Dashboard |

---

## 3. Key Features

### A. LINE / LIFF Interface (Staff)

| Feature | Description | Status |
|---------|-------------|--------|
| **Simple Login** | Auth via LINE profile (no password) | ✅ Done |
| **Stock-In Form** | Select ingredient → enter quantity + unit price → confirm | ✅ Done |
| **Daily Stock-Out** | Confirm end-of-day usage or current remaining stock | ✅ Done |
| **Low Stock Alert** | Push notification to LINE when ingredient drops below `min_qty` | ⚠️ Partial (db table exists, LINE Notify not connected) |

### B. Web Dashboard (Owner)

| Feature | Description | Status |
|---------|-------------|--------|
| **Ingredient Management** | Add / edit / delete ingredients + unit + cost per unit | ✅ Done |
| **Inventory Monitor** | Table showing current stock for all ingredients | ✅ Done |
| **Expense Summary** | Total spending on ingredients (from Stock-In transactions) | ✅ Done |
| **Shopping List** | Auto-generated list of ingredients below min stock | ✅ Done |

---

## 4. Database Schema

### Table: `ingredients`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Ingredient name (e.g., "เนื้อหมู") |
| `unit` | TEXT | Unit of measure (e.g., "kg", "ชิ้น") |
| `min_qty` | NUMERIC | Minimum stock threshold |
| `current_qty` | NUMERIC | Current stock level |
| `cost_per_unit` | NUMERIC | Cost per unit (THB) |
| `created_at` | TIMESTAMPTZ | Created timestamp |
| `updated_at` | TIMESTAMPTZ | Last updated timestamp |

### Table: `transactions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `ingredient_id` | UUID | FK → ingredients.id |
| `type` | TEXT | 'IN' (stock in) or 'OUT' (stock out) |
| `amount` | NUMERIC | Quantity moved |
| `unit_price` | NUMERIC | Price per unit at time of transaction |
| `total_price` | NUMERIC | Computed: `amount × unit_price` |
| `staff_id` | TEXT | LINE user ID who logged this |
| `note` | TEXT | Optional transaction note |
| `created_at` | TIMESTAMPTZ | Transaction timestamp |

### Table: `staff_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `line_user_id` | TEXT | Unique LINE user ID |
| `display_name` | TEXT | Staff display name |
| `role` | TEXT | Role (default: 'staff') |
| `created_at` | TIMESTAMPTZ | Created timestamp |
| `updated_at` | TIMESTAMPTZ | Last updated timestamp |

### Table: `alerts`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `ingredient_id` | UUID | FK → ingredients.id |
| `message` | TEXT | Alert message |
| `is_sent` | BOOLEAN | Whether alert was sent |
| `sent_at` | TIMESTAMPTZ | When alert was sent |
| `created_at` | TIMESTAMPTZ | Created timestamp |

---

## 5. Technology Stack

| Layer | Technology | Actual Implementation |
|-------|------------|----------------------|
| **Web Frontend** | Next.js 14 (App Router) | ✅ `apps/web/` — Deployed to Vercel |
| **Mobile Frontend** | Vite + React + LIFF SDK | ✅ `apps/liff/` — deployed to Vercel at https://lego-erp-liff.vercel.app |
| **Backend & Database** | Supabase (PostgreSQL) | ✅ 4 tables, 5 RPC functions, 8 seeded ingredients |
| **Auth** | Supabase Auth (email/password) | ✅ RLS enabled, email auth working |
| **Notifications** | LINE Messaging API | ⚠️ Alerts table exists, notification setup pending |

### RPC Functions

| Function | Purpose |
|----------|---------|
| `get_shopping_list()` | Returns ingredients where `current_qty < min_qty` |
| `get_daily_expense(date)` | Returns total spent and transaction count for a date |
| `record_stock_in(...)` | Insert IN transaction + update `current_qty` |
| `record_stock_out(...)` | Insert OUT transaction + update `current_qty` (with stock check) |
| `update_updated_at()` | Auto-set `updated_at` on row update |

---

## 6. Development Steps

### Phase 1 — Foundation
1. [x] Set up Supabase project
2. [x] Run `supabase/schema.sql`
3. [x] Configure `.env` with credentials
4. [x] Enable RLS on all tables (`supabase/enable_rls.sql`)
5. [x] Enable Supabase Email Auth
6. [x] Create test user (owner@test.com)

### Phase 2 — Web Dashboard (Owner)
7. [x] Bootstrap Next.js app (`apps/web`)
8. [x] Build ingredient CRUD page
9. [x] Build inventory monitor table
10. [x] Build expense summary page
11. [x] Build shopping list page
12. [x] Add login page with Supabase Auth
13. [x] Deploy to Vercel

### Phase 3 — LINE LIFF (Staff)
14. [x] Create LIFF app in LINE Developer Console
15. [x] Bootstrap Vite + React app (`apps/liff`)
16. [x] Build stock-in form
17. [x] Build stock-out form
18. [x] Integrate LINE Login (using `liff.login()` with explicit `redirectUri`)
19. [x] Deploy LIFF to Vercel — https://lego-erp-liff.vercel.app (project `lego-erp-liff`)
20. [ ] **Update LIFF Endpoint URL in LINE Developer Console** → `https://lego-erp-liff.vercel.app/` (resolves the 400 login error)

### Phase 4 — Automation & Alerts
21. [ ] Set up LINE Messaging API for push notifications (LINE Notify discontinued Mar 2025)
22. [ ] Create Edge Function or cron for low-stock alerts
23. [ ] End-to-end test

### Phase 5 — Production Polish
24. [ ] Add more ingredients
25. [ ] Dashboard improvements (sorting, filtering, export)
26. [ ] Reconcile LIFF ID across `.env` files (`apps/liff/.env` is the canonical source — `xJeOKHB7`)

---

## 7. Current Issues & Blockers

| Priority | Issue | Status |
|----------|-------|--------|
| 🔴 High | **LIFF staff authentication mismatch** — LINE users authenticate via LINE SDK (not Supabase). RLS `auth.uid()` checks fail because Supabase doesn't receive LINE auth tokens. `staff_profiles.line_user_id` exists but RLS can't use it for the `transactions` INSERT policy. RPC functions also limited to `authenticated` users. | In progress: granted `EXECUTE ON FUNCTION` to `public` and `INSERT ON transactions` to `public` to allow LINE users to call RPC functions. Still failing — needs further investigation. |
| 🔴 High | **LIFF Endpoint URL in LINE Console still points at old host** | Manual: set to `https://lego-erp-liff.vercel.app/` in LINE Developer Console |
| 🟡 Medium | **Push notifications not configured** | LINE Notify discontinued; need LINE Messaging API + channel access token |
| 🟡 Medium | **LIFF ID drift** — root `.env` has `…-Y7noXqIJ`, `apps/liff/.env` has `…-xJeOKHB7` | `apps/liff/.env` is source of truth (used at build time). Clean up root `.env` |
| 🟢 Low | **Add more ingredients** | Can add via dashboard |
| 🟢 Low | **Dashboard improvements** | Sorting, filtering, export |

---

## 8. Environment & URLs

| Environment | URL |
|-------------|-----|
| Web Dashboard (Production) | https://web-ten-sigma-95.vercel.app |
| Web Dashboard (Local) | http://localhost:3001 |
| LIFF App | https://liff.line.me/2009735486-xJeOKHB7 |
| LIFF App (Vercel host) | https://lego-erp-liff.vercel.app |
| ngrok tunnel (dev) | https://unrarefied-eugenic-azaria.ngrok-free.dev |

---

## 9. Success Metrics

- Staff spends ≤ 5 minutes/day logging stock ✅ (LIFF is simple)
- Owner sees "out of stock" items instantly via LINE alert ⚠️ (partially built)
- System stock accuracy ≥ 90% vs. physical count ✅ (direct DB updates)

---

## 10. Future Expansion (LEGO Style)

This MVP uses LEGO-style modular architecture. Future modules can be "stacked":

- **POS Module** → orders auto-deduct from stock
- **HR Module** → track which staff logged which transaction
- **Supplier Module** → link transactions to vendor invoices
