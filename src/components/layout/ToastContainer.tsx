import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Sparkles, CheckCircle2, Zap, Award, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useKataStore();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderColor = 'border-cyan-500/30';
        let icon = <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
        let glow = 'shadow-glow-cyan';

        if (toast.type === 'xp') {
          borderColor = 'border-amber-500/40';
          icon = <Zap className="w-5 h-5 text-amber-400 animate-pulse" />;
          glow = 'shadow-glow-amber';
        } else if (toast.type === 'badge') {
          borderColor = 'border-purple-500/40';
          icon = <Award className="w-5 h-5 text-purple-400" />;
          glow = 'shadow-glow-purple';
        } else if (toast.type === 'success') {
          borderColor = 'border-emerald-500/40';
          icon = <Sparkles className="w-5 h-5 text-emerald-400" />;
          glow = 'shadow-glow-mint';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/90 dark:bg-[#121722]/95 backdrop-blur-md border ${borderColor} ${glow} text-slate-100 transition-all duration-300 transform translate-y-0`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold tracking-wide flex items-center justify-between">
                <span>{toast.title}</span>
                <span className="text-[10px] font-mono text-slate-400 ml-2">Just now</span>
              </div>
              {toast.description && (
                <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
