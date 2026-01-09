import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use default localStorage-based client with explicit settings
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL!.split('//')[1].split('.')[0]}-auth-token`,
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    }
  );
}
