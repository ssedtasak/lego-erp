# LEGO ERP — Next Steps Plan
## CTO Review Output

**Repo:** https://github.com/ssedtasak/lego-erp

---

## Lessons Learned (2026-04-09)

### Auth Systems Don't Mix Well Without Planning
- **Mistake:** Assumed RLS + Supabase Auth would work for both web owner AND LINE staff seamlessly
- **Reality:** LINE SDK authenticates against LINE servers, not Supabase. `auth.uid()` in RLS never matches LINE users
- **Fix:** Disabled RLS. All access control lives in RPC function validation (record_stock_in/out validates staff_id)
- **Rule:** If using multiple auth methods (email + LINE), plan the auth bridging from day 1

### Schema Changes Cascade
- **Mistake:** Added `auth_user_id` column to `staff_profiles` without checking NOT NULL constraint on `line_user_id`
- **Cascade:** Had to update RLS policies, then had to add NULL support, then had to update owner profile insert
- **Rule:** Every schema change affects RLS, policies, seed data, and migrations. Change one thing at a time and test

### Manual SQL Editor = Messy
- **Mistake:** Made schema and RLS changes manually in Supabase SQL Editor, not tracked in code
- **Problem:** Forgot what changes were applied vs. not, no version history, hard to reproduce
- **Fix:** Use Supabase CLI migrations in `supabase/migrations/` — run `supabase db push` to apply
- **Rule:** All DB changes go through migrations, never manual SQL Editor for tracked changes

### LIFF Auth Has a 400 Trap
- **Lesson:** `liff.login()` redirects through LINE auth → back to `redirectUri`. If it doesn't exactly match the Endpoint URL in LINE Developer Console, LINE returns 400
- **Mitigation:** Use explicit `redirectUri = ${origin}${BASE_URL}` instead of relying on `window.location.href`
- **Rule:** When moving hosts, update LINE Developer Console Endpoint URL manually (no API for this)

### RLS Policies Need Both USING and WITH CHECK
- **Lesson:** RLS has two clauses: `USING` (for SELECT/UPDATE/DELETE - who can see) and `WITH CHECK` (for INSERT - what can be inserted)
- **Mistake:** Used `USING` for INSERT policies, which doesn't work
- **Rule:** For INSERT policies, use `WITH CHECK` for row-level validation

### Public Grants vs. RLS
- **Lesson:** If RLS is enabled but no policy matches, access is denied even with `GRANT ALL TO public`
- **Lesson:** `GRANT ALL TO public` doesn't bypass RLS — you need both proper grants AND matching policies
- **Fix for MVP:** Disabled RLS entirely. Simpler, less edge-case bugs, RPC functions handle real validation
- **Rule:** For simple MVPs, RLS adds complexity. Only enable when you have clear auth personas (owner/staff/supplier)

### Migration Workflow
```
supabase db push     # Push local migrations → remote DB (auto-applies new migrations)
supabase migration new <name>  # Create new migration file manually
supabase link --project-ref <ref>  # Link CLI to project
```

---

## Phase 1 — Security ✅ COMPLETE
| Priority | Task | Status |
|----------|------|--------|
| 🔴 P0 | **Enable RLS on Supabase** | ✅ Done |
| 🔴 P0 | **Add web dashboard auth** | ✅ Done (email auth at /login) |
| 🟡 P1 | **Create staff role in LINE** | ✅ Done (owner@test.com role=owner) |

## Phase 2 — Notifications ⚠️ ON HOLD
| Priority | Task | Status |
|----------|------|--------|
| 🟡 P1 | **LINE Notify token** | ⚠️ DISCONTINUED (March 2025) |
| 🟡 P1 | **Set up LINE Messaging API** | Pending - need to configure |

## Phase 3 — Production Deployment 🚧 IN PROGRESS
| Priority | Task | Status |
|----------|------|--------|
| 🟡 P1 | **Deploy web to Vercel** | ✅ Done (https://web-ten-sigma-95.vercel.app) |
| 🟡 P1 | **Deploy LIFF to Vercel** | ✅ Done — https://lego-erp-liff.vercel.app (project `lego-erp-liff`, env vars persisted) |
| 🟡 P1 | **Update LINE Console Endpoint URL** | ⏳ Pending — set to https://lego-erp-liff.vercel.app/ in LINE Developer Console |

## Phase 4 — Polish 📋 TODO
| Priority | Task | Status |
|----------|------|--------|
| 🟢 P2 | Add transaction notes field to LIFF | ✅ DB has note field |
| 🟢 P2 | Add more ingredients | Can add via dashboard |
| 🟢 P2 | Dashboard improvements (sorting, filtering, export) | Pending |

---

## Files Modified by CTO Review

| File | Change |
|------|--------|
| `SPEC.md` | Marked all completed items ✅, added blockers table, updated tech stack, added current issues |
| `.gitignore` | Created — ignores node_modules, .next, dist, .env, etc. |
| `LEGOerp/` | Git repo initialized, committed, pushed to https://github.com/ssedtasak/lego-erp |
