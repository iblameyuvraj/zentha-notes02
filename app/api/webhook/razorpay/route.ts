import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing Razorpay signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature. Expected:', expectedSignature, 'Received:', signature);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Webhook event received:', event.event);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.authorized':
      case 'payment.captured':
        await handlePaymentSuccess(event);
        break;
      case 'payment.failed':
        await handlePaymentFailure(event);
        break;
      case 'order.paid':
        await handleOrderPaid(event);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(event: any) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;
  const paymentId = payment.id;

  console.log('Processing successful payment:', paymentId, 'for order:', orderId);

  // Use service role client for database operations
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    // Find the payment record and get user_id
    const { data: paymentRecord, error: fetchError } = await admin
      .from('payments')
      .select('user_id, amount, plan_type')
      .eq('razorpay_order_id', orderId)
      .single();

    if (fetchError || !paymentRecord) {
      console.error('Payment record not found:', fetchError);
      return;
    }

    // Update payment status
    const { error: updateError } = await admin
      .from('payments')
      .update({
        razorpay_payment_id: paymentId,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', orderId);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      return;
    }

    // Get user details
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(paymentRecord.user_id);
    if (userError || !user) {
      console.error('Failed to fetch user:', userError);
      return;
    }

    // Calculate subscription end date based on plan
    const subscriptionEndDate = new Date();
    if (paymentRecord.plan_type === 'semester') {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
    } else if (paymentRecord.plan_type === 'annual') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }

    // Update user profile with subscription
    const { error: profileError } = await admin
      .from('profiles')
      .upsert({
        id: paymentRecord.user_id,
        email: user.email,
        subscription_active: true,
        subscription_plan: paymentRecord.plan_type,
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Failed to update profile:', profileError);
      return;
    }

    console.log('Successfully processed payment and updated subscription for user:', paymentRecord.user_id);
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

async function handlePaymentFailure(event: any) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;
  const paymentId = payment.id;

  console.log('Processing failed payment:', paymentId, 'for order:', orderId);

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Update payment status to failed
  const { error } = await admin
    .from('payments')
    .update({
      razorpay_payment_id: paymentId,
      status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('razorpay_order_id', orderId);

  if (error) {
    console.error('Failed to update failed payment:', error);
  }
}

async function handleOrderPaid(event: any) {
  const order = event.payload.order.entity;
  console.log('Order paid event for order:', order.id);
  
  // For order.paid events, we need to find the associated payment
  // The order.paid event doesn't contain payment details directly
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Update payment status based on order ID
    const { error } = await admin
      .from('payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', order.id);

    if (error) {
      console.error('Failed to update payment for order.paid event:', error);
    } else {
      console.log('Successfully updated payment status for order:', order.id);
    }
  } catch (error) {
    console.error('Error processing order.paid event:', error);
  }
}
