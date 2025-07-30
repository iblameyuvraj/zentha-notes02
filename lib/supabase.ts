import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  role?: string
  year?: number
  semester?: number
  college_id?: string
  subject_combo?: string
  created_at?: string
  last_login?: string
  total_downloads?: number
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    role?: string
    year?: number
    semester?: number
    college_id?: string
    subject_combo?: string
  }
} 