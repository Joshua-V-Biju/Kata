import React, { useState } from 'react';
import { LoggedExercise } from '../../../types/forge';
import { useForgeStore } from '../../../store/useForgeStore';
import { INITIAL_EXERCISES } from '../../../utils/forgeData';
import { WorkoutSetRow } from './WorkoutSetRow';
import { Plus, Copy, Trash2, Info, Flame, ChevronDown } from 'lucide-react';

interface Props {
  loggedExercise: LoggedExercise;
}

export const ExerciseLoggerCard: React.FC<Props> = ({ loggedExercise }) => {
  const { addSetToExercise, repeatLastSet, removeExerciseFromWorkout } = useForgeStore();
  const [showFormCues, setShowFormCues] = useState(false);

  const exDef = INITIAL_EXERCISES.find(e => e.id === loggedExercise.exerciseId);

  return (
    <div className="forge-card p-4 sm:p-5 rounded-2xl border border-orange-500/20 space-y-4">
      
      {/* Exercise Title & Muscles */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-display font-black text-white tracking-wide">
              {loggedExercise.name}
            </h3>
            {exDef && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
                {exDef.category}
              </span>
            )}
          </div>

          {exDef && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Muscles:</span>
              {exDef.primaryMuscles.map(m => (
                <span key={m} className="px-1.5 py-0.2 rounded bg-white/5 text-amber-300 font-semibold capitalize">
                  {m}
                </span>
              ))}
              {exDef.secondaryMuscles.map(m => (
                <span key={m} className="px-1.5 py-0.2 rounded bg-black/40 text-slate-400 capitalize">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {exDef?.formCues && (
            <button
              type="button"
              onClick={() => setShowFormCues(!showFormCues)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Show Form Cues & Substitution Tips"
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => removeExerciseFromWorkout(loggedExercise.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Remove Exercise"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Cues Dropdown */}
      {showFormCues && exDef && (
        <div className="p-3 rounded-xl bg-black/60 border border-orange-500/20 text-xs space-y-1.5 animate-fade-in font-mono">
          <div className="text-[11px] text-orange-400 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Form &amp; Hypertrophy Directives:</span>
          </div>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
            {exDef.formCues.map((cue, idx) => (
              <li key={idx}>{cue}</li>
            ))}
          </ul>
          {exDef.substitutionTips && (
            <div className="text-[11px] text-amber-300/80 pt-1 border-t border-white/5">
              💡 {exDef.substitutionTips}
            </div>
          )}
        </div>
      )}

      {/* Sets Column Header */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
        <span className="w-12">SET</span>
        <span className="min-w-[85px] text-center">REPS</span>
        <span className="min-w-[75px] text-center">LOAD</span>
        <span className="hidden sm:inline w-20 text-center">TEMPO</span>
        <span className="w-16 text-right">DONE</span>
      </div>

      {/* Set Rows */}
      <div className="space-y-2">
        {loggedExercise.sets.map(set => (
          <WorkoutSetRow
            key={set.id}
            exerciseId={loggedExercise.id}
            set={set}
          />
        ))}
      </div>

      {/* Add Set & Repeat Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => addSetToExercise(loggedExercise.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-orange-500/15 border border-white/5 hover:border-orange-500/30 text-slate-300 hover:text-orange-300 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Set</span>
        </button>

        {loggedExercise.sets.length > 0 && (
          <button
            type="button"
            onClick={() => repeatLastSet(loggedExercise.id)}
            className="py-2 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
            title="Duplicate previous set reps and load"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Repeat Set</span>
          </button>
        )}
      </div>

    </div>
  );
};
