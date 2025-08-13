# Supabase Setup Guide

## Database Schema

You need to create a `profiles` table in your Supabase database with the following schema:
-----------
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student',
  year TEXT,
  semester TEXT,
  subject_combination TEXT,
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
  INSERT INTO profiles (id, email, name, role, year, semester, subject_combination, created_at, last_login, total_downloads)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'year', ''),
    COALESCE(NEW.raw_user_meta_data->>'semester', ''),
    COALESCE(NEW.raw_user_meta_data->>'subject_combination', ''),
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

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features Implemented

1. **Authentication Context**: Complete authentication system with Supabase
2. **User Profile Management**: Store and retrieve user profiles
3. **Settings Page**: View and manage user information
4. **Login/Signup**: Updated to use the new AuthContext
5. **Account Deletion**: Users can delete their accounts
6. **Session Management**: Automatic session handling

## Usage

The settings page is now available at `/settings` and includes:

- Profile information display
- Account metadata (join date, last login, downloads)
- Account actions (logout, delete account)
- App preferences (notifications toggle)

The authentication system automatically handles:
- User registration with profile creation
- Login with session management
- Profile updates
- Account deletion
- Automatic redirects based on user year/semester 