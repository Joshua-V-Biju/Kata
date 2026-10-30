import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { INITIAL_EXERCISES } from '../../../utils/forgeData';
import { Exercise, ExerciseCategory } from '../../../types/forge';
import { Search, X, Plus, Dumbbell, ShieldAlert, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExerciseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { equipment, addExerciseToWorkout } = useForgeStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'push', label: 'Push' },
    { key: 'pull', label: 'Pull' },
    { key: 'legs', label: 'Legs' },
    { key: 'core', label: 'Core' },
    { key: 'skills', label: 'Skills' }
  ];

  const filtered = INITIAL_EXERCISES.filter(ex => {
    const matchesCategory = activeCategory === 'all' || ex.category === activeCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0f1118] border-2 border-orange-500/30 shadow-[0_0_50px_rgba(255,102,0,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/5 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-display font-black text-white">
                Add Exercise to Session
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search by exercise or muscle group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCategory(c.key)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition shrink-0 ${
                  activeCategory === c.key
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No exercises match your search.
            </div>
          ) : (
            filtered.map(ex => {
              const hasGear = ex.requiredEquipment.every(eq => equipment.includes(eq));

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelect(ex)}
                  className="p-3 rounded-xl hover:bg-white/5 transition flex items-center justify-between gap-3 cursor-pointer group pt-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                        {ex.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase">
                        {ex.category}
                      </span>
                      {!hasGear && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          <span>Sub available</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>Primary:</span>
                      {ex.primaryMuscles.map(m => (
                        <span key={m} className="text-amber-300 capitalize font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-2 rounded-xl bg-orange-500/10 group-hover:bg-orange-500 text-orange-400 group-hover:text-slate-950 transition shadow"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
