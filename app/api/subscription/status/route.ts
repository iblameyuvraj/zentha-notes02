import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    );

    // Prefer Authorization header (Bearer <access_token>)
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    const token = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : undefined;

    let currentUser: { id: string } | null = null;

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) currentUser = user as any;
    }

    if (!currentUser) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) currentUser = session.user as any;
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const admin = serviceKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { persistSession: false } })
      : null;

    const client = admin ?? supabase;

    const { data: profile, error } = await client
      .from('profiles')
      .select('id, subscription_active, subscription_end_date, subscription_plan, year, semester, subject_combo')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Subscription status fetch error:', error);
      return NextResponse.json({ error: 'Unable to fetch subscription', details: (error as any)?.message || error }, { status: 500 });
    }

    const hasActive = Boolean(
      profile?.subscription_active &&
      (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date())
    );

    return NextResponse.json({ success: true, hasActive, profile });
  } catch (err) {
    console.error('Subscription status route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
