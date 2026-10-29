import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Target, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export const DailyQuestsCard: React.FC = () => {
  const { dailyQuests, comboMultiplier } = useKataStore();

  return (
    <div className="rounded-3xl glass-card p-5 md:p-6 border border-white/5 space-y-4 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-display font-bold text-white truncate flex items-center gap-2">
              Daily Trials • 日々の鍛錬
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Complete trials to surge bonus XP
            </p>
          </div>
        </div>

        {/* Combo multiplier badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
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
                ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(0,229,163,0.1)]'
                : 'bg-slate-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            {/* Left: Icon and Title / Description */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="shrink-0 mt-0.5">
                {quest.completed ? (
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1 rounded-full bg-white/5 text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-0.5">
                <span className={`text-xs font-semibold block truncate ${
                  quest.completed ? 'text-emerald-300' : 'text-slate-200'
                }`}>
                  {quest.title}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {quest.description}
                </p>
              </div>
            </div>

            {/* Right: XP Badge & Claim Status */}
            <div className="shrink-0 text-right space-y-1">
              <span className="inline-flex items-center gap-1 font-mono text-amber-300 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Zap className="w-3 h-3 fill-amber-300" />
                +{quest.xpReward} XP
              </span>
              <span className={`block text-[10px] font-mono font-bold tracking-wider uppercase ${
                quest.completed ? 'text-emerald-400' : 'text-slate-500'
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
