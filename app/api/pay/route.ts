import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount = 4900, access_token: bodyAccessToken } = await request.json(); // Default ₹49
    
    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // We can't set cookies in API routes, but this is required by the interface
          },
          remove(name: string, options: any) {
            // We can't remove cookies in API routes, but this is required by the interface
          },
        },
      }
    );

    // Prefer Authorization header (Bearer <access_token>) for API calls from the browser
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    const token = authHeader?.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : undefined;

    console.log('[/api/pay] Auth header present:', !!authHeader, 'Token present:', !!token, 'Body token present:', !!bodyAccessToken);

    let currentUser: { id: string } | null = null;

    const tokenToUse = token || bodyAccessToken;

    if (tokenToUse) {
      const { data: { user }, error: tokenError } = await supabase.auth.getUser(tokenToUse);
      console.log('Auth via token:', { userId: user?.id, tokenError });
      if (!tokenError && user) {
        currentUser = user as any;
      }
    }

    // Fallback to cookie/session if no token user
    if (!currentUser) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Auth via cookies/session:', { userId: session?.user?.id, sessionError });
      if (!sessionError && session?.user) {
        currentUser = session.user as any;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized', details: 'No valid Supabase session or token provided' }, { status: 401 });
    }

    // Validate Razorpay env vars
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay env vars missing');
      return NextResponse.json({
        error: 'Configuration error',
        details: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Add them to .env.local and restart the dev server.'
      }, { status: 500 });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // amount in paise (₹49 = 4900 paise)
      currency: 'INR',
      // Razorpay requires receipt length <= 40
      receipt: `rcpt_${currentUser.id.slice(0, 8)}_${Math.floor(Date.now() / 1000).toString(36)}`,
      notes: {
        user_id: currentUser.id,
        plan: 'semester',
      },
    };

    const order = await razorpay.orders.create(options);

    // Store order in database using service role to avoid any RLS edge-cases
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const admin = serviceKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { persistSession: false } })
      : null;

    let dbError: any = null;
    if (admin) {
      const { error } = await admin
        .from('payments')
        .insert({
          user_id: currentUser.id,
          razorpay_order_id: order.id,
          amount: amount,
          currency: 'INR',
          status: 'created',
          plan_type: 'semester',
        });
      dbError = error;
    } else {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: currentUser.id,
          razorpay_order_id: order.id,
          amount: amount,
          currency: 'INR',
          status: 'created',
          plan_type: 'semester',
        });
      dbError = error;
    }

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error', details: dbError?.message || dbError }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    // Try to extract meaningful error from Razorpay SDK/object
    const safeStringify = (err: any) => {
      try {
        return JSON.stringify(err, Object.getOwnPropertyNames(err));
      } catch (_) {
        return String(err);
      }
    };
    const details = error?.description || error?.message || error?.error || safeStringify(error);
    console.error('Payment creation error:', details);
    return NextResponse.json(
      { error: 'Failed to create payment order', details },
      { status: 500 }
    );
  }
}
