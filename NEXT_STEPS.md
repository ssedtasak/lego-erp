# LEGO ERP — Next Steps Plan
## CTO Review Output

**Repo:** https://github.com/ssedtasak/lego-erp

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
| 🟡 P1 | **Deploy LIFF to Vercel** | 🚧 In progress — migrated off GitHub Pages, `vercel.json` added, CLI deploy pending |
| 🟡 P1 | **Update LINE Console Endpoint URL** | ⏳ Pending — set to Vercel LIFF URL once deployed |

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
