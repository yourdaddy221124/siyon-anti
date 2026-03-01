import { createClient } from '@supabase/supabase-js'

// VITE_ prefixed environment variables for Vite/Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.error("❌ SUPABASE CONFIG ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
    console.warn("Please add these variables in your Vercel/Local Environment Settings.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        }
    }
)
