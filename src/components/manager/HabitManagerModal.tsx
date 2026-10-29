import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Habit } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { HabitFormModal } from './HabitFormModal';
import { X, Plus, Edit2, ArrowUp, ArrowDown, Archive, Trash2, CheckCircle2 } from 'lucide-react';

interface HabitManagerModalProps {
  onClose: () => void;
}

export const HabitManagerModal: React.FC<HabitManagerModalProps> = ({ onClose }) => {
  const { habits, editHabit, deleteHabit, reorderHabit } = useKataStore();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const activeHabits = habits.filter(h => !h.archived).sort((a, b) => a.order - b.order);
  const archivedHabits = habits.filter(h => h.archived);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl p-6 md:p-8 rounded-3xl bg-[#121722] border border-white/10 shadow-2xl text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-black text-white">
              Habit Protocol Manager • 習慣管理
            </h2>
            <p className="text-xs text-slate-400">
              Customize, reorder, edit, recolor or archive your habits
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>

        {/* Active Habits List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {activeHabits.map((habit, index) => (
            <div
              key={habit.id}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-3 hover:border-white/15 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${habit.color}15`,
                    borderColor: `${habit.color}35`,
                    color: habit.color
                  }}
                >
                  <IconRenderer name={habit.icon} size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-display font-bold text-white block truncate">
                    {habit.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>{habit.category}</span>
                    <span>•</span>
                    <span>Goal: {habit.monthlyGoal}d/mo</span>
                    {habit.voltronSprintSlot && (
                      <span className="text-purple-400">• Sprint linked</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Reorder Up */}
                <button
                  disabled={index === 0}
                  onClick={() => reorderHabit(habit.id, 'up')}
                  className={`p-1.5 rounded-lg transition ${
                    index === 0 ? 'text-slate-600' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Reorder Down */}
                <button
                  disabled={index === activeHabits.length - 1}
                  onClick={() => reorderHabit(habit.id, 'down')}
                  className={`p-1.5 rounded-lg transition ${
                    index === activeHabits.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => setEditingHabit(habit)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition"
                  title="Edit Habit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Archive */}
                <button
                  onClick={() => editHabit(habit.id, { archived: true })}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition"
                  title="Archive Habit"
                >
                  <Archive className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm(`Delete "${habit.name}"?`)) {
                      deleteHabit(habit.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Archived Section if any */}
        {archivedHabits.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Archived Habits ({archivedHabits.length})
            </h3>
            <div className="space-y-2">
              {archivedHabits.map(h => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-900/30 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 line-through">{h.name}</span>
                  <button
                    onClick={() => editHabit(h.id, { archived: false })}
                    className="text-cyan-400 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
          >
            Close Manager
          </button>
        </div>
      </div>

      {/* Habit Create / Edit Form Modal */}
      {(isCreating || editingHabit) && (
        <HabitFormModal
          initialHabit={editingHabit}
          onClose={() => {
            setIsCreating(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
};
