import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Allow both server and NEXT_PUBLIC (env used in .env.local) names
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseAdmin: SupabaseClient | null = null

if (url && key) {
  supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false },
  })
} else {
  // Avoid throwing during build when env vars are not set. API routes should
  // check for a null client and fall back gracefully.
  // In production, ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are provided.
  // eslint-disable-next-line no-console
  console.warn('[v0] Supabase keys not provided. Supabase client will be unusable until keys are set.')
}

export default supabaseAdmin
