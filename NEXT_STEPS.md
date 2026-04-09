# LEGO ERP — Next Steps Plan

**Repo:** https://github.com/ssedtasak/lego-erp

---

## Lessons Learned

### Auth Systems Don't Mix Well Without Planning
- **Lesson:** LINE SDK authenticates against LINE servers, not Supabase. `auth.uid()` in RLS never matches LINE users
- **Fix:** Disabled RLS. All access control in RPC function validation

### Schema Changes Cascade
- **Lesson:** Adding `auth_user_id` column cascaded into RLS, policies, seed data changes
- **Rule:** Every schema change affects multiple layers. Change one at a time and test

### Manual SQL Editor = Messy
- **Lesson:** Manual SQL changes aren't tracked in code
- **Fix:** Use Supabase CLI migrations in `supabase/migrations/` — run `supabase db push`

### CSV Security (Formula Injection)
- **Lesson:** CSV exports can execute as formulas in Excel if cells start with `=`, `+`, `-`, `@`
- **Fix:** Use `lib/csv.ts` `exportToCSV()` — handles RFC 4180 escaping + formula prevention

### Migration Workflow
```
supabase db push     # Push local migrations → remote DB
supabase migration new <name>  # Create new migration file
supabase link --project-ref <ref>  # Link CLI to project
```

---

## Phase 1 — Foundation ✅ COMPLETE
| Task | Status |
|------|--------|
| Set up Supabase | ✅ |
| Configure .env | ✅ |
| Disable RLS | ✅ |
| Email auth | ✅ |

## Phase 2 — Web Dashboard ✅ COMPLETE
| Task | Status |
|------|--------|
| Ingredient CRUD + Edit | ✅ |
| CSV Import + Template | ✅ |
| Inventory Monitor | ✅ |
| Stock Usage Report + Print | ✅ |
| Expense Reports + Charts | ✅ |
| Shopping List | ✅ |
| Sorting/Filtering | ✅ |

## Phase 3 — Future 📋
| Priority | Task |
|----------|------|
| 🟡 | Supplier management module |
| 🟡 | Export reports to PDF |
| 🟢 | Email notifications for low stock |
| 🟢 | Multi-user support |

---

## Web-Only Restructure (2026-04-09)
- LIFF app removed — all stock management via web dashboard
- LIFF references removed from SPEC.md, AGENTS.md
- LINE Notify script stubbed (service discontinued)
