import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getTodayStr, getPastDays, getDaysInMonth, getDayOfWeekIndex } from '../../utils/dates';
import { Target, Activity, Flame } from 'lucide-react';

export const MomentumRings: React.FC = () => {
  const { habits, dayLogs, selectedDate } = useKataStore();
  const todayStr = getTodayStr();

  // 1. Monthly Progress: total completions in current month / sum of monthly goals
  const now = new Date();
  const currentMonthDays = getDaysInMonth(now.getFullYear(), now.getMonth());
  let monthCompletionsCount = 0;
  currentMonthDays.forEach(day => {
    if (dayLogs[day]) {
      monthCompletionsCount += dayLogs[day].completedHabitIds.length;
    }
  });

  const totalMonthlyGoal = habits
    .filter(h => !h.archived)
    .reduce((acc, h) => acc + (h.monthlyGoal || 20), 0) || 1;

  const monthlyPercent = Math.min(100, Math.round((monthCompletionsCount / totalMonthlyGoal) * 100));

  // 2. Normalized Progress: today's completion rate
  const currentDayLog = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };
  const dayOfWeek = getDayOfWeekIndex(selectedDate);
  const scheduledToday = habits.filter(h => !h.archived && h.scheduleDays.includes(dayOfWeek));
  const normalizedPercent = scheduledToday.length > 0
    ? Math.min(100, Math.round((scheduledToday.filter(h => currentDayLog.completedHabitIds.includes(h.id)).length / scheduledToday.length) * 100))
    : 100;

  // 3. 3-Day Momentum: average completion of last 3 days
  const last3Days = getPastDays(3, todayStr);
  let threeDayTotalRates = 0;
  last3Days.forEach(dateStr => {
    const log = dayLogs[dateStr] || { date: dateStr, completedHabitIds: [] };
    const dow = getDayOfWeekIndex(dateStr);
    const sched = habits.filter(h => !h.archived && h.scheduleDays.includes(dow));
    const rate = sched.length > 0 ? (sched.filter(h => log.completedHabitIds.includes(h.id)).length / sched.length) : 0;
    threeDayTotalRates += rate;
  });
  const momentumPercent = Math.min(100, Math.round((threeDayTotalRates / 3) * 100));

  const ringItems = [
    {
      title: 'Monthly Progress',
      kanji: '月間達成',
      percentage: monthlyPercent,
      valueText: `${monthCompletionsCount} / ${totalMonthlyGoal}`,
      icon: Target,
      color: '#00f2fe',
      gradientId: 'grad-monthly',
      strokeColors: ['#00f2fe', '#4facfe'],
      glowClass: 'shadow-glow-cyan',
    },
    {
      title: 'Normalized Progress',
      kanji: '本日基準',
      percentage: normalizedPercent,
      valueText: `${scheduledToday.filter(h => currentDayLog.completedHabitIds.includes(h.id)).length} of ${scheduledToday.length} due`,
      icon: Activity,
      color: '#00e5a3',
      gradientId: 'grad-normalized',
      strokeColors: ['#00e5a3', '#10b981'],
      glowClass: 'shadow-glow-mint',
    },
    {
      title: '3-Day Momentum',
      kanji: '三日勢',
      percentage: momentumPercent,
      valueText: `${momentumPercent}% average velocity`,
      icon: Flame,
      color: '#ff6b8b',
      gradientId: 'grad-momentum',
      strokeColors: ['#ff6b8b', '#f43f5e'],
      glowClass: 'shadow-glow-coral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ringItems.map(item => {
        const IconComponent = item.icon;
        const circumference = 2 * Math.PI * 36; // radius 36 = ~226
        const strokeDashoffset = circumference - (circumference * item.percentage) / 100;

        return (
          <div
            key={item.title}
            className="rounded-2xl glass-card p-5 border border-white/5 flex items-center justify-between relative overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div
              className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ backgroundColor: item.color }}
            />

            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg border border-white/10"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-display text-slate-400">
                    {item.kanji}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-2xl font-display font-extrabold text-white">
                  {item.percentage}%
                </span>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {item.valueText}
                </p>
              </div>
            </div>

            {/* Sweep Ring SVG */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
                <defs>
                  <linearGradient id={item.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={item.strokeColors[0]} />
                    <stop offset="100%" stopColor={item.strokeColors[1]} />
                  </linearGradient>
                </defs>
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="6"
                />
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="transparent"
                  stroke={`url(#${item.gradientId})`}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-white">
                  {item.percentage}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
