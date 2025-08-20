import { createClient } from '@supabase/supabase-js';

// Next.js environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback values for development/testing
const defaultUrl = 'https://your-project.supabase.co';
const defaultKey = 'your-anon-key';
//aa
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey
);
