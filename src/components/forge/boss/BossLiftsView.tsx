import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { soundEngine } from '../../../utils/sound';
import { fireLevelUpConfetti } from '../../../utils/confetti';
import { Skull, Swords, Trophy, Zap, Shield, Flame, CheckCircle2 } from 'lucide-react';

interface BossTarget {
  id: string;
  name: string;
  titleKanji: string;
  exerciseName: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  ironBounty: number;
  description: string;
}

export const BossLiftsView: React.FC = () => {
  const { workouts, stats } = useForgeStore();

  // Find max reps or hold for boss targets
  const getMaxReps = (exName: string) => {
    let max = 0;
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.name.toLowerCase().includes(exName.toLowerCase())) {
          ex.sets.forEach(s => {
            if (s.completed && s.reps > max) max = s.reps;
          });
        }
      });
    });
    return max;
  };

  const [bosses, setBosses] = useState<BossTarget[]>([
    {
      id: 'boss-pullup-10',
      name: 'Iron Gargoyle • 鋼の翼',
      titleKanji: '十連懸垂',
      exerciseName: 'Strict Pull-up (Overhand)',
      targetMetric: 'reps',
      targetValue: 10,
      currentValue: Math.max(8, getMaxReps('pull-up')),
      ironBounty: 300,
      description: 'Break the gravitational barrier with 10 strict dead-hang pull-ups in a single continuous set.'
    },
    {
      id: 'boss-pushup-35',
      name: 'Colossus of Ash • 灰燼の巨人',
      titleKanji: '三十五連撃',
      exerciseName: 'Standard Push-up',
      targetMetric: 'reps',
      targetValue: 35,
      currentValue: Math.max(22, getMaxReps('push-up')),
      ironBounty: 250,
      description: 'Shatter chest and tricep endurance with 35 unbroken chest-to-floor push-ups.'
    },
    {
      id: 'boss-pistol-5',
      name: 'Hydra of the Monolith • 一脚の蛇神',
      titleKanji: '五連単脚',
      exerciseName: 'Pistol Squat (Single Leg)',
      targetMetric: 'reps',
      targetValue: 5,
      currentValue: Math.max(2, getMaxReps('pistol')),
      ironBounty: 350,
      description: 'Master unilateral balance and quad strength with 5 free pistol squats on each leg.'
    },
    {
      id: 'boss-dip-15',
      name: 'Forge Vanguard • 前衛鉄甲',
      titleKanji: '十五連浸撃',
      exerciseName: 'Parallel Bar Dips',
      targetMetric: 'reps',
      targetValue: 15,
      currentValue: Math.max(10, getMaxReps('dip')),
      ironBounty: 275,
      description: 'Lock out 15 strict parallel bar dips without pausing or breaking form.'
    },
    {
      id: 'boss-lsit-30',
      name: 'The Abyssal Anchor • 重力の檻',
      titleKanji: '三十秒拘束',
      exerciseName: 'L-Sit Hold (Chair / Parallettes)',
      targetMetric: 'seconds',
      targetValue: 30,
      currentValue: 18,
      ironBounty: 400,
      description: 'Hold legs dead-level with arms locked for 30 continuous seconds.'
    }
  ]);

  const handleDefeatBoss = (bossId: string) => {
    soundEngine.playLevelUp();
    fireLevelUpConfetti();
    setBosses(prev =>
      prev.map(b => (b.id === bossId ? { ...b, currentValue: b.targetValue } : b))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <Skull className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
            BOSS SKILLS CHAMBER • 討伐試練
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Boss Lifts &amp; Strength Challenges
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Pick a target milestone. The boss’s health bar drains as your personal records rise. Conquer the boss to claim permanent Iron bounties.
        </p>
      </div>

      {/* Boss Cards List */}
      <div className="space-y-4">
        {bosses.map(boss => {
          const ratio = Math.min(1, boss.currentValue / boss.targetValue);
          const percent = Math.round(ratio * 100);
          const bossRemainingHp = Math.max(0, 100 - percent);
          const isDefeated = percent >= 100;

          return (
            <div
              key={boss.id}
              className={`p-6 rounded-3xl border transition-all forge-card space-y-4 ${
                isDefeated
                  ? 'border-emerald-500/40 bg-emerald-950/15 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                  : 'border-orange-500/30 hover:border-orange-500/50'
              }`}
            >
              {/* Boss Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-xs font-bold">
                      BOSS • {boss.titleKanji}
                    </span>
                    <h3 className="text-xl font-display font-black text-white">
                      {boss.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 max-w-lg">
                    {boss.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block">Bounty</span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-amber-400" />
                      <span>+{boss.ironBounty} Iron</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Boss Health Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-orange-400" />
                    <span>Progress: <strong>{boss.currentValue} / {boss.targetValue} {boss.targetMetric}</strong></span>
                  </span>
                  <span className={`font-bold ${isDefeated ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isDefeated ? 'BOSS DEFEATED' : `Boss HP: ${bossRemainingHp}%`}
                  </span>
                </div>

                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDefeated
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                        : 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              {!isDefeated ? (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-slate-400">
                    Log this exercise in your next session to inflict damage.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDefeatBoss(boss.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-slate-300 text-xs font-mono transition cursor-pointer"
                  >
                    Quick Record PR
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Trial Conquered! Bounty Claimed.</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    VICTORY ACHIEVED
                  </span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
