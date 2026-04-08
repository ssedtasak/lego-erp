# LEGO ERP — Supabase Setup Visual Guide

A step-by-step guide to setting up Supabase for LEGO ERP with screenshots and common fixes.

**Thai notes:** คำแนะนำภาษาไทยสำหรับจุดสำคัญ

---

## Table of Contents

1. [Create Supabase Account](#step-1-create-supabase-account)
2. [Create New Project](#step-2-create-new-project)
3. [Copy Credentials](#step-3-copy-credentials)
4. [Run Schema SQL](#step-4-run-schema-sql)
5. [Verify Tables Created](#step-5-verify-tables-created)
6. [Common Errors & Fixes](#common-errors--fixes)

---

## Step 1: Create Supabase Account

### 1.1 Open Supabase Website

1. Open your browser (Chrome, Safari, or Edge)
2. Go to: **[https://supabase.com](https://supabase.com)**

```
[Screenshot: Supabase homepage with "Start your project" button highlighted]
```

**✅ Success:** You see the Supabase homepage with a "Start your project" button.

---

### 1.2 Sign Up for Account

**Option A: Sign up with Email (Recommended)**

1. Click **"Sign up"** (top right corner)
2. Enter your **email address** (e.g., `yourname@email.com`)
3. Enter a **password** (minimum 8 characters)
4. Click **"Create account"**

```
[Screenshot: Sign up form with email and password fields]
```

**Option B: Sign up with GitHub**

1. Click **"Sign up with GitHub"**
2. Authorize the Supabase app on GitHub

```
[Screenshot: GitHub authorization page]
```

**Thai note:** หากใช้ GitHub จะสะดวกกว่าเพราะไม่ต้องจำรหัสผ่าน

---

### 1.3 Verify Email (if using email signup)

1. Check your email inbox for a message from **Supabase**
2. Click the **"Confirm your email"** button in the email
3. You may be redirected to Supabase dashboard

```
[Screenshot: Email verification message from Supabase]
```

**✅ Success:** You see a "Email confirmed" message or are redirected to the dashboard.

**Thai note:** อาจต้องรอ 1-2 นาที ถ้าไม่ได้รับ email ให้ตรวจสอบโฟลเดอร์ Spam

---

### 1.4 Access the Dashboard

After signing up, you should see the **Supabase Dashboard**.

```
[Screenshot: Empty Supabase dashboard with "New project" button]
```

**✅ Success:** You see the dashboard with a **"New project"** button (center or top).

---

## Step 2: Create New Project

### 2.1 Click "New Project"

1. Click the **"New Project"** button

```
[Screenshot: Dashboard with "New Project" button highlighted in orange/blue]
```

**✅ Success:** A dialog or page appears for creating a new project.

---

### 2.2 Fill in Project Details

Fill in the following fields:

| Field | Value | Notes |
|-------|-------|-------|
| **Organization** | Select yours or default | Usually pre-selected |
| **Name** | `lego-erp` | Must be unique across Supabase |
| **Database Password** | (your secure password) | Write this down! You'll need it |
| **Region** | **Southeast Asia: Singapore (ap-southeast-1)** | Closest to Thailand |
| **Pricing** | Free (Free tier) | Leave as default |

```
[Screenshot: New project form with fields filled as above]
```

### ⚠️ Important Notes:

- **Name:** Use exactly `lego-erp` (lowercase, no spaces)
- **Region:** Select **Singapore** — this is the nearest region to Thailand and will give you the lowest latency
- **Password:** Save this password somewhere safe! You'll need the database password later.

**Thai note:** Region สิงคโปร์เป็นตัวเลือกที่ใกล้ที่สุด ทำให้ระบบทำงานเร็ว

---

### 2.3 Wait for Project Creation

After clicking "Create new project", Supabase will:

1. Create your PostgreSQL database
2. Set up authentication
3. Initialize the project

**This takes about 2-3 minutes.**

```
[Screenshot: Loading state with progress indicator]
```

**✅ Success:** You see your new project dashboard with:
- Project name: "lego-erp"
- Database connection details
- Quick start options

---

### 2.4 Locate Your Project

Your project should now appear in the **All projects** list on the dashboard.

```
[Screenshot: Project card showing "lego-erp" with status "Up"]
```

**✅ Success:** You see "lego-erp" in your projects list with a green dot or "Up" status.

---

## Step 3: Copy Credentials

Now you need to get your API credentials to connect LEGO ERP to Supabase.

### 3.1 Open Project Settings

1. Click on your **"lego-erp"** project
2. Click the **gear icon (⚙️)** or **"Settings"** link in the left sidebar

```
[Screenshot: Left sidebar with "Settings" link highlighted]
```

---

### 3.2 Go to API Settings

1. In the Settings page, click **"API"** (under Project Settings section)

```
[Screenshot: Settings page with "API" tab highlighted]
```

---

### 3.3 Copy These Values

You will see three important values:

#### Value 1: Project URL

```
[Screenshot: Project URL field - looks like: https://xxxxxxxxxxxx.supabase.co]
```

1. Find the field labeled **"Project URL"**
2. Click the **"Copy"** button next to it
3. Save it — you'll use this for `NEXT_PUBLIC_SUPABASE_URL`

**Example:**
```
https://abc123def456.supabase.co
```

---

#### Value 2: anon/public key

```
[Screenshot: anon key field with "Copy" button]
```

1. Find the **"anon public"** key (or "public" key)
2. Click **"Copy"** or the copy icon
3. Save it — you'll use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQy...
```

---

#### Value 3: service_role key (Optional for MVP)

```
[Screenshot: service_role key field - highlighted in red/warning color]
```

1. Find the **"service_role"** key (scroll down if needed)
2. Click **"Copy"**
3. Save it — you'll use this for `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Warning:** The service role key has full database access. Never expose this to client-side code!

**Thai note:** service_role key ใช้สำหรับ server-side เท่านั้น ห้ามใส่ใน code ที่รันบน browser

---

### 3.4 Verify Credentials Copied

You should have saved:

| Variable Name | Example Value |
|--------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abc123def456.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` |

---

## Step 4: Run Schema SQL

Now you'll create the database tables and functions for LEGO ERP.

### 4.1 Open SQL Editor

1. In the left sidebar, click **"SQL Editor"**

```
[Screenshot: Left sidebar with "SQL Editor" link]
```

**✅ Success:** You see the SQL Editor page with:
- A text editor area (where you write SQL)
- A "Run" button
- A list of saved queries on the left (if any)

---

### 4.2 Open the Schema File

1. Open the file `supabase/schema.sql` in your code editor (VS Code)
2. Copy the entire contents of the file

**Or use this quick link:** The schema is located at:
```
LEGOerp/supabase/schema.sql
```

```
[Screenshot: VS Code showing schema.sql file contents]
```

---

### 4.3 Paste Schema into SQL Editor

1. Click inside the SQL Editor text area
2. **Paste** (Ctrl/Cmd + V) the entire schema.sql content

```
[Screenshot: SQL Editor with schema content pasted]
```

**⚠️ Common Mistake:** Make sure you paste the ENTIRE content including the last line.

---

### 4.4 Run the Schema

1. Click the **"Run"** button (usually green, top right of editor)

```
[Screenshot: "Run" button highlighted in green]
```

**Or:** Press **Ctrl + Enter** (Windows/Linux) or **Cmd + Enter** (Mac)

---

### 4.5 Wait for Execution

You should see:

```
[Screenshot: Loading spinner or "Executing..." message]
```

**Execution takes about 10-30 seconds** depending on complexity.

---

### 4.6 Verify Success

**✅ Success:** You see a success message or green checkmark:

```
Success! No errors
Completed in 1.2s
```

```
[Screenshot: Success notification at bottom of SQL Editor]
```

**⚠️ Error:** If you see red text or an error message, see [Common Errors & Fixes](#common-errors--fixes) below.

---

## Step 5: Verify Tables Created

After running the schema, verify that everything was created correctly.

### 5.1 Open Table Editor

1. In the left sidebar, click **"Table Editor"**

```
[Screenshot: Left sidebar with "Table Editor" icon]
```

**✅ Success:** You see a list of tables in the left panel.

---

### 5.2 Check Tables Exist

You should see **4 tables**:

| Table Name | Should Have Columns |
|-----------|-------------------|
| **ingredients** | id, name, unit, min_qty, current_qty, cost_per_unit, created_at, updated_at |
| **transactions** | id, ingredient_id, type, amount, unit_price, total_price, staff_id, note, created_at |
| **staff_profiles** | id, line_user_id, display_name, role, created_at, updated_at |
| **alerts** | id, ingredient_id, message, is_sent, sent_at, created_at |

```
[Screenshot: Table list in Table Editor showing all 4 tables]
```

**✅ Success:** All 4 tables appear in the list.

---

### 5.3 Check Ingredients Table Has Data

1. Click on **"ingredients"** table
2. Look at the data view

```
[Screenshot: Ingredients table with sample data rows visible]
```

**✅ Success:** You see sample ingredient data including:
- เนื้อหมู (Pork)
- เนื้อไก่ (Chicken)
- ข้าว (Rice)
- น้ำมันพืช (Vegetable oil)
- etc.

**Thai note:** ควรมีข้อมูลตัวอย่าง 8 รายการ ตามที่ seed ไว้ใน schema.sql

---

### 5.4 Check Stored Functions Exist

1. Click **"Database"** in the left sidebar
2. Click **"Functions"** under your database

```
[Screenshot: Functions list showing get_shopping_list, record_stock_in, record_stock_out]
```

You should see these functions:

| Function Name | Purpose |
|--------------|---------|
| `get_shopping_list` | Returns items below minimum stock |
| `get_daily_expense` | Returns daily spending summary |
| `record_stock_in` | Records stock received + updates quantity |
| `record_stock_out` | Records stock used + updates quantity |
| `update_updated_at` | Trigger function for timestamps |

**✅ Success:** All functions are listed and marked as "Active".

---

## Step 6: Configure Environment Variables

### 6.1 Create .env File

1. Go to the **LEGOerp** project root folder
2. Create a new file named `.env` (if it doesn't exist)

**On Mac/Linux terminal:**
```bash
cd /Users/sedtasaksuvatho/Documents/LEGOerp
touch .env
```

---

### 6.2 Add Credentials to .env

Open the `.env` file and add these lines:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace the values** with the credentials you copied in Step 3.

```
[Screenshot: .env file contents in VS Code]
```

**⚠️ Important:** 
- No spaces around the `=`
- Keep the quotes around values (if any)
- Never share this file or commit it to git

**Thai note:** .env จะถูก gitignore โดยอัตโนมัติ แต่ก็ไม่ควรแชร์ไฟล์นี้

---

## Common Errors & Fixes

### Error: "relation does not exist"

**Problem:** Table or function not found when running the app.

**Cause:** Schema.sql did not run successfully.

**Fix:**
1. Go to **SQL Editor**
2. Make sure the correct project is selected (lego-erp)
3. Paste schema.sql again
4. Click **Run**
5. Wait for success confirmation

---

### Error: "Invalid API key"

**Problem:** App cannot connect to Supabase.

**Cause:** Wrong or missing credentials in .env file.

**Fix:**
1. Go to **Settings → API** in Supabase
2. Copy the **Project URL** and **anon key** again
3. Update your `.env` file
4. Restart your development server

---

### Error: "Password authentication failed"

**Problem:** Cannot connect to database.

**Cause:** Wrong database password.

**Fix:**
1. Go to **Settings → Database** in Supabase
2. Under "Connection string", click **"Reset database password"**
3. Set a new password
4. Update your connection string if needed

---

### Error: "permission denied for table"

**Problem:** Cannot read/write to tables.

**Cause:** Row Level Security (RLS) is blocking access.

**Fix for MVP (simpler approach):**
1. Go to **SQL Editor**
2. Run this command to disable RLS temporarily:

```sql
-- Disable RLS on all tables (MVP only!)
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning:** Only for MVP/development. For production, configure proper RLS policies.

---

### Error: "syntax error at or near..."

**Problem:** SQL syntax error when running schema.

**Cause:** Copied schema incorrectly or had extra characters.

**Fix:**
1. Go to [https://github.com/YOUR-REPO/LEGOerp/blob/main/supabase/schema.sql](https://github.com/YOUR-REPO/LEGOerp/blob/main/supabase/schema.sql)
2. Copy the raw content (click "Raw" button)
3. Paste fresh into SQL Editor
4. Run again

---

### Error: "region not available"

**Problem:** Cannot select Southeast Asia region.

**Cause:** Supabase free tier region limitations.

**Fix:**
1. Select any available region (the app will still work)
2. For production, consider upgrading to paid tier for Singapore region

---

### Error: CORS policy blocked

**Problem:** Browser blocks requests from localhost.

**Fix:**
1. Go to **Settings → API** in Supabase
2. Under "CORS", add your localhost URL:
   ```
   http://localhost:3000
   ```
3. Save changes

---

## Quick Reference: What You Should See

### At the End of Setup, You Have:

| Item | Status | Where to Verify |
|------|--------|----------------|
| Supabase account | ✅ Created | supabase.com/dashboard |
| Project "lego-erp" | ✅ Created | Dashboard projects list |
| 4 tables | ✅ Created | Table Editor |
| 8 sample ingredients | ✅ Seeded | Table Editor → ingredients |
| 5+ functions | ✅ Created | Database → Functions |
| .env file | ✅ Created | Project root |
| Credentials | ✅ Copied | .env file |

---

## Next Steps

Once Supabase is set up, proceed to:

1. **Set up Web Dashboard:** `docs/setup-web.md`
2. **Set up LINE LIFF App:** `docs/setup-liff.md`
3. **Configure LINE Notifications:** `tools/notify_low_stock.py`

---

## Troubleshooting Checklist

Run through this before asking for help:

- [ ] Supabase project status is "Up" (green dot)
- [ ] All 4 tables exist in Table Editor
- [ ] ingredients table has 8 sample rows
- [ ] .env file exists with correct credentials
- [ ] No errors shown in SQL Editor after running schema
- [ ] Can access https://[your-project].supabase.co in browser

---

*Created for LEGO ERP — Modular Restaurant Stock Management System*
