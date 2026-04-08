import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  role?: 'owner' | 'staff';
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

/**
 * Get current authenticated user from Supabase
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user role from staff_profiles
  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('role')
    .eq('line_user_id', user.id)
    .single();

  return {
    ...user,
    role: profile?.role as 'owner' | 'staff' | undefined,
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase.auth.signUp({
    email,
    password,
  });
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase.auth.signOut();
}

/**
 * Check if current user is owner
 */
export async function isOwner(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'owner';
}

/**
 * Middleware helper - check auth and redirect if not authenticated
 */
export function requireAuth(user: AuthUser | null): boolean {
  return user !== null;
}

/**
 * Middleware helper - check owner role and redirect if not owner
 */
export function requireOwner(user: AuthUser | null): boolean {
  return user?.role === 'owner';
}
