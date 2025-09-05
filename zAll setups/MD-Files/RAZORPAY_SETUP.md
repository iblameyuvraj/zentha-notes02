# Razorpay Payment Gateway Setup

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Supabase Configuration (if not already added)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Razorpay Keys

1. **Sign up for Razorpay Account**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Create a business account
   - Complete KYC verification

2. **Get API Keys**
   - Login to Razorpay Dashboard
   - Go to Settings → API Keys
   - Generate new API Key pair
   - Copy the Key ID and Key Secret

3. **Test Mode vs Live Mode**
   - For development: Use Test Mode keys
   - For production: Use Live Mode keys (requires business verification)

## Database Setup

Run the SQL script in `zAll setups/databse-setup/subscription-schema.sql` to add subscription tracking to your database:

```sql
-- This will add subscription columns to profiles table and create payments table
-- Run this in your Supabase SQL editor
```

## Testing Payment Flow

### Test Cards for Razorpay

Use these test card numbers in development:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

### UPI Testing
- Use any UPI ID ending with @paytm for successful payments
- Use failure@razorpay for failed payments

## Security Notes

1. **Never expose Key Secret in frontend code**
2. **Always verify payment signatures on server-side**
3. **Use HTTPS in production**
4. **Store sensitive data in environment variables**

## Payment Flow

1. User clicks "Purchase Subscription"
2. Frontend calls `/api/pay` to create Razorpay order
3. Razorpay checkout opens with payment options
4. User completes payment
5. Frontend calls `/api/verify` to verify payment signature
6. Server updates user subscription status
7. User is redirected to dashboard

## Troubleshooting

### Common Issues

1. **"Invalid signature" error**
   - Check if RAZORPAY_KEY_SECRET is correct
   - Ensure signature verification logic is correct

2. **"Order creation failed"**
   - Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
   - Check if amount is in paise (₹49 = 4900 paise)

3. **Database errors**
   - Ensure subscription schema is applied
   - Check Supabase connection and permissions

4. **Payment not reflecting**
   - Check if webhook is properly configured
   - Verify payment verification endpoint

### Support

- Razorpay Documentation: [https://razorpay.com/docs](https://razorpay.com/docs)
- Test your integration: [https://razorpay.com/docs/payments/test-card-upi-details](https://razorpay.com/docs/payments/test-card-upi-details)
