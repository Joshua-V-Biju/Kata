import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { exportDataAsJson, readJsonFile } from '../../utils/storage';
import { getSupabaseConfig, setSupabaseConfig, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, getSupabase } from '../../utils/supabase';
import { X, Moon, Sun, Bell, Volume2, Sparkles, Download, Upload, RefreshCw, Cloud, Shield, Check, LogOut, Key } from 'lucide-react';

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

  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseConfig().key);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

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
      setAuthStatus('Signed in successfully!');
      addToast('Cloud Sync Connected', `Logged in as ${authEmail}`, 'success');
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

          {/* Optional Supabase Cloud Sync */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-sm">Optional Supabase Cloud Sync</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono">
                {currentUserEmail ? 'CONNECTED' : 'STANDALONE (OFFLINE)'}
              </span>
            </div>

            <p className="text-slate-400 text-[11px]">
              The app functions 100% without an account. To optionally synchronize data across devices, configure your Supabase project below.
            </p>

            {currentUserEmail ? (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-mono text-xs">{currentUserEmail}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveSupabaseConfig} className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">SUPABASE URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={e => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz.supabase.co"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">ANON KEY</label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={e => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOi..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold"
                  >
                    Save Supabase Keys
                  </button>
                </div>
              </form>
            )}

            {/* Optional Email Sign-in if configured */}
            {supabaseUrl && !currentUserEmail && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="block text-[11px] font-semibold text-slate-300">Account Sign In / Register</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="Password"
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 ml-auto"
                  >
                    Google OAuth
                  </button>
                </div>

                {authStatus && (
                  <p className="text-[11px] text-cyan-400 italic pt-1">{authStatus}</p>
                )}
              </div>
            )}
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
