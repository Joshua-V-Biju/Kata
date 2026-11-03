import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { IconRenderer } from '../common/IconRenderer';
import { Trophy, Lock, Sparkles, Zap, Award } from 'lucide-react';

export const BadgesGrid: React.FC = () => {
  const { badges, userStats } = useKataStore();

  const getRarityStyle = (rarity: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        border: 'border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500',
        badge: 'bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-slate-500 border-slate-300 dark:border-white/5',
        glow: ''
      };
    }
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-pink-300 dark:border-pink-500/40 bg-gradient-to-b from-pink-50/90 to-white dark:from-pink-950/20 dark:to-slate-900',
          badge: 'bg-pink-100 dark:bg-pink-500/20 text-pink-900 dark:text-pink-300 border-pink-300 dark:border-pink-500/30 font-bold',
          glow: 'shadow-[0_0_20px_rgba(244,114,182,0.15)]'
        };
      case 'epic':
        return {
          border: 'border-purple-300 dark:border-purple-500/40 bg-gradient-to-b from-purple-50/90 to-white dark:from-purple-950/20 dark:to-slate-900',
          badge: 'bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-500/30 font-bold',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]'
        };
      case 'rare':
        return {
          border: 'border-cyan-300 dark:border-cyan-500/40 bg-gradient-to-b from-cyan-50/90 to-white dark:from-cyan-950/20 dark:to-slate-900',
          badge: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30 font-bold',
          glow: 'shadow-[0_0_20px_rgba(0,242,254,0.15)]'
        };
      default:
        return {
          border: 'border-amber-300 dark:border-amber-500/30 bg-gradient-to-b from-amber-50/80 to-white dark:bg-slate-900/60',
          badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-500/20 font-bold',
          glow: ''
        };
    }
  };

  const unlockedCount = badges.filter(b => b.progress >= b.maxProgress).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 text-slate-950 shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white">
                Hall of Mastery • 栄誉の殿堂
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-300 text-xs font-bold font-mono">
                {unlockedCount} / {badges.length} Unlocked • 解放
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Disciplinary milestones, secret feats & legendary achievements
            </p>
          </div>
        </div>

        {/* Current Rank Display */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">Rank Elevation • 段位</span>
            <span className="text-sm font-display font-bold text-slate-900 dark:text-white">
              {userStats.rankTitle} • {userStats.rankKanji}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/40 flex items-center justify-center text-cyan-950 dark:text-cyan-300 font-mono font-bold text-sm">
            Lv.{userStats.level}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => {
          const isUnlocked = badge.progress >= badge.maxProgress;
          const styles = getRarityStyle(badge.rarity, isUnlocked);
          const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${styles.border} ${styles.glow}`}
            >
              {/* Background Kanji Watermark */}
              <div className="absolute right-2 top-0 text-5xl font-display font-black text-white/[0.03] select-none pointer-events-none">
                {badge.titleKanji}
              </div>

              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md transition-all ${
                        isUnlocked
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/20 text-slate-900 dark:text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isUnlocked ? (
                        <IconRenderer name={badge.icon} size={24} />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      )}
                    </div>

                    <div>
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono uppercase font-bold tracking-wider inline-block ${styles.badge}`}>
                        {badge.rarity}
                      </span>
                      <h3 className={`text-sm font-display font-bold mt-1 ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {badge.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar & Status */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className={isUnlocked ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                    {isUnlocked ? 'UNLOCKED • 達成' : `PROGRESS • 進捗: ${badge.progress} / ${badge.maxProgress}`}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 font-bold">{percent}%</span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_#00e5a3]' : 'bg-slate-400 dark:bg-slate-700'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
