# LEGO ERP - Setup Guide: Supabase

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Copy the **Project URL** and **anon/public key** from Settings → API

## Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to execute

This will create:
- `ingredients` table
- `transactions` table
- `staff_profiles` table
- `alerts` table
- Indexes for performance
- Stored functions (get_shopping_list, record_stock_in, record_stock_out)
- Seed data with sample ingredients

## Step 3: Configure Environment

Create `.env` file in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Enable Row Level Security (RLS)

For MVP, you may disable RLS for simplicity. For production:

```sql
-- Enable RLS on tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Public read access (for dashboard)
CREATE POLICY "Public read" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Public read" ON transactions FOR SELECT USING (true);

-- Authenticated write (for staff via LIFF)
CREATE POLICY "Staff insert" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Step 5: Test Connection

```bash
cd apps/web
npm install
npm run dev
```

Navigate to http://localhost:3000 and verify:
- Dashboard loads
- Ingredients page shows sample data
- Shopping list shows items below min_qty

## Troubleshooting

**"Table not found" error**
→ Ensure schema.sql ran successfully in SQL Editor

**"Invalid API key" error**
→ Check .env values are correct

**CORS errors**
→ Check Supabase project's allowed domains in Settings → API
