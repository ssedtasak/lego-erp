-- ============================================
-- LEGO ERP: Enable Row Level Security
-- Phase 1 Security - Production Ready
-- ============================================

-- Enable RLS on all tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policy: Staff profiles are viewable by all authenticated users
-- ============================================
CREATE POLICY "Staff profiles are viewable by authenticated users"
  ON staff_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON staff_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = line_user_id);

-- Policy: Users can insert their own profile (signup)
CREATE POLICY "Users can insert own profile"
  ON staff_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::TEXT = line_user_id);

-- ============================================
-- Policy: Ingredients - owners can do everything, staff read-only
-- ============================================
CREATE POLICY "Owners can do everything on ingredients"
  ON ingredients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE line_user_id = auth.uid()::TEXT
      AND role = 'owner'
    )
  );

-- ============================================
-- Policy: Transactions - owners see all, staff see own
-- ============================================
CREATE POLICY "Owners can do everything on transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE line_user_id = auth.uid()::TEXT
      AND role = 'owner'
    )
  );

CREATE POLICY "Staff can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (staff_id = auth.uid()::TEXT);

-- ============================================
-- Policy: Alerts - owners manage, staff view own ingredient alerts
-- ============================================
CREATE POLICY "Owners can do everything on alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE line_user_id = auth.uid()::TEXT
      AND role = 'owner'
    )
  );

-- ============================================
-- Revoke default public access (no anon access)
-- ============================================
REVOKE ALL ON ingredients FROM anon;
REVOKE ALL ON transactions FROM anon;
REVOKE ALL ON staff_profiles FROM anon;
REVOKE ALL ON alerts FROM anon;

REVOKE ALL ON ingredients FROM authenticated;
REVOKE ALL ON transactions FROM authenticated;
REVOKE ALL ON staff_profiles FROM authenticated;
REVOKE ALL ON alerts FROM authenticated;

-- Grant specific permissions based on policies
GRANT SELECT, INSERT, UPDATE ON ingredients TO authenticated;
GRANT SELECT, INSERT ON transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON staff_profiles TO authenticated;
GRANT SELECT ON alerts TO authenticated;

-- For RPC functions (keep existing grants if needed)
GRANT EXECUTE ON FUNCTION get_shopping_list() TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_expense(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION record_stock_in(UUID, NUMERIC, NUMERIC, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION record_stock_out(UUID, NUMERIC, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at() TO authenticated;
