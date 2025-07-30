# Authentication Setup Guide

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run the following SQL in your Supabase SQL editor to create the required tables and policies:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student',
  year INTEGER,
  semester INTEGER,
  college_id TEXT,
  subject_combo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_downloads INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, year, semester, college_id, subject_combo, created_at, last_login, total_downloads)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE((NEW.raw_user_meta_data->>'year')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'semester')::integer, 1),
    COALESCE(NEW.raw_user_meta_data->>'college_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'subject_combo', ''),
    NOW(),
    NOW(),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Features Implemented

### ✅ Signup Page Logic:
- Collects user inputs: firstName, lastName, email, password, collegeId, year, semester, subjectCombo
- For year 1 students, shows subject combination selector:
  - Option 1: Physics & PPS
  - Option 2: Chemistry & Civil
- Maps subject combinations to physics/chemistry values
- Calls Supabase signUp with email + password
- Inserts user metadata into profiles table

### ✅ Login Page Logic:
- Email and password input fields
- Calls `supabase.auth.signInWithPassword`
- Shows "Email or Password is incorrect" on failure
- Fetches user info from profiles table
- Redirects based on user year and subject combination

### ✅ Redirect Logic:
- Year 1: `/dashboard1/physics` or `/dashboard1/chemistry`
- Year 2: `/dashboard2/dashboard21` or `/dashboard2/dashboard22`
- Year 3: `/dashboard3/dashboard31` or `/dashboard3/dashboard32`
- Year 4: `/dashboard4/dashboard41` or `/dashboard4/dashboard42`

### ✅ Settings Page:
- Displays real user profile data
- Shows account metadata (join date, last login, downloads)
- Logout functionality
- Account deletion (admin only)

### ✅ Middleware:
- Protects routes requiring authentication
- Redirects unauthenticated users to login
- Redirects authenticated users away from login/signup pages

## Usage

1. Set up your environment variables
2. Run the database setup SQL
3. Start the development server: `pnpm dev`
4. Navigate to `/signup` to create an account
5. Navigate to `/login` to sign in
6. Access `/settings` to manage your account

## File Structure

```
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── redirect-utils.ts    # Redirect logic utilities
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
├── app/
│   ├── login/page.tsx       # Login page with Supabase auth
│   ├── signup/page.tsx      # Signup page with Supabase auth
│   └── settings/page.tsx    # Settings page
├── components/
│   └── setting.tsx          # Settings component with real auth
└── middleware.ts            # Route protection middleware
``` 