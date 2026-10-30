import React, { useState } from 'react';
import { SetType, WorkoutSet } from '../../../types/forge';
import { useForgeStore } from '../../../store/useForgeStore';
import { Check, Trash2, ChevronDown, Plus, Minus } from 'lucide-react';

interface Props {
  exerciseId: string;
  set: WorkoutSet;
}

export const WorkoutSetRow: React.FC<Props> = ({ exerciseId, set }) => {
  const { updateSet, completeSet, removeSet } = useForgeStore();
  const [showDetails, setShowDetails] = useState(false);

  const cycleType = () => {
    const types: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    const nextIdx = (types.indexOf(set.type) + 1) % types.length;
    updateSet(exerciseId, set.id, { type: types[nextIdx] });
  };

  const getTypeBadge = (type: SetType) => {
    switch (type) {
      case 'warmup':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">W</span>;
      case 'drop':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">D</span>;
      case 'failure':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300">F</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400">1</span>;
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        set.completed
          ? 'bg-orange-950/20 border-orange-500/40'
          : 'bg-black/30 border-white/5 hover:border-white/10'
      }`}
    >
      <div className="p-2 sm:p-2.5 flex items-center justify-between gap-2 text-xs">
        
        {/* Set Number & Type */}
        <div className="flex items-center gap-1.5 min-w-[55px]">
          <span className="font-mono font-bold text-slate-400 w-4 text-center">
            {set.setNumber}
          </span>
          <button
            type="button"
            onClick={cycleType}
            className="hover:scale-105 transition cursor-pointer"
            title="Click to cycle: Normal / Warmup / Drop / Failure"
          >
            {getTypeBadge(set.type)}
          </button>
        </div>

        {/* Reps */}
        <div className="flex items-center gap-1 min-w-[85px]">
          <button
            type="button"
            onClick={() => updateSet(exerciseId, set.id, { reps: Math.max(1, set.reps - 1) })}
            className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={set.reps}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) updateSet(exerciseId, set.id, { reps: val });
            }}
            className="w-10 text-center font-mono font-bold text-white bg-black/40 rounded py-1 border border-white/5 focus:outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={() => updateSet(exerciseId, set.id, { reps: set.reps + 1 })}
            className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold"
          >
            +
          </button>
          <span className="text-[10px] text-slate-500 font-mono">reps</span>
        </div>

        {/* Added Load / Weight (kg or backpack) */}
        <div className="flex items-center gap-1 min-w-[75px]">
          <input
            type="number"
            min="0"
            step="0.5"
            value={set.weightKg}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) updateSet(exerciseId, set.id, { weightKg: val });
            }}
            className="w-12 text-center font-mono font-bold text-white bg-black/40 rounded py-1 border border-white/5 focus:outline-none focus:border-orange-500"
          />
          <span className="text-[10px] text-slate-500 font-mono">kg</span>
        </div>

        {/* Quick Tempo & RPE preview */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition"
          title="Adjust Tempo & RPE"
        >
          <span>{set.tempo === 'Standard' ? 'Tempo' : set.tempo}</span>
          <span className="text-orange-400">@{set.rpe}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Actions: Complete Checkmark & Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => completeSet(exerciseId, set.id)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              set.completed
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-slate-950 shadow-[0_0_12px_rgba(255,102,0,0.6)] scale-105'
                : 'bg-white/5 border border-white/15 text-slate-400 hover:border-orange-500/50 hover:text-white'
            }`}
            title={set.completed ? 'Set completed' : 'Mark set done'}
          >
            <Check className={`w-4 h-4 ${set.completed ? 'stroke-[3]' : 'stroke-[2]'}`} />
          </button>

          <button
            type="button"
            onClick={() => removeSet(exerciseId, set.id)}
            className="p-1 text-slate-500 hover:text-rose-400 transition"
            title="Delete Set"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Expanded details: Tempo & RPE options */}
      {showDetails && (
        <div className="p-2.5 pt-0 border-t border-white/5 mt-1 flex flex-wrap items-center gap-3 text-xs bg-black/40 rounded-b-xl animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400">Tempo:</span>
            {['Standard', '3-1-1-0', 'Pause 2s', 'Slow 4s'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => updateSet(exerciseId, set.id, { tempo: t })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  set.tempo === t
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400">RPE:</span>
            {[7, 8, 8.5, 9, 10].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => updateSet(exerciseId, set.id, { rpe: r })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  set.rpe === r
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                @{r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
