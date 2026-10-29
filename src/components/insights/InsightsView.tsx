import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { YearHeatmap } from './YearHeatmap';
import { getDayOfWeekIndex, getDayShortName, getTodayStr, getPastDays } from '../../utils/dates';
import { IconRenderer } from '../common/IconRenderer';
import { TrendingUp, Award, AlertCircle, Calendar, Sparkles, CheckCircle2, Flame } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { habits, dayLogs, userStats } = useKataStore();
  const activeHabits = habits.filter(h => !h.archived);

  // 1. Calculate completion counts for each habit across all days
  const allLogs = Object.values(dayLogs);
  const totalLoggedDays = Math.max(1, allLogs.length);

  const habitPerformance = activeHabits.map(habit => {
    const totalCompletions = allLogs.filter(l => l.completedHabitIds.includes(habit.id)).length;
    const rate = Math.round((totalCompletions / totalLoggedDays) * 100);
    return {
      habit,
      totalCompletions,
      rate
    };
  }).sort((a, b) => b.rate - a.rate);

  const bestHabits = habitPerformance.slice(0, 3);
  const worstHabits = [...habitPerformance].reverse().slice(0, 3);

  // 2. Best weekday analysis
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun=0 to Sat=6
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

  allLogs.forEach(l => {
    const dow = getDayOfWeekIndex(l.date);
    weekdayTotals[dow] += l.completedHabitIds.length;
    weekdayCounts[dow] += 1;
  });

  const weekdayAverages = weekdayTotals.map((tot, idx) => {
    const count = weekdayCounts[idx] || 1;
    return {
      dayIndex: idx,
      name: getDayShortName(idx),
      avg: Number((tot / count).toFixed(1))
    };
  });

  const bestWeekday = [...weekdayAverages].sort((a, b) => b.avg - a.avg)[0];

  return (
    <div className="space-y-6">
      {/* Year Heatmap Component */}
      <YearHeatmap />

      {/* Best & Worst Habits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Habits Card */}
        <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Apex Habits • 最強の習慣
              </h3>
              <p className="text-xs text-slate-400">
                Highest adherence & consistency rates
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {bestHabits.map((item, idx) => (
              <div
                key={item.habit.id}
                className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${item.habit.color}15`,
                      borderColor: `${item.habit.color}35`,
                      color: item.habit.color
                    }}
                  >
                    <IconRenderer name={item.habit.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-display font-bold text-white block truncate">
                      {item.habit.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.totalCompletions} logs • Rank #{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-mono font-extrabold text-emerald-400">
                    {item.rate}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Consistency</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Opportunities / Habits Needing Focus */}
        <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Focus Areas • 改善の余地
              </h3>
              <p className="text-xs text-slate-400">
                Habits primed for reinforcement
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {worstHabits.map((item, idx) => (
              <div
                key={item.habit.id}
                className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${item.habit.color}15`,
                      borderColor: `${item.habit.color}35`,
                      color: item.habit.color
                    }}
                  >
                    <IconRenderer name={item.habit.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-display font-bold text-white block truncate">
                      {item.habit.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.totalCompletions} logs recorded
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-mono font-extrabold text-amber-400">
                    {item.rate}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Adherence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Weekday Rhythm Breakdown */}
      <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Discipline Cadence by Weekday • 曜日のリズム
              </h3>
              <p className="text-xs text-slate-400">
                Average completions per day of the week
              </p>
            </div>
          </div>

          {bestWeekday && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Best Day: <strong>{bestWeekday.name}</strong> ({bestWeekday.avg} habits avg)</span>
            </div>
          )}
        </div>

        {/* Weekday Bars */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {weekdayAverages.map(d => {
            const maxAvg = Math.max(...weekdayAverages.map(w => w.avg), 1);
            const heightPercent = Math.min(100, Math.round((d.avg / maxAvg) * 100));
            const isBest = bestWeekday?.dayIndex === d.dayIndex;

            return (
              <div key={d.dayIndex} className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">
                  {d.avg}
                </span>

                <div className="h-28 w-full max-w-[40px] bg-slate-900 rounded-xl p-1 flex items-end">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isBest
                        ? 'bg-gradient-to-t from-cyan-500 to-teal-400 shadow-[0_0_12px_rgba(0,242,254,0.6)]'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    style={{ height: `${Math.max(8, heightPercent)}%` }}
                  />
                </div>

                <span className={`text-[11px] font-mono ${isBest ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                  {d.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
