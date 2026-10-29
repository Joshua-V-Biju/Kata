import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { VoltronBlock } from '../../types';
import { getDayShortName } from '../../utils/dates';
import { X, Clock, Zap, Bookmark, Palette, Trash2 } from 'lucide-react';

interface BlockEditModalProps {
  initialBlock?: VoltronBlock | null;
  defaultDayOfWeek?: number;
  onClose: () => void;
}

export const BlockEditModal: React.FC<BlockEditModalProps> = ({
  initialBlock,
  defaultDayOfWeek = 1,
  onClose
}) => {
  const { habits, addTimetableBlock, updateTimetableBlock, deleteTimetableBlock } = useKataStore();

  const [title, setTitle] = useState(initialBlock?.title || '');
  const [dayOfWeek, setDayOfWeek] = useState<number>(initialBlock?.dayOfWeek ?? defaultDayOfWeek);
  const [startTime, setStartTime] = useState(initialBlock?.startTime || '16:00');
  const [endTime, setEndTime] = useState(initialBlock?.endTime || '18:00');
  const [isVoltronSprint, setIsVoltronSprint] = useState<boolean>(initialBlock?.isVoltronSprint || false);
  const [linkedHabitId, setLinkedHabitId] = useState<string>(initialBlock?.linkedHabitId || '');
  const [description, setDescription] = useState(initialBlock?.description || '');
  const [color, setColor] = useState(initialBlock?.color || '#334155');

  const days = [
    { idx: 1, name: 'Monday' },
    { idx: 2, name: 'Tuesday' },
    { idx: 3, name: 'Wednesday' },
    { idx: 4, name: 'Thursday' },
    { idx: 5, name: 'Friday' },
    { idx: 6, name: 'Saturday' },
    { idx: 0, name: 'Sunday' }
  ];

  const presetColors = ['#334155', '#0ea5e9', '#f43f5e', '#a855f7', '#ff6b8b', '#ffb300', '#00e5a3', '#6366f1'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialBlock) {
      updateTimetableBlock({
        ...initialBlock,
        title,
        dayOfWeek,
        startTime,
        endTime,
        isVoltronSprint,
        linkedHabitId: linkedHabitId || undefined,
        description,
        color
      });
    } else {
      addTimetableBlock({
        title,
        dayOfWeek,
        startTime,
        endTime,
        isVoltronSprint,
        linkedHabitId: linkedHabitId || undefined,
        description,
        color
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (initialBlock) {
      deleteTimetableBlock(initialBlock.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#121722] border border-white/10 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-display font-bold text-white mb-4">
          {initialBlock ? 'Edit Timetable Block' : 'Add Timetable Block'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Block Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 2-Hour Voltron Sprint: Code / Art"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Day of Week</label>
            <select
              value={dayOfWeek}
              onChange={e => setDayOfWeek(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition"
            >
              {days.map(d => (
                <option key={d.idx} value={d.idx}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition font-mono"
                required
              />
            </div>
          </div>

          {/* Voltron Sprint Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Is Voltron Sprint?</span>
                <span className="text-[10px] text-slate-400">Enables 2-Hour focus timer & +150 bonus XP</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isVoltronSprint}
              onChange={e => setIsVoltronSprint(e.target.checked)}
              className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
            />
          </div>

          {/* Linked Habit */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Link to Habit (Auto-ticks upon finish)</label>
            <select
              value={linkedHabitId}
              onChange={e => setLinkedHabitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition"
            >
              <option value="">None (Standalone)</option>
              {habits.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.category})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Sprint Objective / Notes</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Master keyframe easing and track mixing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Color Tag</label>
            <div className="flex items-center gap-2">
              {presetColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    color === c ? 'scale-125 border-white shadow' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {initialBlock ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                Save Block
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
