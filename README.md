# LEGO ERP — Restaurant Stock MVP

A modular restaurant management system for tracking ingredient stock via LINE and a web dashboard.

## Tech Stack

- **Web**: Next.js 14 (App Router)
- **Mobile**: Vite + React + LINE LIFF
- **Backend**: Supabase (PostgreSQL)
- **Notifications**: LINE Messaging API

## Quick Start

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema:
   ```bash
   psql -h <your-host> -U postgres -d postgres -f supabase/schema.sql
   ```
3. Copy `.env.example` → `.env` and fill in your credentials

### 2. Set up Web Dashboard

```bash
cd apps/web
npm install
npm run dev
```

### 3. Set up LINE LIFF App

1. Go to [LINE Developer Console](https://developers.line.biz/)
2. Create a LIFF app
3. Add the LIFF ID to your `.env`
4. Run the dev server:
   ```bash
   cd apps/liff
   npm install
   npm run dev
   ```

### 4. Set up LINE Notifications

```bash
pip install -r tools/requirements.txt
python tools/notify_low_stock.py
```

## Project Structure

```
LEGOerp/
├── SPEC.md
├── apps/
│   ├── web/          # Next.js dashboard (Owner)
│   └── liff/          # LINE LIFF app (Staff)
├── supabase/
│   └── schema.sql    # Database schema
├── tools/             # Python automation scripts
└── docs/              # Setup guides
```

## Modules

| Module | Status |
|--------|--------|
| Stock-In / Stock-Out | ✅ Planned |
| Ingredient Management | ✅ Planned |
| Expense Summary | ✅ Planned |
| Shopping List | ✅ Planned |
| Low Stock Alerts | ✅ Planned |

---

Built with the WAST framework in mind — modular, extensible, LEGO-style.
