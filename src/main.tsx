import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary to prevent any blank screen crashes
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Kata App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-[#121722] border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-display font-black text-2xl">
              型
            </div>
            <h1 className="text-2xl font-display font-black text-white">
              Kata Recovery Protocol
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              A temporary initialization hitch occurred. Click below to reset state cache and resume your personal command center.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  try {
                    // Preserve critical user habit, workout and account data
                    const savedKata = localStorage.getItem('kata_habits');
                    const savedLogs = localStorage.getItem('kata_day_logs');
                    const savedForge = localStorage.getItem('forge_fitness_v1');
                    const savedCindy = localStorage.getItem('forge_cindy_sessions_v1');
                    const savedUser = localStorage.getItem('kata_supabase_auth_user');
                    const savedConfig = localStorage.getItem('kata_supabase_config');

                    sessionStorage.clear();
                    localStorage.clear();

                    if (savedKata) localStorage.setItem('kata_habits', savedKata);
                    if (savedLogs) localStorage.setItem('kata_day_logs', savedLogs);
                    if (savedForge) localStorage.setItem('forge_fitness_v1', savedForge);
                    if (savedCindy) localStorage.setItem('forge_cindy_sessions_v1', savedCindy);
                    if (savedUser) localStorage.setItem('kata_supabase_auth_user', savedUser);
                    if (savedConfig) localStorage.setItem('kata_supabase_config', savedConfig);
                  } catch (e) {}
                  window.location.reload();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
              >
                Reset Cache & Reload Kata
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Standard Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Unregister any legacy service workers and clear stale caches
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
