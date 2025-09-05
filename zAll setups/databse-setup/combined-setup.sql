-- Combined SQL setup: auth profiles, subscription, teacher uploads (no teacher update policy), payments
-- Safe to run multiple times (uses IF EXISTS / IF NOT EXISTS where possible)

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========== PROFILES (signup/login) ==========
-- Drop optional trigger/function if you need to re-apply cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Base profiles table (id matches auth.users.id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student',
  year INTEGER DEFAULT 1,
  semester INTEGER DEFAULT 1,
  college_id TEXT,
  subject_combo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW(),
  total_downloads INTEGER DEFAULT 0
);

-- Enable RLS and basic policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Trigger to auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, year, semester, college_id, subject_combo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE((NEW.raw_user_meta_data->>'year')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'semester')::integer, 1),
    COALESCE(NEW.raw_user_meta_data->>'college_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'subject_combo', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== SUBSCRIPTION (columns + helper) ==========
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP DEFAULT NULL;
-- Keep Razorpay references minimal on profiles; detailed tracking goes to payments
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_active);

CREATE OR REPLACE FUNCTION public.check_user_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
      AND subscription_active = TRUE 
      AND (subscription_end_date IS NULL OR subscription_end_date > NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- ========== PAYMENTS (Razorpay tracking) ==========
CREATE TABLE IF NOT EXISTS public.payments (
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

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(razorpay_order_id);

-- Optional: RLS for payments (limit to own rows)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can view own payments'
  ) THEN
    CREATE POLICY "Users can view own payments" ON public.payments
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can insert own payments'
  ) THEN
    CREATE POLICY "Users can insert own payments" ON public.payments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can update own payments'
  ) THEN
    CREATE POLICY "Users can update own payments" ON public.payments
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ========== TEACHER UPLOADS (no teacher update policy) ==========
CREATE TABLE IF NOT EXISTS public.teacher_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  semester TEXT,
  subject_combo TEXT,
  subject TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Notes', 'Assignment')),
  description TEXT,
  file_path TEXT NOT NULL,
  download_url TEXT,
  file_size BIGINT,
  file_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Approved' CHECK (status IN ('Approved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teacher_uploads ENABLE ROW LEVEL SECURITY;

-- Keep view/insert/delete for teachers, but DO NOT add an UPDATE policy (as requested)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_uploads' AND policyname = 'Teachers can view own uploads'
  ) THEN
    CREATE POLICY "Teachers can view own uploads" ON public.teacher_uploads
      FOR SELECT USING (auth.uid() = uploaded_by);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_uploads' AND policyname = 'Teachers can insert own uploads'
  ) THEN
    CREATE POLICY "Teachers can insert own uploads" ON public.teacher_uploads
      FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_uploads' AND policyname = 'Teachers can delete own uploads'
  ) THEN
    CREATE POLICY "Teachers can delete own uploads" ON public.teacher_uploads
      FOR DELETE USING (auth.uid() = uploaded_by);
  END IF;
END $$;

-- Allow students to view approved uploads
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_uploads' AND policyname = 'Students can view approved uploads'
  ) THEN
    CREATE POLICY "Students can view approved uploads" ON public.teacher_uploads
      FOR SELECT USING (status = 'Approved');
  END IF;
END $$;

-- Indices
CREATE INDEX IF NOT EXISTS idx_teacher_uploads_uploaded_by ON public.teacher_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_teacher_uploads_created_at ON public.teacher_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_teacher_uploads_status ON public.teacher_uploads(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teacher_uploads_updated_at ON public.teacher_uploads;
CREATE TRIGGER update_teacher_uploads_updated_at 
  BEFORE UPDATE ON public.teacher_uploads 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
