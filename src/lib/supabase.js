/* FIXED: Implemented singleton Supabase client (Problem 7) */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

let client = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClientComponentClient();
  }
  return client;
}
