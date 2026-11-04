import React, { useState, useEffect } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { exportDataAsJson, readJsonFile } from '../../utils/storage';
import { getSupabaseConfig, setSupabaseConfig, clearSupabaseConfig, restoreDefaultSupabaseConfig, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, getSupabase, getCurrentAuthUser, getStoredAuthUser, resetPasswordForEmail, getAuthRedirectUrl } from '../../utils/supabase';
import { performBackgroundPush, performInitialCloudSync, setSyncStatus } from '../../utils/cloudSync';
import { soundEngine } from '../../utils/sound';
import { useForgeStore } from '../../store/useForgeStore';
import { X, Moon, Sun, Bell, Volume2, Sparkles, Download, Upload, RefreshCw, Cloud, Shield, ShieldCheck, Check, LogOut, Key, CloudUpload, CloudDownload, Lock, AlertCircle, Copy, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  currentMode?: 'kata' | 'forge';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, currentMode = 'kata' }) => {
  const {
    settings,
    updateSettings,
    resetToSeedData,
    importBackupData,
    habits,
    dayLogs,
    timetable,
    badges,
    userStats,
    addToast
  } = useKataStore();

  const supabaseConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(() => supabaseConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(() => supabaseConfig.key);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [copiedRedirect, setCopiedRedirect] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return getStoredAuthUser()?.email || null;
  });
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    // Check initial user from Supabase session or persistent storage
    getCurrentAuthUser().then(user => {
      if (user?.email) {
        setCurrentUserEmail(user.email);
      } else {
        const stored = getStoredAuthUser();
        if (stored?.email) {
          setCurrentUserEmail(stored.email);
        } else {
          setCurrentUserEmail(null);
        }
      }
    });

    // Reactive auth listener for instant UI updates on sign in / sign out
    const sb = getSupabase();
    if (sb) {
      const { data: listener } = sb.auth.onAuthStateChange((event, session) => {
        if (session?.user?.email) {
          localStorage.removeItem('kata_explicit_logged_out');
          setCurrentUserEmail(session.user.email);
          localStorage.setItem('kata_auth_email', session.user.email);
          localStorage.setItem('kata_auth_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            lastLogin: new Date().toISOString()
          }));
        } else if (event === 'SIGNED_OUT') {
          // Only clear when user explicitly signed out
          setCurrentUserEmail(null);
          localStorage.removeItem('kata_auth_email');
          localStorage.removeItem('kata_auth_user');
        }
      });
      return () => {
        listener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const handlePushToCloud = async () => {
    setIsSyncing(true);
    const success = await performBackgroundPush();
    setIsSyncing(false);
    if (success) {
      addToast('Cloud Sync Succeeded', 'All habits, tasks, and workouts backed up to Supabase!', 'success');
    } else {
      addToast('Sync Failed', 'Check network or Supabase table setup', 'badge');
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    const success = await performInitialCloudSync();
    setIsSyncing(false);
    if (success) {
      addToast('Cloud Data Restored', 'Latest data loaded from Supabase!', 'success');
    } else {
      addToast('Pull Failed', 'No data found or check Supabase connection', 'badge');
    }
  };

  const handleExport = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      habits,
      dayLogs,
      timetable,
      badges,
      userStats,
      settings
    };
    exportDataAsJson(backupData);
    addToast('Backup Exported', 'JSON data saved to your downloads folder.', 'success');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      importBackupData(data);
    } catch (err) {
      addToast('Import Failed', 'Could not parse JSON backup file.', 'badge');
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseConfig(supabaseUrl, supabaseKey);
    addToast('Cloud Settings Saved', 'Supabase credentials updated.', 'info');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword) {
      setAuthStatus('Please enter your email and password.');
      return;
    }
    setAuthStatus('Authenticating...');
    const res = await signInWithEmail(authEmail, authPassword);
    if (res.error) {
      setAuthStatus(`Error: ${res.error}`);
    } else {
      const email = res.user?.email || authEmail;
      setCurrentUserEmail(email);
      setAuthStatus('Signed in! Syncing latest data...');
      addToast('Cloud Sync Connected', `Logged in as ${email}`, 'success');
      await performInitialCloudSync();
      setAuthStatus(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword) {
      setAuthStatus('Please enter your email and password.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthStatus('Password must be at least 6 characters.');
      return;
    }
    setAuthStatus('Creating account...');
    const res = await signUpWithEmail(authEmail, authPassword);
    if (res.error) {
      setAuthStatus(`Error: ${res.error}`);
    } else {
      if (res.user?.email) {
        setCurrentUserEmail(res.user.email);
      }
      setAuthStatus('Account created! Please check your email to confirm if required.');
      addToast('Account Registered', 'Account setup complete.', 'info');
      await performInitialCloudSync();
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthStatus('Redirecting to Google authentication...');
    const res = await signInWithGoogle();
    if (res?.error) {
      setAuthStatus(`Google sign-in error: ${res.error}`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthStatus('Please enter your account email above first.');
      return;
    }
    setAuthStatus('Sending password recovery email...');
    const res = await resetPasswordForEmail(authEmail);
    if (res?.error) {
      setAuthStatus(`Recovery error: ${res.error}`);
    } else {
      setAuthStatus('Recovery link sent! Check your inbox (and spam folder) to reset your password.');
      addToast('Recovery Email Sent', `Sent reset link to ${authEmail}`, 'info');
    }
  };

  const handleSignOut = async () => {
    setIsSyncing(true);
    await signOut();
    setCurrentUserEmail(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthStatus(null);
    setSyncStatus('idle');
    setIsSyncing(false);
    addToast('Logged Out', 'You have been logged out of your account.', 'info');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        updateSettings({ notificationsEnabled: true });
        addToast('Notifications Enabled', 'Kata will notify you of scheduled habits.', 'success');
        new Notification('Kata • 習慣', {
          body: 'Notifications active! Your personal command center is ready.',
          icon: '/icon.svg'
        });
      } else {
        updateSettings({ notificationsEnabled: false });
        addToast('Permission Denied', 'Browser notification permission was not granted.', 'badge');
      }
    }
  };

  // Lock body scroll while modal is active
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  const [isThemeShaking, setIsThemeShaking] = useState(false);

  const handleToggleTheme = () => {
    if (currentMode === 'forge') {
      setIsThemeShaking(true);
      setTimeout(() => setIsThemeShaking(false), 550);

      const root = document.getElementById('root');
      if (root) {
        root.classList.add('animate-screen-shake');
        setTimeout(() => root.classList.remove('animate-screen-shake'), 450);
      }

      addToast('LOCK IN! 🔥', "YOU DON'T NEED LIGHT MODE IN THE FORGE", 'badge');
      soundEngine.playAnvilHit();
      return;
    }
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl p-5 sm:p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-slate-100 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          System Settings • 設定
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
          Preferences, audio, particle effects, backup, and optional cloud sync
        </p>

        <div className="space-y-6 text-xs">
          
          {/* Toggles */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">Experience & Feedback</h3>

            {/* Dark / Light Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                {currentMode === 'forge' ? (
                  <Moon className="w-4 h-4 text-orange-400" />
                ) : settings.theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>Interface Theme</span>
              </div>
              <button
                type="button"
                onClick={handleToggleTheme}
                className={`px-3 py-1 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                  isThemeShaking ? 'animate-forge-shake ring-2 ring-orange-500 bg-orange-500/30 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.6)]' : ''
                } ${
                  currentMode === 'forge'
                    ? 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-400 font-bold'
                    : 'bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200'
                }`}
              >
                {currentMode === 'forge' ? 'Forge Locked (Dark)' : `${settings.theme} Mode`}
              </button>
            </div>

            {/* Synthesizer Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Anime Chime & Level-Up Fanfare</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={e => updateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Sakura Floating Petals */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                <span>Floating Sakura Petal Atmosphere</span>
              </div>
              <input
                type="checkbox"
                checked={settings.sakuraEnabled}
                onChange={e => updateSettings({ sakuraEnabled: e.target.checked })}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Browser Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Bell className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>PWA / Browser Habit Reminders</span>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-500/10 hover:bg-amber-200 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-semibold transition"
              >
                {settings.notificationsEnabled ? 'Active' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Backup & Data Persistence */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">Data Persistence (Local-First)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              All data is strictly stored on your device in LocalStorage / IndexedDB. You can export a full JSON backup at any time.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 pt-1">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition">
                <Upload className="w-4 h-4" />
                <span>Import Backup</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>

              <button
                onClick={() => {
                  if (confirm('Reset to Kata sample habits and seed schedule?')) {
                    resetToSeedData();
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 hover:bg-rose-500/20 dark:hover:bg-rose-500/25 border border-rose-500/30 text-rose-800 dark:text-rose-300 font-bold transition cursor-pointer sm:ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          </div>

          {/* Supabase Cloud Sync */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">Cloud Database & Auto-Sync</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wide ${
                currentUserEmail
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : supabaseConfig.url
                  ? 'bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 text-cyan-800 dark:text-cyan-300'
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
              }`}>
                {currentUserEmail ? 'AUTO-SYNC ACTIVE' : supabaseConfig.url ? 'CLOUD READY • SIGN IN' : 'LOCAL MODE'}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Automatically synchronizes habits, quests, timetable, reminders, and Forge workout logs in real time across all your devices.
            </p>

            {/* Cloud Endpoint Status Card (Credentials Hidden for Security) */}
            {supabaseConfig.url ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Supabase Cloud Secured</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono font-bold">Row-Level Security Active</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {supabaseConfig.isEnvConfigured
                        ? 'Connected via production environment variables. Keys are hidden & protected.'
                        : 'Connected via saved project configuration.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="text-[10px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer p-1"
                >
                  {showAdvancedConfig ? 'Hide' : 'Configure'}
                </button>
              </div>
            ) : null}

            {/* Local-First Standalone Card (When Supabase is not configured) */}
            {!supabaseConfig.url && !showAdvancedConfig ? (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">Local-First Storage Active</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">
                      Your habits, streak, and workouts save 100% locally to this computer (kata_data.json). No account, login, or cloud setup needed.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    restoreDefaultSupabaseConfig();
                    const cfg = getSupabaseConfig();
                    setSupabaseUrl(cfg.url);
                    setSupabaseKey(cfg.key);
                    addToast('Cloud Reconnected', 'Kata Cloud backend restored.', 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold shrink-0 ml-3 transition cursor-pointer"
                >
                  Connect Cloud
                </button>
              </div>
            ) : null}

            {/* Collapsed / Advanced Custom Credentials (Masked) */}
            {showAdvancedConfig && (
              <form onSubmit={handleSaveSupabaseConfig} className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-semibold">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Custom Supabase Project Endpoint</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedConfig(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">PROJECT URL</label>
                    <input
                      type="password"
                      value={supabaseUrl}
                      onChange={e => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz.supabase.co"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">ANON PUBLIC KEY</label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={e => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOi..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      clearSupabaseConfig();
                      setSupabaseUrl('');
                      setSupabaseKey('');
                      setShowAdvancedConfig(false);
                      addToast('Reset to Local', 'Cloud configuration cleared. Local-first active.', 'info');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Clear Credentials & Reset
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold cursor-pointer"
                  >
                    Save Cloud Config
                  </button>
                </div>
              </form>
            )}

            {/* Logged In State (Permanently Connected Session) */}
            {currentUserEmail ? (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-emerald-300 dark:border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    <span className="text-slate-900 dark:text-white font-mono text-xs font-semibold">{currentUserEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    title="Log out of this account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>

                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300/90 text-[11px] leading-relaxed">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300 font-bold">Permanently Logged In:</strong>
                    <p className="text-slate-700 dark:text-slate-300 text-[10px] mt-0.5">
                      Your session is permanently active on this device. Every habit checkmark, workout log, and XP gain automatically syncs to cloud in real time.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handlePushToCloud}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>{isSyncing ? 'Syncing...' : 'Force Push to Cloud'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handlePullFromCloud}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <CloudDownload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Force Pull from Cloud</span>
                  </button>
                </div>
              </div>
            ) : supabaseConfig.url ? (
              /* One-Time Account Sign In (Persists permanently once signed in) */
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-3">
                {showForgotPassword ? (
                  /* Forgot Password Recovery Mode */
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        Reset Password via Email • 認証再設定
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setAuthStatus(null);
                        }}
                        className="text-[10px] text-cyan-700 dark:text-cyan-400 hover:underline cursor-pointer font-medium"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      Enter your account email to receive a secure password recovery link.
                    </p>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="your-account-email@domain.com"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition active:scale-95 shadow-md shadow-cyan-500/20"
                      >
                        Send Recovery Link
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setAuthStatus(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Sign In / Sign Up Mode */
                  <div className="space-y-2.5">
                    <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Sign In Once (Stay Logged In Permanently)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="password"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="Password"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] px-0.5">
                      <span className="text-slate-500">Local-first: Credentials stay private.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setAuthStatus(null);
                        }}
                        className="text-cyan-700 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={handleSignIn}
                        className="px-4 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold text-xs cursor-pointer transition active:scale-95"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={handleSignUp}
                        className="px-4 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs cursor-pointer transition active:scale-95"
                      >
                        Sign Up
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-medium text-xs ml-auto shadow-sm transition cursor-pointer active:scale-95"
                        title="Sign in with your Google account"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google OAuth</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Google OAuth & Password Reset Redirect Setup Helper */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      OAuth / Reset Redirecting to localhost:3000?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(getAuthRedirectUrl());
                          setCopiedRedirect(true);
                          setTimeout(() => setCopiedRedirect(false), 2000);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-500/20 hover:bg-amber-300 text-amber-950 dark:text-amber-300 font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      title="Copy exact redirect URL to clipboard"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedRedirect ? 'Copied ✓' : 'Copy Redirect URL'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    By default, Supabase sends OAuth &amp; recovery emails to its default Site URL (<code>localhost:3000</code>). In your <strong>Supabase Dashboard &gt; Authentication &gt; URL Configuration</strong>:
                  </p>
                  <ol className="text-[10px] text-slate-700 dark:text-slate-300 list-decimal pl-4 space-y-0.5">
                    <li>Set <strong>Site URL</strong> to: <code className="bg-amber-100 dark:bg-black/40 px-1 rounded">{getAuthRedirectUrl()}</code></li>
                    <li>Add to <strong>Redirect URLs</strong>: <code className="bg-amber-100 dark:bg-black/40 px-1 rounded">{getAuthRedirectUrl()}**</code> and <code className="bg-amber-100 dark:bg-black/40 px-1 rounded">https://*.vercel.app/**</code></li>
                  </ol>
                </div>

                {authStatus && (
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 italic pt-1">{authStatus}</p>
                )}
              </div>
            ) : null}
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-medium text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
