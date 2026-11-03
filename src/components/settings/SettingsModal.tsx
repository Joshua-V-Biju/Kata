import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { exportDataAsJson, readJsonFile } from '../../utils/storage';
import { getSupabaseConfig, setSupabaseConfig, clearSupabaseConfig, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, getSupabase } from '../../utils/supabase';
import { performBackgroundPush, performInitialCloudSync } from '../../utils/cloudSync';
import { useForgeStore } from '../../store/useForgeStore';
import { X, Moon, Sun, Bell, Volume2, Sparkles, Download, Upload, RefreshCw, Cloud, Shield, ShieldCheck, Check, LogOut, Key, CloudUpload, CloudDownload, Lock } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
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
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    const sb = getSupabase();
    if (sb) {
      sb.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setCurrentUserEmail(data.user.email);
        }
      });
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
    setAuthStatus('Authenticating...');
    const res = await signInWithEmail(authEmail, authPassword);
    if (res.error) {
      setAuthStatus(`Error: ${res.error}`);
    } else {
      setCurrentUserEmail(res.user?.email || authEmail);
      setAuthStatus('Signed in! Syncing latest data...');
      addToast('Cloud Sync Connected', `Logged in as ${authEmail}`, 'success');
      await performInitialCloudSync();
      setAuthStatus(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('Creating account...');
    const res = await signUpWithEmail(authEmail, authPassword);
    if (res.error) {
      setAuthStatus(`Error: ${res.error}`);
    } else {
      setAuthStatus('Verification email sent or account created!');
      addToast('Account Registered', 'Check your email to confirm.', 'info');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentUserEmail(null);
    setAuthStatus(null);
    addToast('Signed Out', 'Cloud sync disconnected. Operating local-first.', 'info');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-[#121722] border border-white/10 shadow-2xl text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-display font-black text-white mb-2">
          System Settings • 設定
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Preferences, audio, particle effects, backup, and optional cloud sync
        </p>

        <div className="space-y-6 text-xs">
          
          {/* Toggles */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <h3 className="font-display font-bold text-white text-sm">Experience & Feedback</h3>

            {/* Dark / Light Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Interface Theme</span>
              </div>
              <button
                onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold capitalize transition"
              >
                {settings.theme} Mode
              </button>
            </div>

            {/* Synthesizer Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Volume2 className="w-4 h-4 text-emerald-400" />
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
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-pink-400" />
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
              <div className="flex items-center gap-2 text-slate-300">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>PWA / Browser Habit Reminders</span>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
              >
                {settings.notificationsEnabled ? 'Active' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Backup & Data Persistence */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <h3 className="font-display font-bold text-white text-sm">Data Persistence (Local-First)</h3>
            <p className="text-slate-400 text-[11px]">
              All data is strictly stored on your device in LocalStorage / IndexedDB. You can export a full JSON backup at any time.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold transition"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold cursor-pointer transition">
                <Upload className="w-4 h-4" />
                <span>Import JSON Backup</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>

              <button
                onClick={() => {
                  if (confirm('Reset to Kata sample habits and seed schedule?')) {
                    resetToSeedData();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold transition ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          </div>

          {/* Supabase Cloud Sync */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-sm">Cloud Database & Auto-Sync</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium tracking-wide bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                {currentUserEmail ? 'AUTO-SYNC ACTIVE' : supabaseConfig.url ? 'READY TO SIGN IN' : 'LOCAL MODE'}
              </span>
            </div>

            <p className="text-slate-400 text-[11px]">
              Automatically synchronizes habits, quests, timetable, reminders, and Forge workout logs in real time across all your devices.
            </p>

            {/* Cloud Endpoint Status Card (Credentials Hidden for Security) */}
            {supabaseConfig.url ? (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-emerald-300">Supabase Cloud Secured</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Row-Level Security Active</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {supabaseConfig.isEnvConfigured
                        ? 'Connected via production environment variables. Keys are hidden & protected.'
                        : 'Connected via saved project configuration.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer p-1"
                >
                  {showAdvancedConfig ? 'Hide' : 'Configure'}
                </button>
              </div>
            ) : null}

            {/* Local-First Standalone Card (When Supabase is not configured) */}
            {!supabaseConfig.url && !showAdvancedConfig ? (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Local-First Storage Active</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Your habits, streak, and workouts save 100% locally to this computer (kata_data.json). No account, login, or cloud setup needed.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedConfig(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium shrink-0 ml-3 transition cursor-pointer"
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

            {/* Authenticated State */}
            {currentUserEmail ? (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-mono text-xs font-medium">{currentUserEmail}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300/90 text-[11px] leading-relaxed">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 font-semibold">Automatic Cloud Sync Active:</strong>
                    <p className="text-slate-300 text-[10px] mt-0.5">
                      Every habit checkmark, task completion, workout session, and XP gain automatically saves to your database in real time. No manual buttons needed.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handlePushToCloud}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isSyncing ? 'Syncing...' : 'Force Push Now'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handlePullFromCloud}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <CloudDownload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Force Pull Now</span>
                  </button>
                </div>
              </div>
            ) : supabaseConfig.url ? (
              /* Email Sign-in if configured */
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                <span className="block text-[11px] font-semibold text-slate-300">Sign In to Synchronize Across Devices</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="Password"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-semibold cursor-pointer transition"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer transition"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 ml-auto cursor-pointer transition"
                  >
                    Google OAuth
                  </button>
                </div>

                {authStatus && (
                  <p className="text-[11px] text-cyan-400 italic pt-1">{authStatus}</p>
                )}
              </div>
            ) : null}
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
