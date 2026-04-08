# LEGO ERP — Next Steps Plan
## CTO Review Output

**Repo:** https://github.com/ssedtasak/lego-erp

---

## Phase 1 — Security (Before any real use)

| Priority | Task | How | Status |
|----------|------|-----|--------|
| 🔴 P0 | **Enable RLS on Supabase** | Run `supabase/schema.sql` RLS statements + create policies per table | BLOCKED |
| 🔴 P0 | **Add web dashboard auth** | Supabase Auth + email/password or LINE login for owner | BLOCKED |
| 🟡 P1 | **Create staff role in LINE** | Distinguish owner vs staff in `staff_profiles` | PENDING |

### RLS Policy Design (for reference)
```sql
-- Example policies (not yet applied)
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner: full access" ON ingredients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff: read-only" ON ingredients FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Phase 2 — Notifications

| Priority | Task | How | Status |
|----------|------|-----|--------|
| 🟡 P1 | **Get LINE Notify token** | Register at notify-bot.line.me, add to `.env` | BLOCKED |
| 🟡 P1 | **Set up low-stock cron** | Configure `tools/notify_low_stock.py` via cron or Edge Function | PENDING |
| 🟢 P2 | **Test end-to-end alerts** | Verify LINE message received when `current_qty < min_qty` | PENDING |

---

## Phase 3 — Production Deployment

| Priority | Task | How | Status |
|----------|------|-----|--------|
| 🟡 P1 | **Deploy web to Vercel** | `cd apps/web && vercel --prod` | PENDING |
| 🟡 P1 | **Deploy LIFF to Railway/Netlify** | Connect repo, set `.env`, deploy | PENDING |
| 🟡 P1 | **Update LINE Console URLs** | Replace ngrok URL with production URLs in LINE Developer Console | PENDING |

---

## Phase 4 — Polish

| Priority | Task | Status |
|----------|------|--------|
| 🟢 P2 | Add transaction notes field to LIFF forms | ✅ DB has `note` field, verify LIFF sends it |
| 🟢 P2 | Add more ingredients | Can add via dashboard |
| 🟢 P2 | Dashboard improvements (sorting, filtering, export) | PENDING |

---

## Quick Wins (Do First)

1. **Get LINE Notify token** — Costs nothing, enables the low-stock alert feature
2. **Add one policy** — Even a simple "authenticated users only" policy blocks casual access
3. **Deploy to Vercel** — Free tier, one command, production URL for LINE Console

---

## Files Modified by CTO Review

| File | Change |
|------|--------|
| `SPEC.md` | Marked all completed items ✅, added blockers table, updated tech stack, added current issues |
| `.gitignore` | Created — ignores node_modules, .next, dist, .env, etc. |
| `LEGOerp/` | Git repo initialized, committed, pushed to https://github.com/ssedtasak/lego-erp |
