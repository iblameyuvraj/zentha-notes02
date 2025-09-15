import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Pre-initialize Razorpay instance and service client for better performance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Pre-initialize service client
let serviceClient: any = null;
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { 
      auth: { persistSession: false },
      db: { schema: 'public' }
    }
  );
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { amount = 4900, access_token: bodyAccessToken } = await request.json();
    
    // Fast auth extraction - prefer Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : bodyAccessToken;

    let currentUser: { id: string } | null = null;

    if (token) {
      // Use service client for faster auth validation if available
      if (serviceClient) {
        try {
          const { data: { user }, error } = await serviceClient.auth.getUser(token);
          if (!error && user) currentUser = user as any;
        } catch (e) {
          // Fallback to regular client
        }
      }
      
      if (!currentUser) {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) { return request.cookies.get(name)?.value },
              set() {},
              remove() {},
            },
          }
        );
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) currentUser = user as any;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        responseTime: Date.now() - startTime 
      }, { status: 401 });
    }

    // Quick env validation (should be done at startup)
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        error: 'Configuration error',
        responseTime: Date.now() - startTime
      }, { status: 500 });
    }

    // Create Razorpay order with optimized options
    const timestamp = Math.floor(Date.now() / 1000).toString(36);
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_${currentUser.id.slice(0, 8)}_${timestamp}`,
      notes: {
        user_id: currentUser.id,
        plan: 'semester',
      },
    };

    // Create Razorpay order first
    const razorpayOrder = await razorpay.orders.create(options);

    // Create DB record with the correct order ID
    const client = serviceClient || createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value },
          set() {},
          remove() {},
        },
      }
    );

    const { error: dbError } = await client.from('payments').insert({
      user_id: currentUser.id,
      razorpay_order_id: razorpayOrder.id,
      amount: amount,
      currency: 'INR',
      status: 'created',
      plan_type: 'semester',
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the payment creation, just log the error
      // The payment can still proceed and be verified later
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      responseTime: Date.now() - startTime,
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);
    const details = error?.description || error?.message || error?.error || String(error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment order', 
        details,
        responseTime: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}
