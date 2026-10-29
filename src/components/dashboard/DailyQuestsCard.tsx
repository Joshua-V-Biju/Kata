import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Target, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export const DailyQuestsCard: React.FC = () => {
  const { dailyQuests, comboMultiplier } = useKataStore();

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              Daily Trials • 日々の鍛錬
            </h2>
            <p className="text-xs text-slate-400">
              Complete trials to surge bonus XP & unlock badges
            </p>
          </div>
        </div>

        {/* Combo multiplier badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>Combo: {comboMultiplier.toFixed(1)}x</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {dailyQuests.map((quest) => (
          <div
            key={quest.id}
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              quest.completed
                ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(0,229,163,0.1)]'
                : 'bg-slate-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-200 leading-snug">
                {quest.title}
              </span>
              {quest.completed ? (
                <div className="shrink-0 p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="shrink-0 p-1 rounded-full bg-white/5 text-slate-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              {quest.description}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
              <span className={`text-[11px] font-semibold ${quest.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                {quest.completed ? 'CLAIMED • 達成' : 'IN PROGRESS'}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                <Zap className="w-3 h-3 fill-amber-300" />
                +{quest.xpReward} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
