import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getDaysInMonth, getTodayStr, isWeekend, getDayOfWeekIndex, getDayShortName, getDayKanji } from '../../utils/dates';
import { IconRenderer } from '../common/IconRenderer';
import { ChevronLeft, ChevronRight, Calendar, Target, Check, Sparkles } from 'lucide-react';

export const MonthlyGrid: React.FC = () => {
  const { habits, dayLogs, toggleHabit, setSelectedDate } = useKataStore();
  const todayStr = getTodayStr();

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const monthKanji = `${monthIndex + 1}月`;

  const days = getDaysInMonth(year, monthIndex);
  const activeHabits = habits.filter(h => !h.archived).sort((a, b) => a.order - b.order);

  const prevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calculate day completion sums for mini bar chart under each day column
  const dayCompletions = days.map(dateStr => {
    const log = dayLogs[dateStr];
    return {
      date: dateStr,
      count: log?.completedHabitIds.length || 0,
      isToday: dateStr === todayStr,
      isWknd: isWeekend(dateStr)
    };
  });

  const maxDayCompletions = Math.max(...dayCompletions.map(d => d.count), 6);

  return (
    <div className="space-y-6">
      {/* Month Navigator Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-display font-black text-white tracking-tight">
                {monthName} {year}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-display font-bold">
                {monthKanji}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Matrix • {days.length} Days in Cycle • Click any cell to toggle completion
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition"
          >
            Today
          </button>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix Container */}
      <div className="rounded-3xl glass-card border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/70">
                {/* Habit Header Column */}
                <th className="sticky left-0 z-20 bg-slate-900/95 backdrop-blur-md p-4 min-w-[240px] md:min-w-[280px]">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Habit Protocol ({activeHabits.length})
                  </span>
                </th>

                {/* Days Headers */}
                {days.map(dateStr => {
                  const dayNum = dateStr.split('-')[2];
                  const dow = getDayOfWeekIndex(dateStr);
                  const shortName = getDayShortName(dow);
                  const isCurrentDay = dateStr === todayStr;
                  const isWknd = isWeekend(dateStr);

                  return (
                    <th
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-2 text-center min-w-[36px] max-w-[40px] cursor-pointer transition-colors ${
                        isCurrentDay
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : isWknd
                          ? 'bg-white/[0.02] text-slate-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-[10px] font-mono leading-none opacity-60">
                        {shortName[0]}
                      </span>
                      <span className={`block text-xs font-mono mt-0.5 ${
                        isCurrentDay ? 'text-cyan-300 underline font-extrabold' : ''
                      }`}>
                        {dayNum}
                      </span>
                    </th>
                  );
                })}

                {/* Progress Summary Header */}
                <th className="p-4 text-center min-w-[130px] bg-slate-900/95">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Goal Progress
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-sm">
              {activeHabits.map(habit => {
                const habitMonthlyCount = days.reduce((acc, d) => {
                  return dayLogs[d]?.completedHabitIds.includes(habit.id) ? acc + 1 : acc;
                }, 0);
                const goal = habit.monthlyGoal || 20;
                const percent = Math.min(100, Math.round((habitMonthlyCount / goal) * 100));

                return (
                  <tr key={habit.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Fixed Habit Info Column */}
                    <td className="sticky left-0 z-10 bg-[#121722]/95 backdrop-blur-md p-3.5 border-r border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${habit.color}18`,
                            borderColor: `${habit.color}35`,
                            color: habit.color
                          }}
                        >
                          <IconRenderer name={habit.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-display font-bold text-white truncate block group-hover:text-cyan-300 transition-colors">
                            {habit.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {habit.category}
                          </span>
                        </div>
                      </div>

                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                    </td>

                    {/* Day Cells */}
                    {days.map(dateStr => {
                      const log = dayLogs[dateStr];
                      const isCompleted = log?.completedHabitIds.includes(habit.id);
                      const isCurrentDay = dateStr === todayStr;
                      const isWknd = isWeekend(dateStr);

                      return (
                        <td
                          key={dateStr}
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className={`p-1.5 text-center transition-all cursor-pointer ${
                            isCurrentDay ? 'bg-cyan-500/10' : isWknd ? 'bg-white/[0.015]' : ''
                          }`}
                        >
                          <div
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isCompleted
                                ? 'shadow-md scale-100'
                                : 'hover:scale-110 hover:border-white/30 border border-white/5 bg-slate-900/30'
                            }`}
                            style={{
                              backgroundColor: isCompleted ? habit.color : undefined,
                              boxShadow: isCompleted ? `0 0 12px ${habit.color}60` : undefined,
                            }}
                            title={`${habit.name} on ${dateStr}`}
                          >
                            {isCompleted && (
                              <Check className="w-4 h-4 text-slate-950 stroke-[3] animate-pop" />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Progress Bar Column */}
                    <td className="p-3.5 text-center border-l border-white/5 bg-[#121722]/50">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-mono">
                          <span className="text-slate-300 font-bold">{habitMonthlyCount}/{goal}</span>
                          <span style={{ color: habit.color }}>{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: habit.color }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Row: Mini Bar Chart of Daily Completion Volume */}
            <tfoot>
              <tr className="border-t border-white/10 bg-slate-900/90">
                <td className="sticky left-0 z-10 bg-slate-900/95 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                      Daily Completion Volume
                    </span>
                  </div>
                </td>

                {dayCompletions.map(day => {
                  const barHeightPct = Math.min(100, Math.round((day.count / maxDayCompletions) * 100));

                  return (
                    <td key={day.date} className="p-1 text-center align-bottom h-14">
                      <div className="flex flex-col items-center justify-end h-10 w-full group relative">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] font-mono text-cyan-300 pointer-events-none whitespace-nowrap z-30">
                          {day.count} done
                        </div>

                        <div
                          className={`w-3.5 rounded-t transition-all duration-300 ${
                            day.isToday
                              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]'
                              : 'bg-slate-700/80 group-hover:bg-cyan-500/60'
                          }`}
                          style={{ height: `${Math.max(4, barHeightPct)}%` }}
                        />
                        <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                          {day.count}
                        </span>
                      </div>
                    </td>
                  );
                })}

                <td className="p-4 text-center font-mono text-xs text-cyan-300 font-bold">
                  {dayCompletions.reduce((a, b) => a + b.count, 0)} Total
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
