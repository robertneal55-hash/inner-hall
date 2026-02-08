'use client'import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (url, options = {}) => {
      

      return fetch(url, {
        ...options,
       
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
