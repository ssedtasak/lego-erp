# LEGO ERP — Restaurant Stock Management

A modular restaurant management system for tracking ingredient stock via web dashboard.

## Tech Stack

- **Web**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages

## Quick Start

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema via SQL Editor:
   - Copy contents of `supabase/schema.sql`
   - Paste into Supabase SQL Editor
3. Copy `.env.example` → `.env` and fill in your credentials

### 2. Set up Web Dashboard

```bash
cd apps/web
npm install
npm run dev
```

Dashboard runs at: http://localhost:3000

## Project Structure

```
LEGOerp/
├── SPEC.md
├── apps/
│   └── web/          # Next.js dashboard
├── supabase/
│   └── schema.sql    # Database schema
├── tools/             # Python automation scripts
├── docs/              # Setup guides
└── workflows/         # CI/CD workflows
```

## Features

| Feature | Status |
|---------|--------|
| Ingredient Management | ✅ |
| Stock In/Out | ✅ |
| Expense Reports | ✅ |
| Shopping List | ✅ |
| CSV Import/Export | ✅ |
| Print-friendly Reports | ✅ |

---

Built with modular architecture — LEGO-style, extensible.
