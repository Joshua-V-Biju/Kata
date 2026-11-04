import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Target, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export const DailyQuestsCard: React.FC = () => {
  const { dailyQuests, comboMultiplier } = useKataStore();

  return (
    <div className="rounded-3xl glass-card p-5 md:p-6 border border-white/5 space-y-4 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background Japanese Watermark with Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -right-4 -bottom-6 text-9xl font-display font-black text-slate-900/[0.045] dark:text-white/[0.035] select-none leading-none">
          鍛錬
        </div>
        {/* Ambient subtle light glow behind kanji */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-amber-500/20 dark:bg-amber-400/15 blur-3xl pointer-events-none" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-display font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
              Daily Quests • 日々の鍛錬
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
              Complete tasks today for bonus XP
            </p>
          </div>
        </div>

        {/* Combo multiplier badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-800 dark:text-pink-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 animate-pulse" />
          <span>{comboMultiplier.toFixed(1)}x Combo</span>
        </div>
      </div>

      {/* Quests List - Vertical Stack for rock-solid layout without horizontal squishing */}
      <div className="space-y-2.5 flex-1">
        {dailyQuests.map((quest) => (
          <div
            key={quest.id}
            className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
              quest.completed
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 shadow-[0_0_15px_rgba(0,229,163,0.1)]'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
          >
            {/* Left: Icon and Title / Description */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 mt-0.5">
                {quest.completed ? (
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-0.5">
                <span className={`text-xs font-bold block truncate ${
                  quest.completed ? 'text-emerald-950 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {quest.title}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 font-normal">
                  {quest.description}
                </p>
              </div>
            </div>

            {/* Right: XP Badge & Claim Status */}
            <div className="shrink-0 text-right space-y-1">
              <span className="inline-flex items-center gap-1 font-mono text-amber-950 dark:text-amber-300 font-bold text-xs bg-amber-100 dark:bg-amber-500/15 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                <Zap className="w-3 h-3 fill-current" />
                +{quest.xpReward} XP
              </span>
              <span className={`block text-[10px] font-mono font-bold tracking-wider uppercase ${
                quest.completed ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
              }`}>
                {quest.completed ? 'CLAIMED ✓' : 'IN PROGRESS'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
