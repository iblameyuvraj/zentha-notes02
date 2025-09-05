/**
 * Payment Flow Test Script
 * Run this in browser console to test the complete payment integration
 */

async function testPaymentFlow() {
  console.log('🧪 Starting Payment Flow Test...');
  
  try {
    // Test 1: Check if user is authenticated
    console.log('\n1️⃣ Testing Authentication...');
    const { supabase } = await import('/lib/supabase.js');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ Authentication failed:', sessionError);
      return;
    }
    console.log('✅ User authenticated:', session.user.email);
    
    // Test 2: Test order creation
    console.log('\n2️⃣ Testing Order Creation...');
    const orderResponse = await fetch('/api/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ 
        amount: 4900, 
        access_token: session.access_token 
      }),
    });
    
    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error('❌ Order creation failed:', error);
      return;
    }
    
    const orderData = await orderResponse.json();
    console.log('✅ Order created successfully:', orderData.orderId);
    
    // Test 3: Simulate payment verification (without actual payment)
    console.log('\n3️⃣ Testing Payment Verification Endpoint...');
    
    // Note: This would normally be called by Razorpay after successful payment
    // We're just testing the endpoint structure here
    const mockVerificationData = {
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: 'pay_test_' + Date.now(),
      razorpay_signature: 'mock_signature_for_testing',
      access_token: session.access_token,
    };
    
    console.log('📝 Mock verification data prepared (not executing to avoid DB changes)');
    console.log('   Order ID:', mockVerificationData.razorpay_order_id);
    console.log('   Payment ID:', mockVerificationData.razorpay_payment_id);
    
    // Test 4: Check webhook endpoint availability
    console.log('\n4️⃣ Testing Webhook Endpoint Availability...');
    try {
      const webhookResponse = await fetch('/api/webhook/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'ping' }),
      });
      
      // We expect this to fail with signature error, which means endpoint is working
      if (webhookResponse.status === 400) {
        console.log('✅ Webhook endpoint is accessible (signature validation working)');
      } else {
        console.log('⚠️ Webhook endpoint response:', webhookResponse.status);
      }
    } catch (webhookError) {
      console.error('❌ Webhook endpoint not accessible:', webhookError);
    }
    
    // Test 5: Check environment variables
    console.log('\n5️⃣ Checking Environment Configuration...');
    const envCheck = {
      razorpay_key: orderData.key ? '✅ Present' : '❌ Missing',
      order_amount: orderData.amount === 4900 ? '✅ Correct (4900)' : '❌ Incorrect',
      order_currency: orderData.currency === 'INR' ? '✅ Correct (INR)' : '❌ Incorrect',
    };
    
    console.table(envCheck);
    
    console.log('\n🎉 Payment Flow Test Completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Ensure all environment variables are set correctly');
    console.log('2. Configure Razorpay webhook in dashboard');
    console.log('3. Test with actual payment using test cards');
    console.log('4. Monitor webhook logs in Razorpay dashboard');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Auto-run test
testPaymentFlow();
