import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

let supabaseClient;

export function getSupabaseClient() {
  if (!supabaseClient) {
    if (!env.supabaseUrl || !env.supabaseKey) {
      throw new Error('Supabase URL e chave não configuradas. Verifique as variáveis de ambiente.');
    }

    supabaseClient = createClient(env.supabaseUrl, env.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}
