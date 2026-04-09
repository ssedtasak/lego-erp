# Code Review Checklist Skill

**Purpose:** Systematic code review for LEGO ERP features.

**When to use:** Before approving any code change, during SARC Critic phase, or before merging PRs.

---

## Pre-Review

- [ ] Code compiles (run `npm run build`)
- [ ] TypeScript passes (run `npx tsc --noEmit`)
- [ ] Tests pass (run `npm run test:run` if exists)

---

## Security Checklist

### Data Exposure
- [ ] No secrets in code (API keys, tokens in source)
- [ ] No hardcoded credentials
- [ ] `.env` not committed
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never in client-side code

### SQL/Injection
- [ ] User data escaped in any string concatenation
- [ ] Supabase RPC used instead of raw SQL
- [ ] No SQL injection vectors in note fields

### Auth/RLS
- [ ] RLS policies match intended access
- [ ] Auth checks in place for protected routes
- [ ] No auth bypass in RPC functions

### CSV/Export
- [ ] Formula injection prevention (see csv-security skill)
- [ ] RFC 4180 escaping
- [ ] Empty state handled
- [ ] UTF-8 BOM for Thai text

---

## Data Integrity Checklist

### Database
- [ ] Foreign keys defined where needed
- [ ] CHECK constraints on numeric fields (amount > 0, qty >= 0)
- [ ] NOT NULL on required columns
- [ ] Indexes on queried columns

### RPC Functions
- [ ] Validation before INSERT/UPDATE
- [ ] Proper error messages on failure
- [ ] Transaction atomicity (all-or-nothing)

### State Management
- [ ] React state properly initialized
- [ ] useEffect dependencies correct
- [ ] No stale state after updates

---

## UI/UX Checklist

### Responsive
- [ ] Works on mobile (LIFF app especially)
- [ ] No horizontal scroll on small screens

### Loading States
- [ ] Loading spinners/skeletons
- [ ] Disabled buttons during submission
- [ ] Success/error feedback to user

### Error Handling
- [ ] Error boundaries where needed
- [ ] User-friendly error messages
- [ ] No raw error exposure to users

---

## Performance Checklist

- [ ] No unnecessary re-renders
- [ ] Large lists virtualized if >100 items
- [ ] Images optimized
- [ ] No memory leaks (check useEffect cleanup)

---

## Maintainability Checklist

- [ ] Consistent naming (PascalCase for components, camelCase for utils)
- [ ] 2-space indentation
- [ ] TypeScript types defined (no `any` without reason)
- [ ] Comments on complex logic
- [ ] No commented-out dead code

---

## Testing Checklist

### Unit Tests
- [ ] Utility functions tested
- [ ] Edge cases covered (empty, null, very large)

### Manual Testing
- [ ] Happy path works
- [ ] Error path gracefully handled
- [ ] Mobile tested if LIFF change

---

## File Location
`skills/code-review-checklist.md`
