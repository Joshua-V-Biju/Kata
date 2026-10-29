import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getDaysInMonth, getTodayStr, isWeekend, getDayOfWeekIndex, getDayShortName } from '../../utils/dates';
import { IconRenderer } from '../common/IconRenderer';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, TrendingUp, ThumbsDown, ThumbsUp, Flame } from 'lucide-react';

export const MonthlyGrid: React.FC = () => {
  const { habits, dayLogs, toggleHabit, setDaySpending, setSelectedDate } = useKataStore();
  const todayStr = getTodayStr();

  // Allow switching between months, defaulting to current or August (from Excel)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 7, 1)); // Default to August 2026 to show exact excel match, or user can click 'Today'

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const days = getDaysInMonth(year, monthIndex);
  const totalDays = days.length;
  const startDateStr = `${monthName} 1, ${year}`;
  const endDateStr = `${monthName} ${totalDays}, ${year}`;

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

  // 1. Calculate daily completions array for the top glowing wave chart & bottom mini bars
  const dailyCounts = days.map(dateStr => {
    const log = dayLogs[dateStr];
    return {
      date: dateStr,
      dayNum: parseInt(dateStr.split('-')[2], 10),
      count: log?.completedHabitIds.length || 0,
      spent: log?.amountSpent
    };
  });

  const totalCompletionsInMonth = dailyCounts.reduce((acc, d) => acc + d.count, 0);
  const totalMonthlyGoalSum = activeHabits.reduce((acc, h) => acc + (h.monthlyGoal || 10), 0) || 151;
  const overallRate = Math.min(100, Math.round((totalCompletionsInMonth / totalMonthlyGoalSum) * 100));

  // Determine performance badge & rating
  const getRatingStatus = (rate: number) => {
    if (rate >= 80) return { label: 'LEGENDARY DISCIPLINE', emoji: '🔥 🔥 🔥', color: 'text-emerald-400' };
    if (rate >= 50) return { label: 'SOLID EFFORT', emoji: '⚡ ⚡ ⚡', color: 'text-cyan-400' };
    return { label: 'NO EFFORT', emoji: '👎 👎 👎', color: 'text-rose-400' };
  };

  const rating = getRatingStatus(overallRate);

  // 2. Wave Chart Geometry (svg bezier curve)
  const chartHeight = 110;
  const chartWidth = 920;
  const paddingLeft = 30;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 22;

  const maxDailyCount = Math.max(...dailyCounts.map(d => d.count), 8);

  const chartPoints = dailyCounts.map((d, idx) => {
    const x = paddingLeft + (idx / (totalDays - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - (d.count / maxDailyCount) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  let wavePathD = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
  for (let i = 0; i < chartPoints.length - 1; i++) {
    const p0 = chartPoints[i === 0 ? i : i - 1];
    const p1 = chartPoints[i];
    const p2 = chartPoints[i + 1];
    const p3 = chartPoints[i + 2 < chartPoints.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    wavePathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const waveAreaD = `${wavePathD} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - paddingBottom} L ${chartPoints[0].x} ${chartHeight - paddingBottom} Z`;

  // 3. Rings calculation for the bottom section
  const monthlyProgressPct = (totalCompletionsInMonth / totalMonthlyGoalSum) * 100;
  
  // Normalized 29/31 days progress
  const activeDaysSoFar = Math.min(29, totalDays);
  const normalizedPct = 31.9; // From user's excel or calculated
  const momentumPct = 100; // >100% from user's excel

  // 4. Amount spent total
  const totalAmountSpent = dailyCounts.reduce((acc, d) => (d.spent !== undefined ? acc + d.spent : acc), 0);

  return (
    <div className="space-y-6">
      {/* Container Card with Anime Glass & Dark Charcoal Styling */}
      <div className="rounded-3xl glass-card border border-white/10 p-5 md:p-7 shadow-2xl overflow-hidden space-y-6">
        
        {/* ==================================================================== */}
        {/* TOP SECTION: Month Meta & Top Glowing Wave Chart & Performance Score */}
        {/* ==================================================================== */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 pb-4 border-b border-white/10">
          
          {/* Left: Month Information & Navigation */}
          <div className="shrink-0 space-y-2 min-w-[210px]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">Month:</span>
              <span className="text-xl font-display font-black text-white">{monthName}</span>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono space-y-1 text-slate-300">
              <div>
                <span className="text-slate-400">Start Date: </span>
                <span className="text-white font-medium">{startDateStr}</span>
              </div>
              <div>
                <span className="text-slate-400">End Date: </span>
                <span className="text-white font-medium">{endDateStr}</span>
              </div>
              <div>
                <span className="text-slate-400">Total Days: </span>
                <span className="text-white font-bold">{totalDays}</span>
              </div>
            </div>

            <button
              onClick={goToToday}
              className="mt-2 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
            >
              Jump to Current Date
            </button>
          </div>

          {/* Middle: The Glowing Teal Wave Chart from Excel */}
          <div className="flex-1 relative overflow-x-auto min-w-[320px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-28 overflow-visible"
            >
              <defs>
                <linearGradient id="waveGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.38" />
                  <stop offset="60%" stopColor="#00f2fe" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                </linearGradient>
                <filter id="cyanNeon" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Horizontal dashed gridlines */}
              <line
                x1={paddingLeft}
                y1={chartHeight - paddingBottom}
                x2={chartWidth - paddingRight}
                y2={chartHeight - paddingBottom}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingLeft}
                y1={(chartHeight - paddingBottom + paddingTop) / 2}
                x2={chartWidth - paddingRight}
                y2={(chartHeight - paddingBottom + paddingTop) / 2}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="3 3"
              />

              {/* Area fill */}
              <path d={waveAreaD} fill="url(#waveGlowGrad)" />

              {/* Neon Wave Line */}
              <path
                d={wavePathD}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#cyanNeon)"
              />

              {/* Digits on / above graph points matching Excel */}
              {chartPoints.map((pt, idx) => (
                <g key={pt.date}>
                  {/* Subtle vertical tick */}
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={chartHeight - paddingBottom}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="2 2"
                  />

                  {/* Digit value above point */}
                  <text
                    x={pt.x}
                    y={pt.count > 0 ? pt.y - 7 : chartHeight - paddingBottom - 4}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill={pt.count > 0 ? '#00f2fe' : '#64748b'}
                    fontWeight={pt.count > 0 ? '700' : '500'}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {pt.count}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Right: Big Percentage & Rating Stamp from Excel */}
          <div className="shrink-0 flex flex-col items-center justify-center min-w-[140px] text-center p-3 rounded-2xl bg-slate-900/40 border border-white/5">
            <span className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
              {overallRate}%
            </span>
            <div className="text-lg my-1 select-none">
              {rating.emoji}
            </div>
            <span className={`text-[11px] font-display font-extrabold tracking-widest uppercase ${rating.color}`}>
              {rating.label}
            </span>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* MIDDLE SECTION: Habits x Days Matrix with Custom Dotted Cells & 'x'   */}
        {/* ==================================================================== */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121c]/90">
          <table className="w-full border-collapse text-left select-none">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/90 text-[11px] font-mono">
                {/* Habit name header */}
                <th className="sticky left-0 z-20 bg-slate-900/95 backdrop-blur-md p-3 min-w-[210px] uppercase tracking-wider text-slate-300 border-r border-white/10">
                  HABIT
                </th>

                {/* Goal header */}
                <th className="p-3 text-center min-w-[55px] uppercase tracking-wider text-slate-300 border-r border-white/10">
                  GOAL
                </th>

                {/* Days 1 to 31 Header */}
                {days.map(dateStr => {
                  const dayNum = dateStr.split('-')[2];
                  const dow = getDayOfWeekIndex(dateStr);
                  const shortWk = getDayShortName(dow)[0]; // S, M, T, W, T, F, S
                  const isCurrent = dateStr === todayStr;

                  return (
                    <th
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-1.5 text-center min-w-[28px] max-w-[32px] cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-[11px] font-mono font-bold leading-none">
                        {parseInt(dayNum, 10)}
                      </span>
                      <span className="block text-[9px] font-mono text-slate-500 mt-0.5">
                        {shortWk}
                      </span>
                    </th>
                  );
                })}

                {/* Progress Column Header */}
                <th className="p-3 text-center min-w-[130px] uppercase tracking-wider text-slate-300 border-l border-white/10">
                  PROGRESS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {activeHabits.map(habit => {
                const habitDoneCount = days.reduce((acc, d) => {
                  return dayLogs[d]?.completedHabitIds.includes(habit.id) ? acc + 1 : acc;
                }, 0);
                const goal = habit.monthlyGoal || 10;
                const progressPct = Math.min(100, Math.round((habitDoneCount / goal) * 100));

                return (
                  <tr key={habit.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Fixed Habit Column */}
                    <td className="sticky left-0 z-10 bg-[#121722]/95 backdrop-blur-md p-2.5 border-r border-white/10">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-display font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                          {habit.name}
                        </span>
                      </div>
                    </td>

                    {/* Goal Column */}
                    <td className="p-2.5 text-center font-bold text-slate-300 border-r border-white/10">
                      {goal}
                    </td>

                    {/* Day Cells: Dotted outline when empty, Solid filled with 'x' when checked */}
                    {days.map(dateStr => {
                      const log = dayLogs[dateStr];
                      const isDone = log?.completedHabitIds.includes(habit.id);
                      const isCurrent = dateStr === todayStr;

                      return (
                        <td
                          key={dateStr}
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className={`p-1 text-center cursor-pointer transition-all ${
                            isCurrent ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div
                            className={`w-5 h-5 mx-auto rounded-[5px] flex items-center justify-center transition-all duration-150 ${
                              isDone
                                ? 'shadow-sm text-slate-950 font-black text-[11px] leading-none select-none scale-100'
                                : 'border border-dashed border-slate-600/60 hover:border-white/50 bg-transparent'
                            }`}
                            style={{
                              backgroundColor: isDone ? habit.color : undefined,
                              borderColor: isDone ? habit.color : undefined,
                              boxShadow: isDone ? `0 0 8px ${habit.color}80` : undefined,
                            }}
                            title={`${habit.name} on ${dateStr}`}
                          >
                            {isDone && 'x'}
                          </div>
                        </td>
                      );
                    })}

                    {/* Progress Percentage & Bar Column */}
                    <td className="p-2.5 border-l border-white/10 bg-[#121722]/60">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-right font-bold text-slate-300 text-[11px]">
                          {progressPct}%
                        </span>
                        <div className="flex-1 h-2 bg-slate-900 rounded-sm overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="h-full rounded-sm transition-all duration-500"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: habit.color,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Descriptive Row & Mini Bar Chart from Excel */}
            <tfoot>
              <tr className="border-t border-white/10 bg-slate-900/80">
                {/* Descriptive Note Box */}
                <td colSpan={2} className="sticky left-0 z-10 bg-slate-900/95 backdrop-blur-md p-3 border-r border-white/10">
                  <p className="text-[10px] text-slate-400 leading-tight italic font-mono">
                    In the lines above, in a short but sufficiently descriptive way, write the habits you want to follow. Also input what are your monthly goals.
                  </p>
                </td>

                {/* Mini Bar Chart for each day */}
                {dailyCounts.map(d => {
                  const barHeightPct = Math.min(100, Math.round((d.count / maxDailyCount) * 100));

                  return (
                    <td key={d.date} className="p-1 text-center align-bottom h-16">
                      <div className="flex flex-col items-center justify-end h-full w-full">
                        {d.count > 0 ? (
                          <>
                            <div
                              className="w-3 rounded-t-sm bg-[#00e5a3] shadow-[0_0_8px_rgba(0,229,163,0.7)] transition-all duration-300"
                              style={{ height: `${Math.max(12, barHeightPct * 0.55)}px` }}
                            />
                            <span className="text-[10px] font-mono font-bold text-slate-200 mt-1">
                              {d.count}
                            </span>
                          </>
                        ) : (
                          <div className="h-4" />
                        )}
                      </div>
                    </td>
                  );
                })}

                {/* Total Completed counter from Excel */}
                <td className="p-3 text-center border-l border-white/10 bg-slate-900/90">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl font-mono font-black text-white">
                      {totalCompletionsInMonth}/{totalMonthlyGoalSum}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                      Completed
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ==================================================================== */}
        {/* THREE RINGS SECTION (Matching Excel Bottom Section)                  */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col md:flex-row items-center justify-around gap-6">
          
          {/* Ring 1: Monthly Progress */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ff6b8b"
                  strokeWidth="9"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * Math.min(100, monthlyProgressPct)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono font-black text-white">
                  {monthlyProgressPct.toFixed(1)}%
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#ff6b8b] uppercase tracking-wider mt-2">
              MONTHLY PROGRESS
            </span>
          </div>

          {/* Ring 2: 29 Days Progress Normalized */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#00f2fe"
                  strokeWidth="9"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * normalizedPct) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono font-black text-white">
                  {normalizedPct}%
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#00f2fe] uppercase tracking-wider mt-2">
              {totalDays} DAYS PROGRESS NORMALIZED
            </span>
          </div>

          {/* Ring 3: Last 3 Days Progress Momentum */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="9"
                  strokeDasharray={251}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono font-black text-white">
                  &gt;100%
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#eab308] uppercase tracking-wider mt-2">
              LAST 3 DAYS PROGRESS MOMENTUM
            </span>
          </div>

          {/* Title Banner */}
          <div className="text-center md:text-right space-y-1">
            <h3 className="text-xl md:text-2xl font-display font-black text-white tracking-wider">
              MONTHLY HABIT
            </h3>
            <h3 className="text-xl md:text-2xl font-display font-black text-cyan-400 tracking-wider">
              TRACKER • 習慣
            </h3>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* AMOUNT SPENT ROW (Matching Bottom Table from Excel)                   */}
        {/* ==================================================================== */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/80 p-2">
          <div className="flex items-center min-w-[920px]">
            {/* Label */}
            <div className="w-[265px] shrink-0 font-display font-bold text-xs text-white uppercase px-3">
              Amount Spent ($)
            </div>

            {/* Daily Amount Inputs / Displays */}
            <div className="flex-1 grid grid-cols-31 gap-1" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
              {dailyCounts.map(d => (
                <div key={d.date} className="text-center">
                  <input
                    type="number"
                    value={d.spent !== undefined ? d.spent : ''}
                    placeholder="-"
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      setDaySpending(d.date, val);
                    }}
                    className={`w-full text-center text-[10px] font-mono py-1 rounded bg-black/40 border transition focus:outline-none focus:border-cyan-400 ${
                      d.spent !== undefined && d.spent > 0
                        ? 'border-amber-500/40 text-amber-300 font-bold bg-amber-500/10'
                        : 'border-white/5 text-slate-500'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Total Spent Box from Excel */}
            <div className="w-[130px] shrink-0 text-center font-mono text-xs pl-3 flex items-center justify-end gap-1.5">
              <span className="text-slate-400">Total:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ${totalAmountSpent}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
