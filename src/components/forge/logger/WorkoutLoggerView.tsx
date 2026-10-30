import React, { useState, useEffect } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { STARTER_ROUTINES } from '../../../utils/forgeData';
import { ALL_FORGE_EXERCISES } from '../../../utils/forgeExercises';
import { ExerciseLoggerCard } from './ExerciseLoggerCard';
import { RestTimerBar } from './RestTimerBar';
import { AddExerciseModal } from './AddExerciseModal';
import { WorkoutFinishModal } from './WorkoutFinishModal';
import { RoutinePreviewModal } from './RoutinePreviewModal';
import { ExerciseLibraryView } from '../exercises/ExerciseLibraryView';
import { CindyWorkoutView } from '../cindy/CindyWorkoutView';
import { ForgeRoutine } from '../../../types/forge';
import {
  Flame,
  Plus,
  Play,
  Clock,
  Dumbbell,
  Zap,
  ChevronRight,
  Shield,
  Activity,
  Eye,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Props {
  onOpenArmory: () => void;
  onNavigateToTracker?: () => void;
}

export const WorkoutLoggerView: React.FC<Props> = ({ onOpenArmory, onNavigateToTracker }) => {
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

  const [workoutSubTab, setWorkoutSubTab] = useState<'train' | 'cindy' | 'library'>('train');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [finishSummary, setFinishSummary] = useState<{
    volumeKg: number;
    ironEarned: number;
    prCount: number;
  } | null>(null);

  // Preview routine blueprint modal
  const [previewRoutine, setPreviewRoutine] = useState<ForgeRoutine | null>(null);

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
        <div className="p-4 sm:p-5 rounded-3xl bg-[#12141c] border-2 border-orange-500/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
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
            <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-base font-bold text-white">{elapsedFormatted}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2">
              <span className="text-slate-400">Sets:</span>
              <span className="text-base font-bold text-amber-400">{liveCompletedSets}</span>
            </div>

            <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-black/50 border border-white/5 items-center gap-2">
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
      
      {/* Sub-Navigation Pills: Clean 3-way toggle + Monthly Tracker Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14161d] border border-white/5 overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setWorkoutSubTab('train')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              workoutSubTab === 'train'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Train &amp; Routines</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkoutSubTab('cindy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              workoutSubTab === 'cindy'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-orange-400/80 hover:text-orange-300 hover:bg-orange-500/10 border border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Cindy AMRAP (20m)</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkoutSubTab('library')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              workoutSubTab === 'library'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>150+ Exercises</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTracker && (
            <button
              type="button"
              onClick={onNavigateToTracker}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-orange-300 border border-white/5 text-xs font-display font-bold transition cursor-pointer shrink-0"
              title="Open full workout history calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Monthly Tracker ({workouts.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => startWorkout(undefined, 'Freestyle Forge Session')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Freestyle Session</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: TRAIN & ROUTINES BROWSER                                     */}
      {/* ------------------------------------------------------------------ */}
      {workoutSubTab === 'train' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Beginner-Friendly 3-Step Quick Guide */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#14161f] border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-display font-bold uppercase tracking-wider text-orange-300">
                  Beginner Guide • 3 Simple Steps
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">1. Choose a routine</strong> below or tap Freestyle &bull; <strong className="text-white">2. Log your reps &amp; weight</strong> and tap <strong className="text-orange-400 font-mono">✔</strong> after each set &bull; <strong className="text-white">3. Tap Finish</strong> to auto-complete today's Kata habit!
              </p>
            </div>
            {onNavigateToTracker && (
              <button
                type="button"
                onClick={onNavigateToTracker}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-orange-300 hover:text-white border border-white/5 text-xs font-mono flex items-center gap-1.5 transition whitespace-nowrap self-start md:self-auto shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>Past Workouts in Tracker &rarr;</span>
              </button>
            )}
          </div>
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl forge-card p-6 sm:p-8 border-2 border-orange-500/30 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse" />
                  <span>HOME TRAINING CENTER</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                  Choose a Routine or Inspect Exercises
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Click any routine to view its complete exercise lineup, sets, reps, and gear before you start. Every workout completed automatically ticks your Kata habit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => startWorkout(undefined, 'Freestyle Forge Session')}
                className="w-full md:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>START FREESTYLE SESSION</span>
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
              className="text-xs font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Edit Equipment</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Cindy Protocol Spotlight Card */}
          <div
            onClick={() => setWorkoutSubTab('cindy')}
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-red-950/30 to-black/60 border-2 border-orange-500/40 hover:border-orange-500 transition-all cursor-pointer shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-orange-600 text-slate-950 shadow-md shadow-orange-500/30 shrink-0 mt-0.5">
                <Flame className="w-6 h-6 fill-slate-950 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                    20-Min AMRAP Special Chamber
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    CrossFit Benchmark
                  </span>
                </div>
                <h3 className="text-xl font-display font-black text-white group-hover:text-orange-400 transition-colors">
                  The Cindy Protocol (5 Pull-ups • 10 Push-ups • 15 Squats)
                </h3>
                <p className="text-xs font-mono text-slate-300 max-w-xl">
                  Dedicated 20:00 live countdown clock with 1-tap round completion, live pace tracking, and daily score progression logs.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWorkoutSubTab('cindy')}
              className="py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Cindy Timer</span>
            </button>
          </div>

          {/* Starter Routines Grid with Preview Capabilities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <span>Featured Home Routines (Click to Preview)</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Full exercise lineups visible
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STARTER_ROUTINES.map(routine => {
                // Find exercise names for quick glance preview
                const previewExNames = routine.exerciseIds
                  .slice(0, 3)
                  .map(id => ALL_FORGE_EXERCISES.find(e => e.id === id)?.name || id);

                return (
                  <div
                    key={routine.id}
                    className="forge-card p-5 rounded-2xl border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between gap-4 group cursor-pointer"
                    onClick={() => setPreviewRoutine(routine)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold uppercase">
                          {routine.daysPerWeek} Days / Wk
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-orange-400" />
                          <span>Tap to Preview</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-white text-base group-hover:text-orange-400 transition-colors">
                          {routine.name}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          {routine.description}
                        </p>
                      </div>

                      {/* Mini exercise preview tags */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                          Exercises ({routine.exerciseIds.length}):
                        </span>
                        <div className="space-y-1">
                          {previewExNames.map((name, i) => (
                            <div key={i} className="text-xs font-mono text-slate-300 flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                              <span className="truncate">{name}</span>
                            </div>
                          ))}
                          {routine.exerciseIds.length > 3 && (
                            <div className="text-[10px] font-mono text-orange-400 pl-3">
                              +{routine.exerciseIds.length - 3} more movements...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewRoutine(routine);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startWorkout(routine);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Start</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Tracker Quick Portal Card */}
          <div className="p-5 rounded-2xl bg-[#14161f] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                  <span>Workout Calendar &amp; Monthly History</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} logged
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Every past workout session, total volume, and set breakdown is tracked on your calendar.
                </p>
              </div>
            </div>

            {onNavigateToTracker && (
              <button
                type="button"
                onClick={onNavigateToTracker}
                className="py-2.5 px-4 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-300 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Open Monthly Tracker</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: CINDY PROTOCOL (20-MIN AMRAP CHAMBER)                        */}
      {/* ------------------------------------------------------------------ */}
      {workoutSubTab === 'cindy' && (
        <div className="animate-fade-in">
          <CindyWorkoutView />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: 150+ EXERCISE LIBRARY                                        */}
      {/* ------------------------------------------------------------------ */}
      {workoutSubTab === 'library' && (
        <div className="animate-fade-in">
          <ExerciseLibraryView />
        </div>
      )}

      {/* Routine Blueprint Preview Modal */}
      <RoutinePreviewModal
        routine={previewRoutine}
        isOpen={Boolean(previewRoutine)}
        onClose={() => setPreviewRoutine(null)}
        onStart={(r) => startWorkout(r)}
      />

    </div>
  );
};
