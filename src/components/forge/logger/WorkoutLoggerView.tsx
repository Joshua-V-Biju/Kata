import React, { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { STARTER_ROUTINES, AVAILABLE_EQUIPMENT } from '../../../utils/forgeData';
import { ExerciseLoggerCard } from './ExerciseLoggerCard';
import { RestTimerBar } from './RestTimerBar';
import { AddExerciseModal } from './AddExerciseModal';
import { WorkoutFinishModal } from './WorkoutFinishModal';
import {
  Flame,
  Plus,
  Play,
  Clock,
  Dumbbell,
  CheckCircle2,
  Trophy,
  Zap,
  RotateCcw,
  Sliders,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

interface Props {
  onOpenArmory: () => void;
}

export const WorkoutLoggerView: React.FC<Props> = ({ onOpenArmory }) => {
  const {
    activeWorkout,
    startWorkout,
    cancelWorkout,
    finishWorkout,
    tickWorkoutTimer,
    tickRestTimer,
    equipment,
    workouts
  } = useForgeStore();

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [finishSummary, setFinishSummary] = useState<{
    volumeKg: number;
    ironEarned: number;
    prCount: number;
  } | null>(null);

  // Timer tickers
  useEffect(() => {
    if (!activeWorkout.isActive) return;
    const interval = setInterval(() => {
      tickWorkoutTimer();
      tickRestTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout.isActive, tickWorkoutTimer, tickRestTimer]);

  const minutes = Math.floor(activeWorkout.elapsedSeconds / 60);
  const seconds = activeWorkout.elapsedSeconds % 60;
  const elapsedFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleFinish = () => {
    const summary = finishWorkout();
    setFinishSummary(summary);
  };

  // Compute live active workout stats
  let liveCompletedSets = 0;
  let liveTotalVolume = 0;

  if (activeWorkout.session) {
    activeWorkout.session.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          liveCompletedSets++;
          const effectiveW = s.weightKg > 0 ? s.weightKg : 50;
          liveTotalVolume += s.reps * effectiveW;
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // ACTIVE WORKOUT VIEW
  // --------------------------------------------------------------------------
  if (activeWorkout.isActive && activeWorkout.session) {
    return (
      <div className="space-y-6 animate-fade-in pb-16">
        
        {/* Sticky Active Header Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#12141c] border-2 border-orange-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400">
                LIVE FORGE SESSION • 鍛錬中
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              {activeWorkout.session.name}
            </h2>
          </div>

          {/* Live Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-base font-bold text-white">{elapsedFormatted}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-2">
              <span className="text-slate-400">Sets:</span>
              <span className="text-base font-bold text-amber-400">{liveCompletedSets}</span>
            </div>

            <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 items-center gap-2">
              <span className="text-slate-400">Vol:</span>
              <span className="text-base font-bold text-orange-400">{liveTotalVolume}kg</span>
            </div>
          </div>
        </div>

        {/* Rest Timer Bar */}
        <RestTimerBar />

        {/* Exercises List */}
        <div className="space-y-4">
          {activeWorkout.session.exercises.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
              <Dumbbell className="w-10 h-10 text-orange-400/60 mx-auto" />
              <h3 className="font-display font-bold text-white text-base">
                Your session is empty
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add an exercise from your home library to begin logging sets and tracking progressive overload.
              </p>
              <button
                type="button"
                onClick={() => setShowAddExercise(true)}
                className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                + Add Exercise
              </button>
            </div>
          ) : (
            activeWorkout.session.exercises.map(ex => (
              <ExerciseLoggerCard key={ex.id} loggedExercise={ex} />
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAddExercise(true)}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Add Exercise</span>
          </button>

          <button
            type="button"
            onClick={handleFinish}
            disabled={activeWorkout.session.exercises.length === 0}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>FINISH WORKOUT • 鍛錬完了</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Discard current workout session?')) {
                cancelWorkout();
              }
            }}
            className="py-3 px-4 rounded-2xl text-slate-500 hover:text-rose-400 text-xs font-mono transition"
          >
            Cancel
          </button>
        </div>

        {/* Modals */}
        <AddExerciseModal
          isOpen={showAddExercise}
          onClose={() => setShowAddExercise(false)}
        />

        {finishSummary && (
          <WorkoutFinishModal
            summary={finishSummary}
            durationFormatted={elapsedFormatted}
            workoutName={activeWorkout.session.name}
            onClose={() => setFinishSummary(null)}
          />
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // WORKOUT LAUNCHER / DASHBOARD VIEW (WHEN NO WORKOUT ACTIVE)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Hero Start Session Banner */}
      <div className="relative overflow-hidden rounded-3xl forge-card p-6 sm:p-8 border-2 border-orange-500/30 shadow-2xl">
        <div className="absolute -right-6 -bottom-8 text-9xl font-display font-black text-orange-500/[0.03] select-none pointer-events-none">
          鍛錬
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse" />
              <span>HOME HYPERTROPHY COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Ready to Forge Armor?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
              Log sets with auto-rest timers, tempo controls, and progressive overload tracking. Every workout finished automatically ticks Kata's “Workout/Yoga” habit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => startWorkout(undefined, 'Freestyle Forge Session')}
            className="w-full md:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START EMPTY WORKOUT</span>
          </button>
        </div>
      </div>

      {/* Armory Status Ribbon */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-mono text-slate-300">
            Active Armory: <strong>{equipment.length} equipment items</strong> configured
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenArmory}
          className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
        >
          <span>Modify Armory</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Starter Routines Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span>Recommended Home Routines</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Calibrated for your gear
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STARTER_ROUTINES.map(routine => (
            <div
              key={routine.id}
              className="forge-card p-5 rounded-2xl border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold uppercase">
                    {routine.daysPerWeek} Days / Wk
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {routine.exerciseIds.length} Exercises
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base group-hover:text-orange-400 transition-colors">
                  {routine.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {routine.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => startWorkout(routine)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-slate-200 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Routine</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts Log History */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>Recent Forge History</span>
        </h2>

        {workouts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs rounded-2xl bg-black/20 border border-white/5">
            No completed workouts yet. Forge your first session today!
          </div>
        ) : (
          <div className="space-y-2.5">
            {workouts.slice(0, 5).map(w => {
              const durM = Math.floor(w.durationSeconds / 60);
              const dateObj = new Date(w.startedAt);
              const dateStr = dateObj.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">
                        {w.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/5 text-slate-400">
                        {dateStr}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <span>{durM} mins</span>
                      <span>•</span>
                      <span className="text-amber-400">{w.totalVolumeKg.toLocaleString()} kg vol</span>
                      <span>•</span>
                      <span>{w.exercises.length} exercises</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-orange-400" />
                      <span>+{w.ironEarned} Iron</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
