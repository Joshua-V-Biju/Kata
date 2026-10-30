import React, { useState } from 'react';
import { ALL_FORGE_EXERCISES } from '../../../utils/forgeExercises';
import { useForgeStore } from '../../../store/useForgeStore';
import { Exercise, ExerciseCategory, MuscleGroup, EquipmentId } from '../../../types/forge';
import { AVAILABLE_EQUIPMENT } from '../../../utils/forgeData';
import { soundEngine } from '../../../utils/sound';
import {
  Search,
  Filter,
  Plus,
  Dumbbell,
  ShieldCheck,
  ShieldAlert,
  Info,
  Play,
  X
} from 'lucide-react';

export const ExerciseLibraryView: React.FC = () => {
  const { equipment, startWorkout, customExercises } = useForgeStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyOwnedGear, setOnlyOwnedGear] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Combine default and custom exercises
  const allExercises = [...ALL_FORGE_EXERCISES, ...customExercises];

  const categories = [
    { key: 'all', label: 'All Disciplines' },
    { key: 'push', label: 'Push' },
    { key: 'pull', label: 'Pull' },
    { key: 'legs', label: 'Legs' },
    { key: 'core', label: 'Core' },
    { key: 'skills', label: 'Skills' }
  ];

  const filtered = allExercises.filter(ex => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
    const hasEquipment = ex.requiredEquipment.every(eq => equipment.includes(eq));
    const matchesGear = !onlyOwnedGear || hasEquipment;
    return matchesCategory && matchesSearch && matchesGear;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl forge-card border border-orange-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-400" />
            <h1 className="text-2xl font-display font-black text-white">
              Home Exercise Library
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            150+ home-calibrated exercises with hypertrophy form cues, muscle targets, and equipment alternatives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Custom Exercise</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#10121a] border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise or muscle (e.g. chest, pullup, pistol)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Equipment Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyOwnedGear(!onlyOwnedGear)}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 border transition shrink-0 cursor-pointer ${
              onlyOwnedGear
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Only My Gear ({equipment.length})</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition shrink-0 ${
                selectedCategory === c.key
                  ? 'bg-orange-500 text-slate-950 font-bold shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
        <span>Showing {filtered.length} exercises</span>
        {onlyOwnedGear && <span className="text-orange-400">Filtered by your home armory</span>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(ex => {
          const hasGear = ex.requiredEquipment.every(eq => equipment.includes(eq));
          const isExpanded = expandedExerciseId === ex.id;

          return (
            <div
              key={ex.id}
              className={`p-5 rounded-2xl border transition-all forge-card ${
                hasGear ? 'border-white/10 hover:border-orange-500/40' : 'border-white/5 opacity-75'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-display font-black text-white">
                        {ex.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
                        {ex.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                      <span className="text-slate-500">Target:</span>
                      {ex.primaryMuscles.map(m => (
                        <span key={m} className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-semibold capitalize">
                          {m}
                        </span>
                      ))}
                      {ex.secondaryMuscles.map(m => (
                        <span key={m} className="px-1.5 py-0.2 rounded bg-white/5 text-slate-400 capitalize">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startWorkout(undefined, `Focus: ${ex.name}`)}
                    className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-slate-950 transition cursor-pointer shadow"
                    title="Start session with this exercise"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Equipment Status */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  {hasGear ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ready with your gear</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Substitutions available</span>
                    </span>
                  )}
                </div>

                {/* Form Cues Preview */}
                <div className="space-y-1.5 pt-1 border-t border-white/5 text-xs font-mono text-slate-300">
                  <div className="text-[10px] text-orange-400 font-bold uppercase">
                    Key Execution Directives:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                    {ex.formCues.slice(0, isExpanded ? undefined : 2).map((cue, i) => (
                      <li key={i}>{cue}</li>
                    ))}
                  </ul>

                  {ex.formCues.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                      className="text-[10px] text-orange-400 hover:underline pt-0.5 block"
                    >
                      {isExpanded ? 'Show less' : `+${ex.formCues.length - 2} more cues`}
                    </button>
                  )}
                </div>

                {ex.substitutionTips && (
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-amber-300/80">
                    💡 {ex.substitutionTips}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
