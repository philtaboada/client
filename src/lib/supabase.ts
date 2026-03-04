import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Cliente Supabase para uso en el navegador (anon key)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente Supabase para uso en API routes (service role - bypassa RLS)
 * Requiere SUPABASE_SERVICE_ROLE_KEY en .env
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY no está configurada');
    }
    return createClient(supabaseUrl, supabaseServiceKey);
}
