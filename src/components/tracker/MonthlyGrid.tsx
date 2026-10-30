import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Habit } from '../../types';
import { getDaysInMonth, getTodayStr, isWeekend, getDayOfWeekIndex, getDayShortName } from '../../utils/dates';
import { ChevronLeft, ChevronRight, DollarSign, Check, X, Target, Edit3 } from 'lucide-react';

export const MonthlyGrid: React.FC = () => {
  const { habits, dayLogs, toggleHabit, editHabit, setDaySpending, setSelectedDate, addToast } = useKataStore();
  const todayStr = getTodayStr();

  // Default to current active month dynamically
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const days = getDaysInMonth(year, monthIndex);
  const totalDays = days.length;
  const startDateStr = `${monthName} 1, ${year}`;
  const endDateStr = `${monthName} ${totalDays}, ${year}`;

  const activeHabits = habits.filter(h => !h.archived).sort((a, b) => a.order - b.order);

  // Interactive Goal Target Popover State (No up/down arrows!)
  const [editingGoalHabit, setEditingGoalHabit] = useState<Habit | null>(null);
  const [goalInputValue, setGoalInputValue] = useState<string>('');

  // Spendings Quick Editor State
  const [selectedSpendDay, setSelectedSpendDay] = useState<number>(12);
  const [spendAmountInput, setSpendAmountInput] = useState<string>('30');

  const prevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 1. Calculate daily completions array for top glowing wave chart & bottom mini bars
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

  const getRatingStatus = (rate: number) => {
    if (rate >= 80) return { label: 'LEGENDARY DISCIPLINE', emoji: '🔥 🔥 🔥', color: 'text-emerald-400' };
    if (rate >= 50) return { label: 'SOLID EFFORT', emoji: '⚡ ⚡ ⚡', color: 'text-cyan-400' };
    return { label: 'NO EFFORT', emoji: '👎 👎 👎', color: 'text-rose-400' };
  };

  const rating = getRatingStatus(overallRate);

  // 2. Wave Chart Geometry (svg bezier curve)
  const chartHeight = 110;
  const chartWidth = 940;
  const paddingLeft = 32;
  const paddingRight = 32;
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

  // 3. Rings calculation
  const monthlyProgressPct = (totalCompletionsInMonth / totalMonthlyGoalSum) * 100;
  const normalizedPct = 31.9;

  // 4. Amount spent calculations
  const totalAmountSpent = dailyCounts.reduce((acc, d) => (d.spent !== undefined ? acc + d.spent : acc), 0);
  const daysWithSpending = dailyCounts.filter(d => d.spent !== undefined && d.spent > 0);

  // Open Goal Popover
  const handleOpenGoalEditor = (habit: Habit) => {
    setEditingGoalHabit(habit);
    setGoalInputValue(String(habit.monthlyGoal || 10));
  };

  // Save Goal Target
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoalHabit) return;
    const num = parseInt(goalInputValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 31) {
      editHabit(editingGoalHabit.id, { monthlyGoal: num });
      addToast('Goal Target Updated', `${editingGoalHabit.name} target set to ${num} days/month`, 'success');
      setEditingGoalHabit(null);
    }
  };

  // Handle saving spending from the clear entry bar
  const handleSaveSelectedSpend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const dayStr = String(selectedSpendDay).padStart(2, '0');
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const dateKey = `${year}-${mStr}-${dayStr}`;
    const amount = spendAmountInput.trim() === '' ? undefined : parseFloat(spendAmountInput);
    setDaySpending(dateKey, amount);
    addToast('Spending Recorded', `Day ${selectedSpendDay}: $${amount || 0} updated`, 'info');
  };

  const handlePickSpendDay = (dayNum: number) => {
    setSelectedSpendDay(dayNum);
    const dayStr = String(dayNum).padStart(2, '0');
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const dateKey = `${year}-${mStr}-${dayStr}`;
    const existing = dayLogs[dateKey]?.amountSpent;
    setSpendAmountInput(existing !== undefined ? String(existing) : '');
  };

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
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
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
              {chartPoints.map((pt) => (
                <g key={pt.date}>
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={chartHeight - paddingBottom}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="2 2"
                  />
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
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121c]/95 shadow-inner">
          <table className="w-full border-collapse text-left select-none table-fixed min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/95 text-[11px] font-mono">
                {/* Habit name header - Fixed width */}
                <th className="sticky left-0 z-30 bg-[#0e1320] p-3 w-52 min-w-[210px] max-w-[210px] uppercase tracking-wider text-slate-300 border-r-2 border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.5)]">
                  HABIT
                </th>

                {/* Goal header - Click to edit target */}
                <th className="p-3 text-center w-20 min-w-[75px] max-w-[75px] uppercase tracking-wider text-cyan-300 border-r border-white/10" title="Click any goal number to edit target without arrow spinners">
                  GOAL ✎
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
                      className={`p-1.5 text-center w-8 min-w-[32px] max-w-[34px] cursor-pointer transition-colors ${
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
                <th className="p-3 text-center w-36 min-w-[140px] uppercase tracking-wider text-slate-300 border-l border-white/10">
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
                    {/* Fixed Habit Column - Strictly pinned to left */}
                    <td className="sticky left-0 z-20 bg-[#0e1320] p-2.5 w-52 min-w-[210px] max-w-[210px] border-r-2 border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-display font-semibold text-slate-200 group-hover:text-white transition-colors truncate text-xs" title={habit.name}>
                          {habit.name}
                        </span>
                      </div>
                    </td>

                    {/* Goal Column - Clean click-to-edit badge WITHOUT any up/down arrows! */}
                    <td className="p-1.5 text-center w-20 min-w-[75px] max-w-[75px] border-r border-white/10 bg-slate-900/30">
                      <button
                        type="button"
                        onClick={() => handleOpenGoalEditor(habit)}
                        className="w-11 py-1 px-1 rounded-lg bg-black/40 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 font-mono text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1 mx-auto group/btn shadow-sm"
                        title={`Click to edit monthly goal for ${habit.name}`}
                      >
                        <span>{goal}</span>
                        <Edit3 className="w-2.5 h-2.5 text-slate-500 group-hover/btn:text-cyan-400" />
                      </button>
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
                          className={`p-1 text-center w-8 min-w-[32px] max-w-[34px] cursor-pointer transition-all ${
                            isCurrent ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div
                            className={`w-5 h-5 mx-auto rounded-[5px] flex items-center justify-center transition-all duration-150 ${
                              isDone
                                ? 'shadow-sm text-slate-950 font-black text-[11px] leading-none select-none scale-100'
                                : 'border border-dashed border-slate-600/70 hover:border-white/50 bg-transparent'
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
                    <td className="p-2.5 w-36 min-w-[140px] border-l border-white/10 bg-[#121722]/60">
                      <div className="flex items-center gap-2">
                        <span className="w-9 text-right font-bold text-slate-300 text-[11px]">
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

              {/* Exact Amount Spent Row Aligned Directly into Table Matrix */}
              <tr className="border-t-2 border-white/10 bg-slate-950 text-xs">
                <td className="sticky left-0 z-20 bg-[#090d14] p-2.5 w-52 min-w-[210px] max-w-[210px] border-r-2 border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.5)] font-display font-bold text-slate-200">
                  <div className="flex items-center gap-2 text-amber-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Amount Spent ($)</span>
                  </div>
                </td>

                <td className="p-2 text-center font-mono text-[10px] text-slate-500 border-r border-white/10">
                  Daily
                </td>

                {/* Day-by-Day Spent Values aligned under each day */}
                {dailyCounts.map(d => {
                  const hasSpent = d.spent !== undefined && d.spent > 0;
                  const isSelected = selectedSpendDay === d.dayNum;

                  return (
                    <td
                      key={d.date}
                      onClick={() => handlePickSpendDay(d.dayNum)}
                      className={`p-1 text-center w-8 min-w-[32px] max-w-[34px] cursor-pointer transition-all ${
                        isSelected ? 'bg-amber-500/20 ring-1 ring-amber-400' : ''
                      }`}
                      title={`Day ${d.dayNum}: $${d.spent !== undefined ? d.spent : 0}. Click to edit.`}
                    >
                      <div className={`text-[10px] font-mono font-bold rounded py-0.5 ${
                        hasSpent
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : d.spent === 0
                          ? 'text-slate-400 bg-black/20'
                          : 'text-slate-600'
                      }`}>
                        {d.spent !== undefined ? d.spent : '-'}
                      </div>
                    </td>
                  );
                })}

                {/* Total Column */}
                <td className="p-2 text-center border-l border-white/10 bg-slate-900 font-mono font-bold text-amber-400">
                  ${totalAmountSpent}
                </td>
              </tr>
            </tbody>

            {/* Bottom Descriptive Row & Mini Bar Chart from Excel */}
            <tfoot>
              <tr className="border-t border-white/10 bg-slate-900/80">
                {/* Descriptive Note Box */}
                <td colSpan={2} className="sticky left-0 z-20 bg-[#0e1320] p-3 border-r-2 border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.5)]">
                  <p className="text-[10px] text-slate-400 leading-tight italic font-mono">
                    In the lines above, in a short but sufficiently descriptive way, write the habits you want to follow. Edit monthly goals anytime in the GOAL column.
                  </p>
                </td>

                {/* Mini Bar Chart for each day */}
                {dailyCounts.map(d => {
                  const barHeightPct = Math.min(100, Math.round((d.count / maxDailyCount) * 100));

                  return (
                    <td key={d.date} className="p-1 text-center align-bottom h-16 w-8 min-w-[32px] max-w-[34px]">
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
                <td className="p-3 text-center border-l border-white/10 bg-slate-900/90 w-36 min-w-[140px]">
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
        {/* CLEAR SPENDINGS FORGE & QUICK ENTRY BAR                              */}
        {/* ==================================================================== */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/60 border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  Daily Spendings Forge • 支出管理
                </h4>
                <p className="text-xs text-slate-400">
                  Click any day in the table above or select below to record daily spending clearly
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-slate-300">
                Total Outflow: <strong className="text-amber-400 font-bold">${totalAmountSpent.toFixed(2)}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-slate-300">
                Daily Budget: <strong className="text-emerald-400 font-bold">$25.00</strong>
              </div>
            </div>
          </div>

          {/* Clean Input Controls */}
          <form onSubmit={handleSaveSelectedSpend} className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-slate-400 font-semibold">Select Day:</label>
              <select
                value={selectedSpendDay}
                onChange={(e) => handlePickSpendDay(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              >
                {days.map((d, i) => (
                  <option key={d} value={i + 1}>
                    Day {i + 1} ({monthName.slice(0, 3)} {i + 1})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <label className="text-xs font-mono text-slate-400 font-semibold">Amount Spent:</label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={spendAmountInput}
                  onChange={(e) => setSpendAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick amount presets */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSpendAmountInput('0')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
              >
                $0
              </button>
              <button
                type="button"
                onClick={() => setSpendAmountInput('10')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
              >
                $10
              </button>
              <button
                type="button"
                onClick={() => setSpendAmountInput('25')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
              >
                $25
              </button>
              <button
                type="button"
                onClick={() => setSpendAmountInput('50')}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
              >
                $50
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Spending</span>
            </button>
          </form>

          {/* Quick Timeline of Logged Days matching October exact image */}
          {daysWithSpending.length > 0 && (
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Logged Days:</span>
              {daysWithSpending.map(item => (
                <button
                  key={item.date}
                  onClick={() => handlePickSpendDay(item.dayNum)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition ${
                    selectedSpendDay === item.dayNum
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow'
                      : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className="text-slate-400">{monthName.slice(0, 3)} {item.dayNum}:</span>
                  <span className="font-bold text-amber-400">${item.spent}</span>
                </button>
              ))}
            </div>
          )}
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

      </div>

      {/* ==================================================================== */}
      {/* INTERACTIVE GOAL POPUP MODAL (NO SPINNER ARROWS!)                    */}
      {/* ==================================================================== */}
      {editingGoalHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#121722] border-2 border-cyan-400/50 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setEditingGoalHabit(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Target className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                EDIT MONTHLY TARGET
              </span>
              <h3 className="text-lg font-display font-bold text-white mt-0.5">
                {editingGoalHabit.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How many days per month do you aim to complete this habit?
              </p>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 pt-2">
              {/* Clean text input with NO spinner arrows */}
              <div className="relative max-w-[140px] mx-auto">
                <input
                  type="text"
                  pattern="[0-9]*"
                  autoFocus
                  value={goalInputValue}
                  onChange={(e) => setGoalInputValue(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="20"
                  className="w-full text-center text-3xl font-mono font-black py-2.5 px-3 rounded-2xl bg-black border-2 border-cyan-400 text-white focus:outline-none shadow-[0_0_15px_rgba(0,242,254,0.3)] tracking-wider"
                />
                <span className="block text-[10px] font-mono text-slate-500 mt-1">
                  Days / Month (1–31)
                </span>
              </div>

              {/* Quick preset chips */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {['5', '10', '15', '20', '25'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setGoalInputValue(val)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-xs font-mono font-semibold transition border border-white/5"
                  >
                    {val}d
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGoalHabit(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
