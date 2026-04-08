import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has owner role in staff_profiles
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('staff_profiles')
          .select('role')
          .eq('line_user_id', user.id)
          .single();

        // If no profile exists, create one with owner role
        if (!profile) {
          await supabase.from('staff_profiles').insert({
            line_user_id: user.id,
            display_name: user.email?.split('@')[0] || 'Owner',
            role: 'owner',
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login page on error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
