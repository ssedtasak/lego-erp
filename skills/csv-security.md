# CSV Security Skill

**Purpose:** Checklist for safe CSV export implementation.

**When to use:** Before implementing any CSV export feature.

**Trigger:** This skill was created after finding formula injection vulnerability in existing CSV exports.

---

## CSV Export Security Checklist

### 1. Formula Injection Prevention

**Dangerous characters at start of cell:** `=`, `+`, `-`, `@`, Tab, Carriage Return

These characters in spreadsheet apps (Excel, Google Sheets) can cause the cell to be interpreted as a formula.

**Mitigation:**
```typescript
function preventFormulaInjection(value: string): string {
  const str = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;  // Prefix with single quote
  }
  return str;
}
```

**Checklist:**
- [ ] All text fields pass through formula injection prevention
- [ ] Names, notes, descriptions all sanitized
- [ ] Unit fields sanitized (unlikely but possible)

### 2. RFC 4180 Escaping

Fields containing commas, double quotes, or newlines must be escaped.

**Mitigation:**
```typescript
function escapeCSVField(value: string): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
```

**Checklist:**
- [ ] All fields with potential commas escaped
- [ ] Thai text handled (UTF-8 BOM)
- [ ] Newlines replaced or removed
- [ ] Double quotes escaped as `""`

### 3. Empty State Handling

**Mitigation:**
- Hide export button when data is empty
- OR show toast message: "ไม่มีรายการที่จะส่งออก"

**Checklist:**
- [ ] Export button hidden/disabled when no data
- [ ] User gets feedback if export attempted on empty data

### 4. Safe Export Pattern

Use `lib/csv.ts` utility (preferred):

```typescript
import { exportToCSV } from '@/lib/csv';

// All data is automatically:
// 1. Formula injection prevented
// 2. RFC 4180 escaped
// 3. UTF-8 BOM for Thai support

const headers = ['ชื่อ', 'ราคา'];
const rows = data.map(item => [item.name, item.price]);
exportToCSV(headers, rows, 'filename.csv');
```

**Never use this vulnerable pattern:**
```typescript
// VULNERABLE - DO NOT USE
const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
```

---

## CSV Export Location Reference

| Page | File | Status |
|------|------|--------|
| Ingredients | `apps/web/src/app/ingredients/page.tsx` | ✅ Fixed (uses lib/csv.ts) |
| Transactions | `apps/web/src/app/transactions/page.tsx` | ✅ Fixed (uses lib/csv.ts) |
| Shopping List | `apps/web/src/app/shopping-list/page.tsx` | ✅ Fixed (uses lib/csv.ts) |

---

## Skill Version
**v1.0** — Created 2026-04-09 after CSV formula injection vulnerability found

---

## File Location
`skills/csv-security.md`
