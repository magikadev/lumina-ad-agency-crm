import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials exist to prevent the "supabaseUrl is required" crash
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize with dummy values if missing to prevent crash, 
// but we'll use isSupabaseConfigured to skip actual network calls
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
