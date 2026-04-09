-- ============================================
-- Migration: Add receipt/invoice support
-- ============================================

-- Add receipt_data JSONB column to transactions table
ALTER TABLE transactions
ADD COLUMN receipt_data JSONB;

-- ============================================
-- Function: Record stock-in transaction (updated with receipt support)
-- ============================================
CREATE OR REPLACE FUNCTION record_stock_in(
  p_ingredient_id UUID,
  p_amount NUMERIC,
  p_unit_price NUMERIC,
  p_staff_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL,
  p_receipt_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Insert transaction with optional receipt_data
  INSERT INTO transactions (ingredient_id, type, amount, unit_price, staff_id, note, receipt_data)
  VALUES (p_ingredient_id, 'IN', p_amount, p_unit_price, p_staff_id, p_note, p_receipt_data)
  RETURNING id INTO v_transaction_id;

  -- Update ingredient current_qty
  UPDATE ingredients
  SET current_qty = current_qty + p_amount
  WHERE id = p_ingredient_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Index for receipt_data queries (optional)
-- ============================================
CREATE INDEX idx_transactions_receipt_data ON transactions USING GIN (receipt_data) WHERE receipt_data IS NOT NULL;
