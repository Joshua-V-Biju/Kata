import React from 'react';
import { ForgeRoutine, Exercise } from '../../../types/forge';
import { ALL_FORGE_EXERCISES } from '../../../utils/forgeExercises';
import { AVAILABLE_EQUIPMENT } from '../../../utils/forgeData';
import { useForgeStore } from '../../../store/useForgeStore';
import {
  X,
  Play,
  Dumbbell,
  Clock,
  Shield,
  Activity,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';

interface Props {
  routine: ForgeRoutine | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (routine: ForgeRoutine) => void;
}

export const RoutinePreviewModal: React.FC<Props> = ({
  routine,
  isOpen,
  onClose,
  onStart
}) => {
  const { equipment } = useForgeStore();

  if (!isOpen || !routine) return null;

  // Resolve exercises for this routine
  const routineExercises: Exercise[] = routine.exerciseIds
    .map(id => ALL_FORGE_EXERCISES.find(e => e.id === id))
    .filter((e): e is Exercise => Boolean(e));

  // Determine which equipment is owned vs missing
  const requiredEquipItems = routine.requiredEquipment.map(eqId => {
    const item = AVAILABLE_EQUIPMENT.find(e => e.id === eqId);
    const isOwned = equipment.includes(eqId);
    return {
      id: eqId,
      name: item?.name || eqId,
      substitutionTip: item?.substitutionTip || '',
      isOwned
    };
  });

  const allGearOwned = requiredEquipItems.every(i => i.isOwned);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1118] border-2 border-orange-500/30 shadow-[0_0_50px_rgba(255,102,0,0.2)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-600/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                ROUTINE BLUEPRINT • 訓練概要
              </span>
              <span className="text-xs font-mono text-slate-400">
                {routine.daysPerWeek} Days / Week
              </span>
            </div>
            <h2 className="text-2xl font-display font-black text-white">
              {routine.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {routine.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/60 border border-white/5 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Exercises</span>
            <span className="text-lg font-black text-white">{routineExercises.length} Movements</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Estimated Time</span>
            <span className="text-lg font-black text-amber-400">35–50 Mins</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Primary Focus</span>
            <span className="text-lg font-black text-orange-400 truncate block">Hypertrophy</span>
          </div>
        </div>

        {/* Equipment Check Bar */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>Equipment Verification</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {requiredEquipItems.map(item => (
              <div
                key={item.id}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  item.isOwned
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                }`}
                title={item.isOwned ? 'Equipped in your Armory' : item.substitutionTip}
              >
                {item.isOwned ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{item.name}</span>
                {!item.isOwned && <span className="text-[10px] opacity-75">(Sub: {item.substitutionTip.slice(0, 24)}...)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Full Exercise List Inside Routine */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-orange-400" />
              <span>Exercise Lineup ({routineExercises.length})</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Prescribed 3–4 sets each
            </span>
          </div>

          <div className="space-y-2.5">
            {routineExercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-white text-sm">
                        {ex.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/40 text-slate-400">
                        {ex.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs font-mono text-slate-400">
                      <span>Targets:</span>
                      {ex.primaryMuscles.map(m => (
                        <span key={m} className="text-orange-300 font-bold capitalize">
                          {m}
                        </span>
                      ))}
                      {ex.secondaryMuscles.length > 0 && (
                        <span className="text-slate-500">
                          + {ex.secondaryMuscles.join(', ')}
                        </span>
                      )}
                    </div>

                    {ex.formCues && ex.formCues.length > 0 && (
                      <div className="text-[11px] font-mono text-slate-400 mt-1 italic">
                        Tip: {ex.formCues[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20 block sm:inline-block">
                    3-4 sets • 8-15 reps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStart(routine);
            }}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START THIS WORKOUT NOW</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
