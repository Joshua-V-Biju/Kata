import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Cleanly separable Supabase configuration
// Users can provide their own Supabase project URL & Anon Key in the app settings,
// or use local-first storage with 0 cloud dependencies.

// Built-in default production Supabase credentials for Kata
export const DEFAULT_SUPABASE_URL = 'https://jtigfaacegbvdjwzislp.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_I-FzmOwYtz8aLZfhE5BFlQ_DaUNSDzW';

let supabaseInstance: SupabaseClient | null = null;

export const formatSupabaseUrl = (raw: string): string => {
  let u = (raw || '').trim();
  if (!u) return '';
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = `https://${u}`;
  }
  return u.replace(/\/+$/, '');
};

export const isPlaceholderConfig = (url: string, key: string): boolean => {
  return (
    !url ||
    !key ||
    url.includes('your-project-id') ||
    url.includes('xyz.supabase.co') ||
    key.includes('your-anon') ||
    key.length < 20
  );
};

export const clearSupabaseConfig = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kata_cloud_disabled', 'true');
  localStorage.removeItem('kata_supabase_url');
  localStorage.removeItem('kata_supabase_key');
  localStorage.removeItem('kata_auth_email');
  supabaseInstance = null;
};

export const restoreDefaultSupabaseConfig = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kata_cloud_disabled');
  localStorage.removeItem('kata_supabase_url');
  localStorage.removeItem('kata_supabase_key');
  supabaseInstance = null;
};

export const getSupabaseConfig = () => {
  if (typeof window === 'undefined') {
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_KEY, isEnvConfigured: false, isPlaceholder: false };
  }

  // If user explicitly chose local-only mode
  if (localStorage.getItem('kata_cloud_disabled') === 'true') {
    return { url: '', key: '', isEnvConfigured: false, isPlaceholder: false };
  }

  const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
  const envKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();
  const localUrl = (localStorage.getItem('kata_supabase_url') || '').trim();
  const localKey = (localStorage.getItem('kata_supabase_key') || '').trim();

  // If localUrl is a known placeholder, auto-clean it
  if (localUrl.includes('your-project-id') || localUrl.includes('xyz.supabase.co')) {
    localStorage.removeItem('kata_supabase_url');
    localStorage.removeItem('kata_supabase_key');
  }

  const rawUrl = localUrl || envUrl || DEFAULT_SUPABASE_URL;
  const rawKey = localKey || envKey || DEFAULT_SUPABASE_KEY;
  const isPlaceholder = isPlaceholderConfig(rawUrl, rawKey);
  const isEnvConfigured = Boolean((envUrl && envKey && !isPlaceholderConfig(envUrl, envKey)) || (!localUrl && !envUrl));
  const url = isPlaceholder ? '' : formatSupabaseUrl(rawUrl);
  const key = isPlaceholder ? '' : rawKey;

  return { url, key, isEnvConfigured, isPlaceholder };
};

export const setSupabaseConfig = (url: string, key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kata_cloud_disabled');
  const formattedUrl = formatSupabaseUrl(url);
  localStorage.setItem('kata_supabase_url', formattedUrl);
  localStorage.setItem('kata_supabase_key', key.trim());
  supabaseInstance = null; // reset client to reinitialize
};

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;
  const { url, key, isPlaceholder } = getSupabaseConfig();
  if (!url || !key || isPlaceholder) return null;
  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.warn('Supabase initialization failed:', err);
    return null;
  }
};

export const getCurrentAuthUser = async (): Promise<User | null> => {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) return session.user;
    const { data: { user } } = await sb.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

const formatErrorMessage = (err: any): string => {
  const msg = err?.message || String(err || '');
  if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
    return 'Cannot reach Supabase. Check your Project URL (https://xyz.supabase.co), check internet connection, or restart the local server.';
  }
  return msg;
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { user: null, error: 'Supabase credentials not configured in Settings.' };
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { user: null, error: formatErrorMessage(error) };
    if (typeof window !== 'undefined' && data.user?.email) {
      localStorage.setItem('kata_auth_email', data.user.email);
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: formatErrorMessage(err) };
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { user: null, error: 'Supabase credentials not configured in Settings.' };
  try {
    const { data, error } = await sb.auth.signUp({ email: email.trim(), password });
    if (error) return { user: null, error: formatErrorMessage(error) };
    if (typeof window !== 'undefined' && data.user?.email) {
      localStorage.setItem('kata_auth_email', data.user.email);
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: formatErrorMessage(err) };
  }
};

export const getAuthRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
};

export const signInWithGoogle = async (): Promise<{ error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase credentials not configured in Settings.' };
  try {
    const redirectUrl = getAuthRedirectUrl();
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    return { error: error ? formatErrorMessage(error) : null };
  } catch (err) {
    return { error: formatErrorMessage(err) };
  }
};

export const resetPasswordForEmail = async (email: string): Promise<{ error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase credentials not configured in Settings.' };
  try {
    const redirectUrl = getAuthRedirectUrl();
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl
    });
    return { error: error ? formatErrorMessage(error) : null };
  } catch (err) {
    return { error: formatErrorMessage(err) };
  }
};

export const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase credentials not configured in Settings.' };
  try {
    const { error } = await sb.auth.updateUser({ password: newPassword });
    return { error: error ? formatErrorMessage(error) : null };
  } catch (err) {
    return { error: formatErrorMessage(err) };
  }
};

export const signOut = async () => {
  const sb = getSupabase();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kata_auth_email');
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sb-') && k.endsWith('-auth-token'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
  if (sb) {
    try {
      await sb.auth.signOut({ scope: 'local' });
    } catch (e) {
      console.warn('Signout warning:', e);
    }
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
    const user = await getCurrentAuthUser();
    if (!user) return { success: false, error: 'Sign in once to sync changes to cloud.' };

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
    return { success: false, error: formatErrorMessage(err) };
  }
};

// Pull latest data from Supabase kata_user_data table
export const pullFromCloud = async (): Promise<{ data: CloudSyncPayload | null; error?: string }> => {
  const sb = getSupabase();
  if (!sb) return { data: null, error: 'Supabase credentials not configured.' };

  try {
    const user = await getCurrentAuthUser();
    if (!user) return { data: null, error: 'Sign in once to sync changes from cloud.' };

    const { data, error } = await sb
      .from('kata_user_data')
      .select('kata_data, forge_data, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return { data };
  } catch (err: any) {
    console.warn('Cloud sync pull failed:', err);
    return { data: null, error: formatErrorMessage(err) };
  }
};
