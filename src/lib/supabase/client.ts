import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function createClient() {
  // Fallback placeholders allow the build to succeed when env vars are not set.
  // At runtime, real values from .env.local are used.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';
  return createBrowserClient<Database>(url, key);
}
