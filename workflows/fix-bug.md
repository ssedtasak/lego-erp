# Bug Fix Workflow

**Purpose:** SOP for fixing bugs found in production or during development.

**When to use:** Any bug report, error, or unexpected behavior.

---

## Step 1: Reproduce the Bug

Before fixing anything:

1. **Get exact reproduction steps** from user or error report
2. **Reproduce locally** if possible
3. **Capture error messages** (screenshot, console, logs)
4. **Identify affected component**

**Questions to answer:**
- What page/component is affected?
- What action triggers the bug?
- Does it happen every time or intermittently?
- What error message (if any) appears?

---

## Step 2: Identify Root Cause

**If UI bug:**
- Check browser console for errors
- Check network tab for failed requests
- Verify state management is correct

**If database bug:**
- Run SQL queries directly to verify data
- Check RLS policies if auth-related
- Verify RPC function behavior

**If data display bug:**
- Check API response vs UI rendering
- Verify data transformation logic

---

## Step 3: Fix the Bug

**Small fix (single file):**
1. Fix directly
2. Test
3. Commit

**Complex fix (multiple files):**
1. Run SARC chain if change affects multiple files
2. Create branch: `git checkout -b fix/bug-description`
3. Implement fix
4. Test thoroughly
5. Commit and push

---

## Step 4: Regression Check

After fix, verify:

- [ ] Original bug is fixed
- [ ] Existing functionality still works
- [ ] No new errors in console
- [ ] Build passes: `cd apps/web && npm run build`
- [ ] Tests pass (if exist)

---

## Step 5: Document the Bug Fix

**If new learning (common mistake pattern):**
1. Update `NEXT_STEPS.md` lessons learned section
2. Add to relevant workflow if process improvement needed

**Commit message format:**
```bash
git commit -m "fix: <brief description>

Root cause: <what was wrong>
Fix: <what was changed>
Tested: <how verified>"
```

---

## Bug Severity Classification

| Severity | Definition | Response Time |
|----------|------------|---------------|
| **Critical** | Data loss, security breach, system crash | Immediate fix |
| **High** | Feature broken for all users | Same day |
| **Medium** | Feature broken for some users, workaround exists | Within 3 days |
| **Low** | Minor inconvenience, UI glitch | Next sprint |

---

## Common Bug Patterns (LEGO ERP)

| Pattern | Likely Cause | Quick Fix |
|---------|-------------|-----------|
| Data not showing | RLS blocking, auth not set up | Check staff_profiles record |
| CSV download empty | Empty array or wrong data mapping | Verify data source |
| LIFF login 400 | redirectUri mismatch with LINE Console | Verify exact URL match |
| Stock went negative | No CHECK constraint, RPC validation bypassed | Add CHECK constraint |
| Formula injection in CSV | No escaping on user data | Use `lib/csv.ts` exportToCSV |

---

## File Location
`workflows/fix-bug.md`
