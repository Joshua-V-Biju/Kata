import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Trophy, Sparkles, Zap, ArrowRight, X } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal, userStats } = useKataStore();

  if (!levelUpModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-[#182030] to-[#0d121c] border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,242,254,0.35)] text-center overflow-hidden">
        
        {/* Anime background energy rays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={closeLevelUpModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Kanji Watermark */}
        <div className="text-[72px] font-display font-black text-cyan-400/10 select-none absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          昇格
        </div>

        {/* Level Up Crest */}
        <div className="relative mx-auto mt-2 w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/30">
          <div className="w-full h-full bg-[#101622] rounded-2xl flex items-center justify-center">
            <Trophy className="w-10 h-10 text-cyan-300 animate-bounce" />
          </div>
        </div>

        <div className="mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Level Up Reached • レベルアップ
          </div>
          
          <h2 className="text-3xl font-display font-black text-white mt-2 tracking-wide">
            Level {levelUpModal.newLevel}
          </h2>
          <p className="text-sm font-display text-cyan-400 font-semibold mt-0.5">
            Rank: {levelUpModal.rankTitle} • {levelUpModal.rankKanji}
          </p>
        </div>

        {/* Stats Growth Card */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Checkmarks</span>
            <span className="font-mono text-cyan-300 font-bold">{userStats.totalCompletions}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Discipline Streak</span>
            <span className="font-mono text-amber-400 font-bold">{userStats.currentStreak} Days 🔥</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Voltron Sprints Cleared</span>
            <span className="font-mono text-purple-400 font-bold">{userStats.voltronSprintsCompleted}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={closeLevelUpModal}
          className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Continue The Path • 鍛錬を続ける</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
