import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate that we have a proper URL before calling createClient,
// which throws synchronously on invalid URLs.
const isValidUrl = (s: string) => {
  try { return Boolean(new URL(s)) } catch { return false }
}

const url = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-anon-key'

export const supabase = createClient(url, key)
export const supabaseConfigured = isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey)
