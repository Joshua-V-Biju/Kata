import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Cleanly separable Supabase configuration
// Users can provide their own Supabase project URL & Anon Key in the app settings,
// or use local-first storage with 0 cloud dependencies.

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  if (typeof window === 'undefined') return { url: '', key: '', isEnvConfigured: false };
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  const localUrl = localStorage.getItem('kata_supabase_url') || '';
  const localKey = localStorage.getItem('kata_supabase_key') || '';
  const url = localUrl || envUrl;
  const key = localKey || envKey;
  const isEnvConfigured = Boolean(envUrl && envKey);
  return { url, key, isEnvConfigured };
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

export interface CloudSyncPayload {
  kata_data?: any;
  forge_data?: any;
  updated_at?: string;
}

// Push local data up to Supabase kata_user_data table
export const pushToCloud = async (kataData: any, forgeData?: any): Promise<{ success: boolean; error?: string }> => {
  const sb = getSupabase();
  if (!sb) return { success: false, error: 'Supabase credentials not configured.' };

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return { success: false, error: 'You must be signed in to sync to cloud.' };

    const payload: any = {
      user_id: user.id,
      updated_at: new Date().toISOString()
    };
    if (kataData) payload.kata_data = kataData;
    if (forgeData) payload.forge_data = forgeData;

    const { error } = await sb
      .from('kata_user_data')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.warn('Cloud sync push failed:', err);
    return { success: false, error: err?.message || String(err) };
  }
};

// Pull latest data from Supabase kata_user_data table
export const pullFromCloud = async (): Promise<{ data: CloudSyncPayload | null; error?: string }> => {
  const sb = getSupabase();
  if (!sb) return { data: null, error: 'Supabase credentials not configured.' };

  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return { data: null, error: 'You must be signed in to pull from cloud.' };

    const { data, error } = await sb
      .from('kata_user_data')
      .select('kata_data, forge_data, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.warn('Cloud sync pull failed:', err);
    return { data: null, error: err?.message || String(err) };
  }
};
