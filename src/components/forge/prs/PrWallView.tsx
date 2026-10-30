import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { Trophy, TrendingUp, Zap, Flame, Award, Dumbbell } from 'lucide-react';

export const PrWallView: React.FC = () => {
  const { workouts } = useForgeStore();

  // Aggregate personal records across all workouts
  interface ExerciseRecord {
    exerciseName: string;
    maxReps: number;
    maxWeightKg: number;
    maxSetVolume: number;
    date: string;
    totalSetsPerformed: number;
  }

  const recordsMap: Record<string, ExerciseRecord> = {};

  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      if (!recordsMap[ex.name]) {
        recordsMap[ex.name] = {
          exerciseName: ex.name,
          maxReps: 0,
          maxWeightKg: 0,
          maxSetVolume: 0,
          date: w.startedAt,
          totalSetsPerformed: 0
        };
      }

      ex.sets.forEach(s => {
        if (s.completed || s.reps > 0) {
          recordsMap[ex.name].totalSetsPerformed++;
          if (s.reps > recordsMap[ex.name].maxReps) {
            recordsMap[ex.name].maxReps = s.reps;
            recordsMap[ex.name].date = w.startedAt;
          }
          if (s.weightKg > recordsMap[ex.name].maxWeightKg) {
            recordsMap[ex.name].maxWeightKg = s.weightKg;
          }
          const vol = s.reps * (s.weightKg > 0 ? s.weightKg : 50);
          if (vol > recordsMap[ex.name].maxSetVolume) {
            recordsMap[ex.name].maxSetVolume = vol;
          }
        }
      });
    });
  });

  const recordsList = Object.values(recordsMap);
  const [selectedExName, setSelectedExName] = useState<string>(
    recordsList[0]?.exerciseName || 'Standard Push-up'
  );

  // Compile history for selected exercise
  const exerciseHistory: { date: string; reps: number; weight: number; volume: number }[] = [];
  workouts.forEach(w => {
    const found = w.exercises.find(e => e.name === selectedExName);
    if (found) {
      found.sets.forEach(s => {
        if (s.completed || s.reps > 0) {
          exerciseHistory.push({
            date: new Date(w.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            reps: s.reps,
            weight: s.weightKg,
            volume: s.reps * (s.weightKg > 0 ? s.weightKg : 50)
          });
        }
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            PR VAULT • 最高記録
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Personal Records &amp; Strength Trajectory
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Track peak single-set volume, repetition milestones, and added pack weight over time.
        </p>
      </div>

      {/* PR Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-400" />
          <span>Active All-Time Best Marks</span>
        </h2>

        {recordsList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs rounded-2xl bg-black/40 border border-white/5">
            No PRs logged yet. Finish a session in the workout logger to populate records.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordsList.map(rec => {
              const isSelected = selectedExName === rec.exerciseName;

              return (
                <div
                  key={rec.exerciseName}
                  onClick={() => setSelectedExName(rec.exerciseName)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer forge-card ${
                    isSelected
                      ? 'border-orange-500/60 shadow-[0_0_20px_rgba(255,102,0,0.2)] ring-1 ring-orange-500/40'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-black text-white text-base">
                        {rec.exerciseName}
                      </h3>
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Max Reps</span>
                        <span className="text-base font-bold text-orange-400">{rec.maxReps} reps</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase block">Max Load</span>
                        <span className="text-base font-bold text-amber-300">
                          {rec.maxWeightKg > 0 ? `+${rec.maxWeightKg} kg` : 'Bodyweight'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span>{rec.totalSetsPerformed} total sets</span>
                      <span className="text-orange-400 font-bold">Top: {rec.maxSetVolume}kg vol</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exercise Trajectory Detail */}
      {selectedExName && exerciseHistory.length > 0 && (
        <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">
                TRAJECTORY HISTORY
              </span>
              <h3 className="text-lg font-display font-black text-white">
                {selectedExName}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {exerciseHistory.length} logged sets recorded
            </span>
          </div>

          <div className="space-y-2">
            {exerciseHistory.slice(0, 8).map((h, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-slate-400">{h.date}</span>
                <span className="text-white font-bold">{h.reps} reps</span>
                <span className="text-amber-300">
                  {h.weight > 0 ? `+${h.weight}kg load` : 'Bodyweight'}
                </span>
                <span className="text-orange-400 font-bold">{h.volume} kg volume</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
