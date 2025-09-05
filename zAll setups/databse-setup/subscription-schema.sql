-- Add subscription columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- Create payments table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(500),
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'created',
    plan_type VARCHAR(50) DEFAULT 'semester',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_active);

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION check_user_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_uuid 
        AND subscription_active = TRUE 
        AND (subscription_end_date IS NULL OR subscription_end_date > NOW())
    );
END;
$$ LANGUAGE plpgsql;
