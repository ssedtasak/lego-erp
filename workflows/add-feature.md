# Add Feature Workflow

**Purpose:** SOP for adding new features to LEGO ERP.

**When to use:** Any new functionality beyond bug fixes or UI polish.

---

## Pre-Feature Checklist

- [ ] Feature documented in SPEC.md
- [ ] Scope defined (what's in, what's out)
- [ ] SARC chain completed (if multi-file change)

---

## Step 1: Document in SPEC.md

Before writing any code:

1. Open `SPEC.md`
2. Add feature row to appropriate section
3. Set status to `📋 TODO`
4. Define acceptance criteria

**Feature row template:**
```markdown
| Feature name | Description | Status |
```

---

## Step 2: Database Changes

If feature needs schema changes:

1. Edit `supabase/schema.sql`
2. Add migration file: `supabase/migrations/YYYYMMDD_feature_name.sql`
3. Test locally or via `supabase db push`
4. Verify with test queries in SQL Editor

**Checklist:**
- [ ] New table or column added to schema.sql
- [ ] Migration file created
- [ ] Indexes added for performance
- [ ] Seed data updated if needed
- [ ] RPC functions updated if needed

---

## Step 3: Web Dashboard (Owner)

Location: `apps/web/src/app/<feature>/`

**Steps:**
1. Create page: `apps/web/src/app/<feature>/page.tsx`
2. Add navigation link if needed (update relevant page)
3. Use `createClient()` from `@/lib/supabase`
4. Use Tailwind CSS classes
5. Add BackButton navigation
6. Test: `cd apps/web && npm run dev`

**Checklist:**
- [ ] Page renders without errors
- [ ] Data loads from correct source
- [ ] Forms submit correctly
- [ ] Error states handled
- [ ] Loading states shown

---

## Step 4: LIFF App (Staff)

Location: `apps/liff/src/pages/<Feature>.tsx`

**Steps:**
1. Create page component
2. Use `supabase` from `@/lib/supabase`
3. Pass `staffId` prop for audit trail
4. Use LIFF-compatible UI (mobile-first)
5. Test via LINE app or ngrok

**Checklist:**
- [ ] Page accessible from LIFF home menu
- [ ] Staff ID passed correctly
- [ ] Stock updates reflect in web dashboard
- [ ] Mobile-friendly layout

---

## Step 5: RPC Functions

If feature needs backend logic:

1. Add function to `supabase/schema.sql`
2. Grant execute: `GRANT EXECUTE ON FUNCTION ... TO public;`
3. Update `apps/liff/src/lib/supabase.ts` if needed
4. Test in SQL Editor first
5. Test via app

---

## Step 6: Documentation

- [ ] Update SPEC.md with implementation details
- [ ] Update NEXT_STEPS.md if phase changed
- [ ] Add comments to complex code
- [ ] Update README if user-facing change

---

## Step 7: Testing

**Unit tests (if test framework exists):**
```bash
cd apps/web && npm run test:run
```

**Manual testing checklist:**
- [ ] Web dashboard: owner can use feature
- [ ] LIFF app: staff can use feature
- [ ] Data persists correctly in database
- [ ] Edge cases handled

---

## Step 8: Commit & Push

```bash
git checkout -b feature/<feature-name>
git add -A
git commit -m "feat: <feature description>

- Added <component>
- Updated <files>
- Fixed <issues>"
git push origin feature/<feature-name>
```

---

## Post-Feature

- [ ] Update SPEC.md status to `✅ Done`
- [ ] Notify user of completion
- [ ] Deploy if requested

---

## File Location
`workflows/add-feature.md`
