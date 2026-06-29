import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// When credentials are missing (e.g. local dev without .env) we still create the
// client with placeholder values so the module doesn't throw at import time.
// All actual network calls will fail gracefully and be caught by the callers.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
