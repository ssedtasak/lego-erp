-- ============================================
-- LEGO ERP: Restaurant MVP — Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: ingredients
-- Stores all tracked ingredient items
-- ============================================
CREATE TABLE ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  min_qty NUMERIC NOT NULL DEFAULT 0,
  current_qty NUMERIC NOT NULL DEFAULT 0 CHECK (current_qty >= 0),
  cost_per_unit NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Table: transactions
-- Records all stock movements (IN/OUT)
-- ============================================
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC GENERATED ALWAYS AS (amount * unit_price) STORED,
  staff_id TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Table: staff_profiles
-- LINE user mapping for staff identification
-- Also stores email-authenticated owners via auth_user_id
-- ============================================
CREATE TABLE staff_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  line_user_id TEXT UNIQUE,
  auth_user_id UUID UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Table: alerts
-- Low stock alert records
-- ============================================
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_sent BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_transactions_ingredient_id ON transactions(ingredient_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_alerts_is_sent ON alerts(is_sent) WHERE is_sent = FALSE;
CREATE INDEX idx_staff_line_user_id ON staff_profiles(line_user_id);

-- ============================================
-- Function: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers: Auto-update updated_at
-- ============================================
CREATE TRIGGER ingredients_updated_at
  BEFORE UPDATE ON ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER staff_profiles_updated_at
  BEFORE UPDATE ON staff_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Function: Get shopping list (items below min_qty)
-- ============================================
CREATE OR REPLACE FUNCTION get_shopping_list()
RETURNS TABLE(
  ingredient_id UUID,
  name TEXT,
  unit TEXT,
  current_qty NUMERIC,
  min_qty NUMERIC,
  needed_qty NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.name,
    i.unit,
    i.current_qty,
    i.min_qty,
    i.min_qty - i.current_qty AS needed_qty
  FROM ingredients i
  WHERE i.current_qty < i.min_qty
  ORDER BY i.name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: Get daily expense summary
-- ============================================
CREATE OR REPLACE FUNCTION get_daily_expense(specific_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE(
  total_spent NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(t.total_price), 0)::NUMERIC AS total_spent,
    COUNT(t.id)::BIGINT AS transaction_count
  FROM transactions t
  WHERE t.type = 'IN'
    AND DATE(t.created_at) = specific_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: Record stock-in transaction
-- ============================================
CREATE OR REPLACE FUNCTION record_stock_in(
  p_ingredient_id UUID,
  p_amount NUMERIC,
  p_unit_price NUMERIC,
  p_staff_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Insert transaction
  INSERT INTO transactions (ingredient_id, type, amount, unit_price, staff_id, note)
  VALUES (p_ingredient_id, 'IN', p_amount, p_unit_price, p_staff_id, p_note)
  RETURNING id INTO v_transaction_id;

  -- Update ingredient current_qty
  UPDATE ingredients
  SET current_qty = current_qty + p_amount
  WHERE id = p_ingredient_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Function: Record stock-out transaction
-- ============================================
CREATE OR REPLACE FUNCTION record_stock_out(
  p_ingredient_id UUID,
  p_amount NUMERIC,
  p_staff_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Check if enough stock
  IF (SELECT current_qty FROM ingredients WHERE id = p_ingredient_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  -- Insert transaction
  INSERT INTO transactions (ingredient_id, type, amount, unit_price, staff_id, note)
  VALUES (p_ingredient_id, 'OUT', p_amount, 0, p_staff_id, p_note)
  RETURNING id INTO v_transaction_id;

  -- Update ingredient current_qty
  UPDATE ingredients
  SET current_qty = current_qty - p_amount
  WHERE id = p_ingredient_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Seed data: Sample ingredients
-- ============================================
INSERT INTO ingredients (name, unit, min_qty, current_qty, cost_per_unit) VALUES
  ('เนื้อหมู', 'kg', 10, 25, 180),
  ('เนื้อไก่', 'kg', 10, 20, 120),
  ('ข้าว', 'kg', 20, 50, 45),
  ('น้ำมันพืช', 'ลิตร', 5, 10, 60),
  ('ซีอิ๊ว', 'ขวด', 3, 8, 35),
  ('ไข่', 'ชิ้น', 50, 100, 5),
  ('ผักกาด', 'kg', 5, 12, 30),
  ('เต้าหู้', 'ชิ้น', 20, 30, 15);
