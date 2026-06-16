// Supabase client — dùng cho Vercel Functions (server-side)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// For admin operations, use service_role key; for public, use anon key
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

module.exports = { supabase, supabaseUrl, supabaseAnonKey, supabaseServiceKey };
