import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Cleanly separable Supabase configuration
// Users can provide their own Supabase project URL & Anon Key in the app settings,
// or use local-first storage with 0 cloud dependencies.

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  if (typeof window === 'undefined') return { url: '', key: '' };
  const url = localStorage.getItem('kata_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem('kata_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
};

export const setSupabaseConfig = (url: string, key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kata_supabase_url', url);
  localStorage.setItem('kata_supabase_key', key);
  supabaseInstance = null; // reset client to reinitialize
};

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (err) {
    console.warn('Supabase initialization failed:', err);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string):Promise<{ user: User | null; error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { user: null, error: 'Supabase credentials not configured in Settings.' };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
};

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { user: null, error: 'Supabase credentials not configured in Settings.' };
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
};

export const signInWithGoogle = async (): Promise<{ error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase credentials not configured in Settings.' };
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  return { error: error ? error.message : null };
};

export const signOut = async () => {
  const sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
  }
};
