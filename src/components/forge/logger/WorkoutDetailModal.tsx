import React from 'react';
import { WorkoutSession } from '../../../types/forge';
import {
  X,
  Clock,
  Dumbbell,
  Zap,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Calendar,
  Activity,
  FileText
} from 'lucide-react';

interface Props {
  workout: WorkoutSession | null;
  isOpen: boolean;
  onClose: () => void;
  onRepeat?: (workout: WorkoutSession) => void;
}

export const WorkoutDetailModal: React.FC<Props> = ({
  workout,
  isOpen,
  onClose,
  onRepeat
}) => {
  if (!isOpen || !workout) return null;

  const durM = Math.floor(workout.durationSeconds / 60);
  const durS = workout.durationSeconds % 60;
  const dateFormatted = new Date(workout.startedAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Calculate total completed sets
  let totalSets = 0;
  workout.exercises.forEach(ex => {
    totalSets += ex.sets.filter(s => s.completed).length;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1118] border-2 border-orange-500/30 shadow-[0_0_50px_rgba(255,102,0,0.2)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-600/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                COMPLETED SESSION • 実績詳細
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateFormatted}</span>
              </span>
            </div>
            <h2 className="text-2xl font-display font-black text-white">
              {workout.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/60 border border-white/5 font-mono text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Duration</span>
            <span className="text-lg font-black text-white">{durM}m {durS}s</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Total Sets</span>
            <span className="text-lg font-black text-amber-400">{totalSets} Sets</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Volume</span>
            <span className="text-lg font-black text-orange-400">{workout.totalVolumeKg.toLocaleString()} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Iron Mined</span>
            <span className="text-lg font-black text-emerald-400">+{workout.ironEarned} Iron</span>
          </div>
        </div>

        {/* Workout Notes (if present) */}
        {workout.notes && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
            <FileText className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Session Reflection &amp; Notes
              </span>
              <p className="text-xs font-mono text-slate-200 italic leading-relaxed">
                "{workout.notes}"
              </p>
            </div>
          </div>
        )}

        {/* Detailed Exercise Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-orange-400" />
            <span>Exercises &amp; Set Breakdown ({workout.exercises.length})</span>
          </h3>

          <div className="space-y-3">
            {workout.exercises.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 font-mono text-xs font-bold flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <h4 className="font-display font-bold text-white text-sm">
                      {ex.name}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {ex.sets.filter(s => s.completed).length} Sets Logged
                  </span>
                </div>

                {/* Sets Table */}
                <div className="rounded-xl bg-black/40 border border-white/5 overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-5 p-2 bg-slate-900/50 text-[10px] text-slate-500 uppercase tracking-wider text-center font-bold">
                    <span>Set</span>
                    <span>Type</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>Tempo / RPE</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {ex.sets.map((s, sIdx) => (
                      <div
                        key={s.id || sIdx}
                        className={`grid grid-cols-5 p-2 text-center items-center ${
                          s.completed ? 'text-slate-200' : 'text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="font-bold text-orange-400">#{s.setNumber || sIdx + 1}</span>
                        <span className="capitalize text-[11px] text-slate-400">{s.type}</span>
                        <span className="font-bold text-white">{s.reps} reps</span>
                        <span>{s.weightKg > 0 ? `${s.weightKg} kg` : 'Bodyweight'}</span>
                        <span className="text-[11px] text-amber-300">
                          {s.tempo || 'Standard'} {s.rpe ? `• RPE ${s.rpe}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-2">
          {onRepeat && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRepeat(workout);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Repeat This Workout</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
