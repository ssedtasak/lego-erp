-- Disable RLS on all tables for MVP (public access)
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;

-- Make all tables publicly accessible
GRANT ALL ON ingredients TO anon, authenticated;
GRANT ALL ON transactions TO anon, authenticated;
GRANT ALL ON staff_profiles TO anon, authenticated;
GRANT ALL ON alerts TO anon, authenticated;
