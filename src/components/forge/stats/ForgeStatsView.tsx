import React from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { Flame, Zap, Trophy, Shield, Activity, Award } from 'lucide-react';

export const ForgeStatsView: React.FC = () => {
  const { stats } = useForgeStore();

  const ranks = [
    { title: 'Ember', minIron: 0, kanji: '火種', color: '#f97316' },
    { title: 'Spark', minIron: 150, kanji: '火花', color: '#fb923c' },
    { title: 'Flame', minIron: 400, kanji: '火炎', color: '#ea580c' },
    { title: 'Blaze', minIron: 750, kanji: '紅蓮', color: '#dc2626' },
    { title: 'Inferno', minIron: 1200, kanji: '業火', color: '#ef4444' },
    { title: 'Titan', minIron: 2000, kanji: '鋼神', color: '#f59e0b' }
  ];

  const currentRankIndex = ranks.findIndex(r => r.title === stats.rank);
  const nextRank = ranks[currentRankIndex + 1];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Rank & Iron Hero Card */}
      <div className="forge-card p-6 sm:p-8 rounded-3xl border-2 border-orange-500/30 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
              FORGE RANK &amp; REPUTATION
            </span>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-600 to-red-600 text-slate-950 shadow-lg shadow-orange-500/30">
                <Flame className="w-8 h-8 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-black text-white">
                  Rank: {stats.rank}
                </h1>
                <span className="text-xs font-mono text-slate-400">
                  Tier {currentRankIndex + 1} of 6 • {ranks[currentRankIndex]?.kanji}
                </span>
              </div>
            </div>
          </div>

          {/* Iron Balance */}
          <div className="p-4 rounded-2xl bg-black/60 border border-orange-500/30 flex items-center gap-3 shrink-0">
            <Zap className="w-7 h-7 text-orange-400 fill-orange-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">
                Mined Iron Currency
              </span>
              <span className="text-2xl font-mono font-black text-orange-300">
                {stats.iron.toLocaleString()} Iron
              </span>
            </div>
          </div>

        </div>

        {/* Weekly Heat Meter */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-bold">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Weekly Heat Meter (Decays if you skip)</span>
            </span>
            <span className="text-orange-400 font-bold">{stats.heat}% Heat</span>
          </div>

          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full heat-shimmer shadow-[0_0_12px_rgba(255,102,0,0.8)] transition-all duration-700"
              style={{ width: `${stats.heat}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">
            Train consistently to build heat. Heat resets every Monday.
          </span>
        </div>
      </div>

      {/* Lifetime Forge Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl forge-card border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Workouts</span>
          <span className="text-2xl font-mono font-black text-white">{stats.totalWorkouts}</span>
        </div>

        <div className="p-4 rounded-2xl forge-card border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Lifetime Volume</span>
          <span className="text-2xl font-mono font-black text-amber-400">{stats.totalVolumeKg.toLocaleString()} kg</span>
        </div>

        <div className="p-4 rounded-2xl forge-card border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Sets Logged</span>
          <span className="text-2xl font-mono font-black text-orange-400">{stats.totalSets}</span>
        </div>

        <div className="p-4 rounded-2xl forge-card border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Current Streak</span>
          <span className="text-2xl font-mono font-black text-red-400">{stats.currentStreak} Days</span>
        </div>
      </div>

      {/* Forge Badges Preview */}
      <div className="space-y-3">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-400" />
          <span>Forge Badges &amp; Achievements</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'First Pour', desc: 'Finish 1st workout in Forge', done: stats.totalWorkouts >= 1 },
            { title: 'Iron Week', desc: 'Complete 3 workouts in a week', done: stats.totalWorkouts >= 3 },
            { title: '100 Sets', desc: 'Hit 100 hard sets logged', done: stats.totalSets >= 100 },
            { title: 'PR Hunter', desc: 'Break 5 personal records', done: true }
          ].map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                b.done
                  ? 'bg-orange-950/20 border-orange-500/30'
                  : 'bg-black/40 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className={`w-4 h-4 ${b.done ? 'text-orange-400' : 'text-slate-500'}`} />
                <h4 className="font-display font-bold text-white text-xs">{b.title}</h4>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
