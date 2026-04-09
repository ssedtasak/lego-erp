-- ============================================
-- Bulk Edit Feature: Tables and Functions
-- ============================================

-- Table: stock_adjustments
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id TEXT,
  total_items INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: stock_adjustment_items
CREATE TABLE IF NOT EXISTS stock_adjustment_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  adjustment_id UUID NOT NULL REFERENCES stock_adjustments(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  old_qty NUMERIC NOT NULL,
  new_qty NUMERIC NOT NULL,
  difference NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_created_at ON stock_adjustments(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_adjustment_items_adjustment_id ON stock_adjustment_items(adjustment_id);

-- Function: bulk_update_stock
CREATE OR REPLACE FUNCTION bulk_update_stock(
  p_adjustments JSONB,
  p_staff_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_adjustment_id UUID;
  v_item JSONB;
  v_ingredient_id UUID;
  v_old_qty NUMERIC;
  v_new_qty NUMERIC;
  v_difference NUMERIC;
  v_count INTEGER := 0;
BEGIN
  INSERT INTO stock_adjustments (staff_id, total_items, note)
  VALUES (p_staff_id, jsonb_array_length(p_adjustments), p_note)
  RETURNING id INTO v_adjustment_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_adjustments)
  LOOP
    v_ingredient_id := (v_item->>'ingredient_id')::UUID;
    v_old_qty := (v_item->>'old_qty')::NUMERIC;
    v_new_qty := (v_item->>'new_qty')::NUMERIC;
    v_difference := v_new_qty - v_old_qty;

    UPDATE ingredients
    SET current_qty = v_new_qty
    WHERE id = v_ingredient_id;

    INSERT INTO stock_adjustment_items (adjustment_id, ingredient_id, old_qty, new_qty, difference)
    VALUES (v_adjustment_id, v_ingredient_id, v_old_qty, v_new_qty, v_difference);

    v_count := v_count + 1;
  END LOOP;

  UPDATE stock_adjustments SET total_items = v_count WHERE id = v_adjustment_id;
  RETURN v_adjustment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
