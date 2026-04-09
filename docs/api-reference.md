# LEGO ERP - API Reference

## Supabase RPC Functions

### get_shopping_list()

Returns ingredients where `current_qty < min_qty`.

**Returns:**
```json
[
  {
    "ingredient_id": "uuid",
    "name": "เนื้อหมู",
    "unit": "kg",
    "current_qty": 5,
    "min_qty": 10,
    "needed_qty": 5
  }
]
```

**Usage:**
```sql
SELECT * FROM get_shopping_list();
```

---

### record_stock_in(ingredient_id, amount, unit_price, staff_id, note)

Records stock entry and updates `current_qty`.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| p_ingredient_id | UUID | Ingredient ID |
| p_amount | NUMERIC | Quantity received |
| p_unit_price | NUMERIC | Price per unit (THB) |
| p_staff_id | TEXT | User ID (optional) |
| p_note | TEXT | Notes (optional) |

**Returns:** Transaction UUID

**Usage:**
```sql
SELECT record_stock_in(
  'uuid-here',
  5,
  180,
  'user-123',
  'ซื้อจากตลาด'
);
```

---

### record_stock_out(ingredient_id, amount, staff_id, note)

Records stock usage and decreases `current_qty`.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| p_ingredient_id | UUID | Ingredient ID |
| p_amount | NUMERIC | Quantity used |
| p_staff_id | TEXT | User ID (optional) |
| p_note | TEXT | Notes (optional) |

**Returns:** Transaction UUID

**Throws:** `"Insufficient stock"` if amount > current_qty

**Usage:**
```sql
SELECT record_stock_out(
  'uuid-here',
  2,
  'user-123',
  'ใช้ทำก๋วยเตี๋ยว'
);
```

---

### get_daily_expense(specific_date)

Returns expense summary for a given date.

**Parameters:**
| Param | Type | Default |
|-------|------|---------|
| specific_date | DATE | CURRENT_DATE |

**Returns:**
```json
{
  "total_spent": 1500.00,
  "transaction_count": 5
}
```

**Usage:**
```sql
SELECT * FROM get_daily_expense('2024-01-15');
SELECT * FROM get_daily_expense(CURRENT_DATE);
```

---

## Supabase Client Usage

### Web App (Next.js)

```typescript
import { createClient } from '@supabase/ssr';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch ingredients
const { data } = await supabase
  .from('ingredients')
  .select('*')
  .order('name');

// RPC call
const { data } = await supabase.rpc('get_shopping_list');
```

---

## Cron Schedule

| Task | Frequency | Script |
|------|-----------|--------|
| Low stock check | Daily 8:00 AM | `notify_low_stock.py` |
| Expense report | Weekly Monday | `export_expense_report.py` |

Set up via Supabase Edge Functions or external cron service.
