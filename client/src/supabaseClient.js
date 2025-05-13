import { createClient } from '@supabase/supabase-js'

// Ensure we have valid default values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Missing or invalid Supabase URL. Please check your environment variables.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.warn('Missing or invalid Supabase anon key. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 