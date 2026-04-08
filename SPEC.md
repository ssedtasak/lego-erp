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
| **Web Frontend** | Next.js 14 (App Router) | ✅ `apps/web/` — localhost:3001 |
| **Mobile Frontend** | Vite + React + LIFF SDK | ✅ `apps/liff/` — Stock-In/Out working |
| **Backend & Database** | Supabase (PostgreSQL) | ✅ 4 tables, 5 RPC functions, 8 seeded ingredients |
| **Auth** | Supabase Auth + LINE Login | ⚠️ RLS disabled — no auth on web dashboard |
| **Notifications** | LINE Messaging API / Notify | ⚠️ Alerts table exists, LINE Notify not connected |

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
4. [x] Run `supabase/disable_rls.sql` (MVP — public access, **needs fix before production**)

### Phase 2 — Web Dashboard (Owner)
5. [x] Bootstrap Next.js app (`apps/web`)
6. [x] Build ingredient CRUD page
7. [x] Build inventory monitor table
8. [x] Build expense summary page
9. [x] Build shopping list page

### Phase 3 — LINE LIFF (Staff)
10. [x] Create LIFF app in LINE Developer Console
11. [x] Bootstrap Vite + React app (`apps/liff`)
12. [x] Build stock-in form
13. [x] Build stock-out form
14. [x] Integrate LINE Login

### Phase 4 — Automation & Alerts
15. [ ] Set up `tools/notify_low_stock.py` cron — **BLOCKED**: LINE Notify token not set
16. [ ] Connect LINE Messaging API
17. [ ] End-to-end test

---

## 7. Current Issues & Blockers

| Priority | Issue | Status |
|----------|-------|--------|
| 🔴 Critical | **RLS disabled** — anyone can read/write all data | Needs fix before production |
| 🔴 Critical | **No auth on web dashboard** — anyone can edit | Needs authentication |
| 🟡 Medium | **LINE Notify token not set** — low-stock alerts not working | Token needed in `.env` |
| 🟡 Medium | **No production deployment** — using ngrok dev URL | Needs Vercel/Railway |
| 🟢 Low | **No transaction notes field in LIFF** | LIFF form already has `note` field in DB |
| 🟢 Low | **More ingredients needed** | 8 seeded, can add via dashboard |

---

## 8. Environment & URLs

| Environment | URL |
|-------------|-----|
| Web Dashboard (local) | http://localhost:3001 |
| LIFF App (local) | http://localhost:5173 |
| ngrok tunnel | https://unrarefied-eugenic-azaria.ngrok-free.dev |

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
