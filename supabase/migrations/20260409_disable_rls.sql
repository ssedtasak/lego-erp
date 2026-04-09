-- Migration: Disable RLS for MVP simplicity
-- Date: 2026-04-09
-- Reason: LINE users can't authenticate via Supabase, RLS blocks staff.
-- Fix: All access control via RPC function validation (record_stock_in/out).

ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ingredients TO anon, authenticated;
GRANT ALL ON transactions TO anon, authenticated;
GRANT ALL ON staff_profiles TO anon, authenticated;
GRANT ALL ON alerts TO anon, authenticated;

GRANT EXECUTE ON FUNCTION record_stock_in(UUID, NUMERIC, NUMERIC, TEXT, TEXT) TO public;
GRANT EXECUTE ON FUNCTION record_stock_out(UUID, NUMERIC, TEXT, TEXT) TO public;
GRANT EXECUTE ON FUNCTION get_shopping_list() TO public;
GRANT EXECUTE ON FUNCTION get_daily_expense(DATE) TO public;
