import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If we have service role key, use it. Otherwise fall back to anon key
const keyToUse = supabaseServiceKey && supabaseServiceKey !== 'your-service-role-key-here'
  ? supabaseServiceKey
  : supabaseAnonKey;

if (!supabaseUrl || !keyToUse) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseServer = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
