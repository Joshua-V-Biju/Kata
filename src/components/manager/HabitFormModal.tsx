import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Habit, HabitCategory } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { X, Sparkles, Check, Palette } from 'lucide-react';

interface HabitFormModalProps {
  initialHabit?: Habit | null;
  onClose: () => void;
}

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  initialHabit,
  onClose
}) => {
  const { addHabit, editHabit, timetable } = useKataStore();

  const [name, setName] = useState(initialHabit?.name || '');
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || 'Mind');
  const [color, setColor] = useState(initialHabit?.color || '#00f2fe');
  const [icon, setIcon] = useState(initialHabit?.icon || 'Sparkles');
  const [monthlyGoal, setMonthlyGoal] = useState<number>(initialHabit?.monthlyGoal || 20);
  const [scheduleDays, setScheduleDays] = useState<number[]>(initialHabit?.scheduleDays || [0, 1, 2, 3, 4, 5, 6]);
  const [voltronSprintSlot, setVoltronSprintSlot] = useState<string>(initialHabit?.voltronSprintSlot || '');

  const categories: HabitCategory[] = ['Mind', 'Body', 'Craft', 'Lifestyle', 'Finance'];

  const colorPresets = [
    '#00f2fe', // Cyan
    '#ff6b8b', // Coral
    '#00e5a3', // Mint
    '#ffb300', // Amber
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#38bdf8', // Sky
    '#eab308'  // Gold
  ];

  const iconOptions = [
    'Sparkles', 'Film', 'Languages', 'BookOpen', 'Code', 'Cpu', 'Dumbbell', 'Heart',
    'PenTool', 'Gamepad2', 'Moon', 'Coins', 'PiggyBank', 'Zap', 'Target', 'Coffee',
    'CheckCircle2', 'Flame', 'Trophy', 'Award', 'Smile'
  ];

  const daysOfWeek = [
    { idx: 1, label: 'M' },
    { idx: 2, label: 'T' },
    { idx: 3, label: 'W' },
    { idx: 4, label: 'T' },
    { idx: 5, label: 'F' },
    { idx: 6, label: 'S' },
    { idx: 0, label: 'S' }
  ];

  const toggleDay = (idx: number) => {
    if (scheduleDays.includes(idx)) {
      if (scheduleDays.length === 1) return; // Keep at least one
      setScheduleDays(scheduleDays.filter(d => d !== idx));
    } else {
      setScheduleDays([...scheduleDays, idx]);
    }
  };

  const sprintBlocks = timetable.filter(b => b.isVoltronSprint);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialHabit) {
      editHabit(initialHabit.id, {
        name,
        category,
        color,
        icon,
        monthlyGoal,
        scheduleDays,
        voltronSprintSlot: voltronSprintSlot || undefined
      });
    } else {
      addHabit({
        name,
        category,
        color,
        icon,
        monthlyGoal,
        scheduleDays,
        voltronSprintSlot: voltronSprintSlot || undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-[#121722] border border-white/10 shadow-2xl text-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
          {initialHabit ? 'Edit Habit Protocol' : 'Create New Habit • 新規習慣'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Japanese Kanji Drills"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                      : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Icon Selection</label>
            <div className="grid grid-cols-7 gap-2 p-2 rounded-2xl bg-slate-900 border border-white/5 max-h-32 overflow-y-auto">
              {iconOptions.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 scale-110 shadow'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  title={ic}
                >
                  <IconRenderer name={ic} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Neon Accent Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPresets.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl border transition-all ${
                    color === c ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Schedule Days */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Active Scheduled Days</label>
            <div className="flex items-center gap-2">
              {daysOfWeek.map(d => {
                const active = scheduleDays.includes(d.idx);
                return (
                  <button
                    key={d.idx}
                    type="button"
                    onClick={() => toggleDay(d.idx)}
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                      active
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 border border-white/10 text-slate-500 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Goal Target */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Monthly Goal Target (Days/Month): <strong className="text-white font-mono">{monthlyGoal}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="31"
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Link to Voltron Sprint Slot */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Link to Voltron Sprint Block (Auto-ticked on finish)
            </label>
            <select
              value={voltronSprintSlot}
              onChange={e => setVoltronSprintSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition"
            >
              <option value="">None (Independent Habit)</option>
              {sprintBlocks.map(sb => (
                <option key={sb.id} value={sb.id}>
                  {sb.title} ({sb.startTime}–{sb.endTime})
                </option>
              ))}
            </select>
          </div>

          {/* Preview Pill */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Badge Preview:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: `${color}40`, backgroundColor: `${color}15`, color }}>
              <IconRenderer name={icon} size={16} />
              <span className="font-display font-bold text-xs">{name || 'Preview Habit'}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition"
            >
              {initialHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
