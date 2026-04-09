# SARC Chain Workflow

**Purpose:** Structured 4-agent review before any multi-file code change.

**When to use:** Any change affecting multiple files, database schema, auth, or shared utilities.

**Time estimate:** 10-20 minutes for full chain.

---

## Pre-Check: Is SARC Needed?

| Change Type | SARC Required? |
|-------------|---------------|
| Single file, simple UI change | No — go direct to worker |
| Multiple files in same app | Yes |
| Database schema change | Yes |
| Auth or permission change | Yes |
| New shared utility | Yes |
| RPC function signature change | Yes |

---

## Step 1: The Surveyor (5 min)

**Objective:** Map the architecture before any change.

**Output:** Architecture map showing:
- All files involved
- Database tables and columns affected
- API/RPC calls and their callers
- Shared code dependencies
- Potential collision points

**Checklist:**
- [ ] List all files that will change (direct)
- [ ] List all files that depend on changed files (indirect)
- [ ] Map data flow (how data moves through system)
- [ ] Identify shared/cross-cutting concerns
- [ ] Flag any unknown components

**If Surveyor finds unknown architecture:** Pause and map first. Don't proceed blind.

---

## Step 2: The Analyzer (5 min)

**Objective:** Assess file-by-file impact and consequences.

**Output:** Impact assessment showing:
- Exact files requiring changes
- Change type (CREATE/MODIFY/DELETE/REPLACE/ALTER)
- Breaking changes
- Database migration requirements
- Downstream propagation (who calls changed functions)

**Checklist:**
- [ ] Every file change documented
- [ ] Breaking changes flagged and migration path defined
- [ ] Database migration: how to apply safely, how to rollback
- [ ] Test coverage impact assessed

**If breaking change found:** Must have migration strategy before proceeding.

---

## Step 3: The Risk Evaluator (5 min)

**Objective:** Hunt for blind spots, edge cases, vulnerabilities.

**Output:** Risk report with:
- Critical risks (block implementation)
- Medium risks (must address before deploy)
- Edge cases not handled
- Security concerns
- Concurrency issues

**Critical risk checklist:**
- [ ] Data loss scenarios
- [ ] Security vulnerabilities (injection, auth bypass)
- [ ] System crash scenarios
- [ ] Race conditions

**Edge case checklist:**
- [ ] Empty data states
- [ ] NULL/undefined values
- [ ] Very long inputs
- [ ] Special characters (Thai, emoji)
- [ ] Concurrent access

**If critical risk without mitigation:** Block until fixed.

---

## Step 4: The Critic (5 min)

**Objective:** Quality gate — approve or reject the plan.

**Output:** VERDICT (APPROVED or REVISION REQUIRED)

**Quality checklist:**
- [ ] Architecture fully mapped
- [ ] All impacted files identified
- [ ] Breaking changes documented
- [ ] Critical risks have mitigations
- [ ] Medium risks acknowledged
- [ ] Edge cases handled or documented
- [ ] No redundant complexity
- [ ] Rollback plan exists
- [ ] Tests cover happy path + edge cases

**If REVISION REQUIRED:** Send back to specific agent with exact revision orders. Do not proceed until APPROVED.

---

## Step 5: Implementation

Only after Critic issues APPROVED:

1. Create branch: `git checkout -b feature/your-feature-name`
2. Make changes following the approved plan
3. Run tests (if exist): `cd apps/web && npm run test:run`
4. Build verification: `cd apps/web && npm run build`
5. Commit: `git add -A && git commit -m "feat: your feature description"`
6. Push: `git push origin feature/your-feature-name`
7. Create PR or merge to main

---

## SARC Anti-Patterns (Don't Do These)

- **Don't skip agents** — "I know this already" leads to missed edge cases
- **Don't rush Critic** — If approved too fast, quality gate failed
- **Don't ignore REVISION REQUIRED** — Sending back is the loop working correctly
- **Don't skip migration planning** — Schema changes without rollback plan = danger
- **Don't copy vulnerable patterns** — If existing code has bugs, fix them, don't replicate

---

## Example SARC Run

```
User: "Add supplier management to track which supplier provides which ingredients"

CTO: "This touches schema, RPCs, web pages, and LIFF pages. Running SARC chain."

Surveyor: [Maps 4 tables, 3 RPCs, 6 pages, 2 apps. Finds shared supabase client.]
Analyzer: [Finds breaking RPC signature change. Proposes migration: add new RPC, deprecate old.]
Risk Evaluator: [Finds CASCADE DELETE risk, concurrent stock-out race condition, formula injection in supplier names.]
Critic: [VERDICT: REVISION REQUIRED. Risk Evaluator missed formula injection mitigation. Send back.]

[After revision...]
Critic: [VERDICT: APPROVED. All risks mitigated.]

Implementation begins.
```

---

## File Location
`workflows/sarc-chain.md`
