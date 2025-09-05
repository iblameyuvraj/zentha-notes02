# Payment Integration Testing Checklist

## Pre-Testing Setup

### 1. Environment Variables
Ensure these are set in `.env.local`:
- [ ] `RAZORPAY_KEY_ID` - Your Razorpay test/live key ID
- [ ] `RAZORPAY_KEY_SECRET` - Your Razorpay test/live key secret  
- [ ] `RAZORPAY_WEBHOOK_SECRET` - Webhook secret from Razorpay dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### 2. Razorpay Dashboard Configuration
- [ ] Webhook endpoint configured: `https://yourdomain.com/api/webhook/razorpay`
- [ ] Webhook events enabled:
  - [ ] `payment.authorized`
  - [ ] `payment.captured`
  - [ ] `payment.failed`
  - [ ] `order.paid`
- [ ] Test mode enabled (for testing)

### 3. Database Schema
Verify tables exist with correct columns:
- [ ] `payments` table with all required fields
- [ ] `profiles` table with subscription fields
- [ ] Proper RLS policies configured

## Testing Steps

### Phase 1: Basic Functionality
1. [ ] Start development server: `npm run dev`
2. [ ] Open browser console and run test script
3. [ ] Verify authentication works
4. [ ] Verify order creation endpoint responds correctly
5. [ ] Check webhook endpoint is accessible

### Phase 2: Payment Flow Testing
1. [ ] Log in as test user
2. [ ] Navigate to subscription gate/payment modal
3. [ ] Click payment button
4. [ ] Verify Razorpay checkout opens
5. [ ] Use test card numbers:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`

### Phase 3: Webhook Testing
1. [ ] Complete a test payment
2. [ ] Check Razorpay dashboard webhook logs
3. [ ] Verify webhook receives events
4. [ ] Check database for payment status updates
5. [ ] Verify user subscription is activated

### Phase 4: Error Handling
1. [ ] Test with invalid payment details
2. [ ] Test network failures
3. [ ] Test webhook signature validation
4. [ ] Verify proper error messages shown to user

## Common Test Cards (Razorpay Test Mode)

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|---------|
| 4111 1111 1111 1111 | 123 | Any future | Success |
| 4000 0000 0000 0002 | 123 | Any future | Decline |
| 4000 0000 0000 0069 | 123 | Any future | Expired |
| 4000 0000 0000 0119 | 123 | Any future | Processing Error |

## Troubleshooting

### Payment Button Not Working
- Check browser console for JavaScript errors
- Verify Razorpay script is loaded
- Check authentication token is present
- Verify `/api/pay` endpoint responds correctly

### Webhook Not Receiving Events
- Check webhook URL is correct and accessible
- Verify webhook secret matches environment variable
- Check Razorpay dashboard webhook logs
- Ensure webhook events are enabled

### Database Not Updating
- Check Supabase service role key permissions
- Verify RLS policies allow webhook updates
- Check database logs for errors
- Verify table schema matches code expectations

## Success Criteria
- [ ] Payment button opens Razorpay checkout
- [ ] Test payments complete successfully
- [ ] Webhooks receive and process events
- [ ] Database updates with payment status
- [ ] User subscription is activated
- [ ] Error cases are handled gracefully
