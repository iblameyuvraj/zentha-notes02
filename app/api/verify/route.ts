import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

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

    let currentUser: { id: string } | null = null;

    if (token) {
      const { data: { user }, error: tokenError } = await supabase.auth.getUser(token);
      console.log('Verify: auth via token:', { userId: user?.id, tokenError });
      if (!tokenError && user) {
        currentUser = user as any;
      }
    }

    // Fallback to cookie/session if no token user
    if (!currentUser) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Verify: auth via cookies/session:', { userId: session?.user?.id, sessionError });
      if (!sessionError && session?.user) {
        currentUser = session.user as any;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Admin client (service role) to bypass RLS for server-side mutations
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const admin = serviceKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { persistSession: false } })
      : null;

    // Update payment record
    let paymentError: any = null;
    if (admin) {
      const { error } = await admin
        .from('payments')
        .update({
          razorpay_payment_id,
          razorpay_signature,
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .eq('user_id', currentUser.id);
      paymentError = error;
    } else {
      const { error } = await supabase
        .from('payments')
        .update({
          razorpay_payment_id,
          razorpay_signature,
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .eq('user_id', currentUser.id);
      paymentError = error;
    }

    if (paymentError) {
      console.error('Payment update error:', paymentError);
      return NextResponse.json({ error: 'Payment update failed', details: paymentError?.message || paymentError }, { status: 500 });
    }

    // Get payment record to determine plan type and fetch user details
    const { data: paymentRecord, error: paymentFetchError } = await (admin ?? supabase)
      .from('payments')
      .select('plan_type, user_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', currentUser.id)
      .single();

    if (paymentFetchError || !paymentRecord) {
      console.error('Failed to fetch payment record:', paymentFetchError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 400 });
    }

    // Calculate subscription end date based on plan type
    const subscriptionEndDate = new Date();
    if (paymentRecord.plan_type === 'semester') {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
    } else if (paymentRecord.plan_type === 'annual') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    } else {
      // Default to 6 months
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
    }
    
    // Get user email from auth using the correct method
    let userEmail: string;
    if (admin) {
      const { data: { user }, error: userError } = await admin.auth.admin.getUserById(currentUser.id);
      if (userError || !user?.email) {
        console.error('Failed to fetch user email:', userError);
        return NextResponse.json({ error: 'User email not found' }, { status: 400 });
      }
      userEmail = user.email;
    } else {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        console.error('Failed to fetch user email:', userError);
        return NextResponse.json({ error: 'User email not found' }, { status: 400 });
      }
      userEmail = user.email;
    }

    let profileError: any = null;
    if (admin) {
      const { error } = await admin
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: userEmail, // Use the correctly fetched email
          subscription_active: true,
          subscription_plan: paymentRecord.plan_type,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: subscriptionEndDate.toISOString(),
        }, { onConflict: 'id' });
      profileError = error;
    } else {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: userEmail, // Use the correctly fetched email
          subscription_active: true,
          subscription_plan: paymentRecord.plan_type,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: subscriptionEndDate.toISOString(),
        }, { onConflict: 'id' });
      profileError = error;
    }

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json({ error: 'Profile update failed', details: profileError?.message || profileError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
