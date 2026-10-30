import React from 'react';
import { Flame, Trophy, Zap, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  summary: { volumeKg: number; ironEarned: number; prCount: number };
  durationFormatted: string;
  workoutName: string;
  onClose: () => void;
}

export const WorkoutFinishModal: React.FC<Props> = ({
  summary,
  durationFormatted,
  workoutName,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0f1118] border-2 border-orange-500/50 shadow-[0_0_60px_rgba(255,102,0,0.3)] text-center space-y-6 overflow-hidden">
        
        {/* Top Molten Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-red-600" />

        {/* Anvil / Flame Trophy Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-red-500 p-0.5 shadow-xl shadow-orange-500/30 flex items-center justify-center animate-impact">
          <div className="w-full h-full bg-[#0a0c12] rounded-[22px] flex items-center justify-center text-orange-400">
            <Flame className="w-8 h-8 fill-orange-400" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 block">
            SESSION FORGED • 鍛錬完了
          </span>
          <h2 className="text-2xl font-display font-black text-white">
            {workoutName}
          </h2>
          <p className="text-xs text-slate-400">
            All volume recorded. Your armor is forged one rep at a time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Duration</span>
            <span className="text-lg font-mono font-bold text-white">{durationFormatted}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Volume</span>
            <span className="text-lg font-mono font-bold text-amber-400">{summary.volumeKg.toLocaleString()} kg</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">PRs Hit</span>
            <span className="text-lg font-mono font-bold text-orange-400 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>+{summary.prCount} PRs</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-1">
            <span className="text-[10px] font-mono text-orange-400 uppercase block font-bold">Iron Mined</span>
            <span className="text-lg font-mono font-black text-orange-300 flex items-center gap-1">
              <Zap className="w-4 h-4 fill-orange-400" />
              <span>+{summary.ironEarned} Iron</span>
            </span>
          </div>
        </div>

        {/* Kata Habit Bridge Notice */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2.5 text-left">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            <strong>Kata Bridge:</strong> Today’s <em>Workout/Yoga</em> habit cell in Kata was automatically checked!
          </span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>RETURN TO FORGE COMMAND</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
