import { createClient } from '@supabase/supabase-js'

// Get environment variables without non-null assertion to prevent build-time crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize the client only if variables are present, otherwise return a placeholder
// This prevents the build process from failing if variables are missing in the environment
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

/**
 * Creates a server-side Supabase client using the service role key.
 * Used for administrative tasks that bypass Row Level Security (RLS).
 */
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Throw errors only at runtime when the function is actually called
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase Server environment variables (URL or SERVICE_ROLE_KEY)')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}