# LEGO ERP: Restaurant MVP — Product Requirements Document

## 1. Objective

- Real-time tracking of ingredient stock levels (in/out)
- Owner manages all stock via web dashboard
- Clear visibility into ingredient costs and purchase needs

---

## 2. User Roles

| Role | Description |
|------|-------------|
| **Owner** | Full access — manage ingredients, view reports, configure system |

---

## 3. Key Features

### Web Dashboard (Owner)

| Feature | Description | Status |
|---------|-------------|--------|
| **Login** | Email/password auth via Supabase | ✅ Done |
| **Ingredient Management** | Add / edit / delete ingredients + unit + cost per unit | ✅ Done |
| **CSV Import** | Bulk import ingredients via CSV template | ✅ Done |
| **Inventory Monitor** | Table showing current stock for all ingredients | ✅ Done |
| **Stock Usage Report** | Track OUT transactions with period selector + print view | ✅ Done |
| **Expense Summary** | Total spending on ingredients (from Stock-In transactions) | ✅ Done |
| **Reports** | Spending trends, charts, date range filters | ✅ Done |
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
| `staff_id` | TEXT | User ID who logged this |
| `note` | TEXT | Optional transaction note |
| `created_at` | TIMESTAMPTZ | Transaction timestamp |

### Table: `staff_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `line_user_id` | TEXT | LINE user ID (legacy, from LIFF app) |
| `auth_user_id` | UUID | Supabase auth user ID |
| `display_name` | TEXT | User display name |
| `role` | TEXT | Role ('owner', 'staff') |
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

| Layer | Technology | Implementation |
|-------|------------|----------------|
| **Web Frontend** | Next.js 14 (App Router) | ✅ `apps/web/` — Vercel |
| **Backend & Database** | Supabase (PostgreSQL) | ✅ 4 tables, 5 RPC functions |
| **Auth** | Supabase Auth (email/password) | ✅ RLS disabled for simplicity |

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

### Phase 1 — Foundation ✅ COMPLETE
1. [x] Set up Supabase project
2. [x] Run `supabase/schema.sql`
3. [x] Configure `.env` with credentials
4. [x] Disable RLS (simplified auth)
5. [x] Enable Supabase Email Auth
6. [x] Create owner account

### Phase 2 — Web Dashboard ✅ COMPLETE
7. [x] Bootstrap Next.js app (`apps/web`)
8. [x] Build ingredient CRUD (add/edit/delete/import)
9. [x] Build inventory monitor
10. [x] Build expense reports with charts
11. [x] Build shopping list
12. [x] Build stock usage report with print view
13. [x] Add login page with auth
14. [x] Deploy to Vercel

### Phase 3 — Future
- [ ] Add more ingredient categories
- [ ] Supplier management
- [ ] Export reports to PDF
- [ ] Email notifications for low stock

---

## 7. Restructure Notes (2026-04-09)

**Web-Only Mode:** LIFF app removed. All stock management now via web dashboard.

| Before | After |
|--------|-------|
| LIFF app for staff | Web dashboard for owner |
| LINE login | Email/password login |
| Mobile-first | Desktop/iPad-first |

---

## 8. Environment & URLs

| Environment | URL |
|-------------|-----|
| Web Dashboard (Production) | https://web-ten-sigma-95.vercel.app |
| Web Dashboard (Local) | http://localhost:3000 |

---

## 9. Success Metrics

- Owner sees stock levels instantly ✅
- CSV import/export for bulk operations ✅
- Print-friendly reports for paper records ✅
- System stock accuracy ≥ 90% vs. physical count ✅
