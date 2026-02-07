import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url, options = {}) => {
      const timeout = 1000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('[Supabase] Request timeout after 1s, aborting:', url);
        controller.abort();
      }, timeout);

      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId))
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.warn('[Supabase] Request aborted due to timeout');
          }
          throw error;
        });
    },
  },
});
