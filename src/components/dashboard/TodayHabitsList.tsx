import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getDayOfWeekIndex, getTodayStr, getDaysInMonth, formatDateDisplay } from '../../utils/dates';
import { IconRenderer } from '../common/IconRenderer';
import { Check, Flame, Zap, Plus, Filter } from 'lucide-react';
import { HabitCategory } from '../../types';

interface TodayHabitsListProps {
  onOpenHabitManager: () => void;
  onOpenHabitForm: () => void;
}

export const TodayHabitsList: React.FC<TodayHabitsListProps> = ({
  onOpenHabitManager,
  onOpenHabitForm
}) => {
  const { habits, dayLogs, selectedDate, toggleHabit } = useKataStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const todayStr = getTodayStr();
  const currentLog = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };
  const dayOfWeek = getDayOfWeekIndex(selectedDate);

  // Active scheduled habits for selected day
  const activeHabits = habits
    .filter(h => !h.archived)
    .sort((a, b) => a.order - b.order);

  const categories: (HabitCategory | 'All')[] = ['All', 'Mind', 'Body', 'Craft', 'Lifestyle', 'Finance'];

  // Calculate monthly completions for each habit
  const now = new Date();
  const monthDays = getDaysInMonth(now.getFullYear(), now.getMonth());

  const getMonthlyCount = (habitId: string) => {
    return monthDays.reduce((acc, day) => {
      const log = dayLogs[day];
      return log && log.completedHabitIds.includes(habitId) ? acc + 1 : acc;
    }, 0);
  };

  const filteredHabits = activeHabits.filter(h => {
    if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Past Date Alert Banner if selectedDate is not today */}
      {selectedDate !== todayStr && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>Currently viewing & logging habits for <strong>{formatDateDisplay(selectedDate)}</strong> (Past Date).</span>
          </div>
          <button
            type="button"
            onClick={() => useKataStore.getState().setSelectedDate(todayStr)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
          >
            ← Switch to Today ({formatDateDisplay(todayStr)})
          </button>
        </div>
      )}

      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white flex items-center gap-2">
            {selectedDate === todayStr ? "Today's Habits • 今日の習慣" : `Habits for ${formatDateDisplay(selectedDate)}`}
          </h2>
          <p className="text-xs text-slate-400">
            {selectedDate === todayStr
              ? "Tap any card to check off your habit for today"
              : `Tap any card to update completion for ${formatDateDisplay(selectedDate)}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/5 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Habit Quick Button */}
          <button
            onClick={onOpenHabitForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map((habit, index) => {
          const isDone = currentLog.completedHabitIds.includes(habit.id);
          const isScheduledToday = habit.scheduleDays.includes(dayOfWeek);
          const monthCount = getMonthlyCount(habit.id);
          const goal = habit.monthlyGoal || 20;
          const monthPct = Math.min(100, Math.round((monthCount / goal) * 100));

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id, selectedDate)}
              className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden select-none flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_25px_rgba(0,242,254,0.15)] ring-1 ring-cyan-400/30'
                  : 'glass-card border-white/5 hover:border-white/15'
              }`}
            >
              {/* Anime Left Color Accent Bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
                style={{ backgroundColor: habit.color }}
              />

              {/* Background Glow on Completion */}
              {isDone && (
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: habit.color }}
                />
              )}

              <div>
                {/* Top Row: Icon, Category Pill, Sprint Link Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow"
                      style={{
                        backgroundColor: isDone ? `${habit.color}25` : `${habit.color}15`,
                        borderColor: `${habit.color}40`,
                        color: habit.color
                      }}
                    >
                      <IconRenderer name={habit.icon} size={20} />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                        {habit.category}
                      </span>
                      <h3 className={`text-base font-display font-bold transition-colors line-clamp-1 ${
                        isDone ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {habit.name}
                      </h3>
                    </div>
                  </div>

                  {/* Checkbox Button with Light Burst */}
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.7)] animate-pop'
                        : 'border-white/20 bg-white/5 text-transparent group-hover:border-cyan-400/50 group-hover:text-cyan-400/40'
                    }`}
                  >
                    <Check className={`w-5 h-5 stroke-[3] ${isDone ? 'scale-100' : 'scale-75'}`} />
                  </div>
                </div>

                {/* Voltron Sprint Linked badge if applicable */}
                {habit.voltronSprintSlot && (
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span>Voltron Sprint Linked</span>
                  </div>
                )}
              </div>

              {/* Bottom Progress Row */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-400">
                    Monthly Goal: <strong className="text-slate-200">{monthCount}/{goal}</strong>
                  </span>
                  <span className="font-bold" style={{ color: habit.color }}>
                    {monthPct}%
                  </span>
                </div>

                {/* Mini fluid progress bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${monthPct}%`,
                      backgroundColor: habit.color,
                      boxShadow: isDone ? `0 0 8px ${habit.color}` : 'none'
                    }}
                  />
                </div>

                {/* Due status pill */}
                <div className="flex justify-between items-center text-[10px] pt-0.5">
                  <span className={isScheduledToday ? 'text-cyan-400 font-semibold' : 'text-slate-500'}>
                    {isScheduledToday ? '● Due Today' : '○ Optional'}
                  </span>
                  <span className="text-slate-500 font-mono">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
