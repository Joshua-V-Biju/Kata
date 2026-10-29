import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { formatDateDisplay } from '../../utils/dates';
import { Calendar, Sparkles, Flame, Trophy } from 'lucide-react';

export const YearHeatmap: React.FC = () => {
  const { dayLogs, userStats } = useKataStore();
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // Generate 52 weeks (364 days) leading up to today
  const today = new Date();
  const days: { date: string; count: number; level: number }[] = [];

  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    const count = dayLogs[key]?.completedHabitIds.length || 0;

    let level = 0;
    if (count >= 8) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    days.push({ date: key, count, level });
  }

  // Group by weeks (columns of 7 days: Sun=0 to Sat=6)
  const weeks: { date: string; count: number; level: number }[][] = [];
  let currentWeek: { date: string; count: number; level: number }[] = [];

  // Pad the first week if necessary
  const firstDayOfWeek = new Date(days[0].date).getDay();
  for (let p = 0; p < firstDayOfWeek; p++) {
    currentWeek.push({ date: '', count: 0, level: -1 });
  }

  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0, level: -1 });
    }
    weeks.push(currentWeek);
  }

  const getCellColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#ff6b8b] shadow-[0_0_8px_rgba(255,107,139,0.7)]'; // Fiery Coral
      case 3:
        return 'bg-[#00e5a3] shadow-[0_0_6px_rgba(0,229,163,0.6)]'; // Mint
      case 2:
        return 'bg-[#00f2fe] shadow-[0_0_5px_rgba(0,242,254,0.5)]'; // Neon Cyan
      case 1:
        return 'bg-cyan-900/60 border border-cyan-500/20'; // Soft subtle cyan
      default:
        return 'bg-slate-900/40 border border-white/5';
    }
  };

  const activeDaysCount = Object.values(dayLogs).filter(l => l.completedHabitIds.length > 0).length;

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
      {/* Anime Background Watermark */}
      <div className="absolute -right-4 -bottom-6 text-8xl font-display font-black text-white/[0.015] select-none pointer-events-none">
        鍛錬年輪
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              Annual Discipline Heatmap • 鍛錬の年輪
            </h2>
            <p className="text-xs text-slate-400">
              365-day consistency density & habit mastery momentum
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded bg-cyan-900/60" />
          <div className="w-2.5 h-2.5 rounded bg-[#00f2fe]" />
          <div className="w-2.5 h-2.5 rounded bg-[#00e5a3]" />
          <div className="w-2.5 h-2.5 rounded bg-[#ff6b8b]" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative overflow-x-auto pb-2">
        <div className="inline-flex gap-1">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 pr-2 py-0.5 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Week columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => {
                if (day.level === -1) {
                  return <div key={dIdx} className="w-3 h-3 rounded-sm opacity-0" />;
                }

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3 h-3 rounded-sm transition-all duration-150 cursor-pointer hover:scale-125 hover:z-10 ${getCellColor(
                      day.level
                    )}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <div className="absolute top-0 right-4 px-3 py-1 rounded-xl bg-slate-900/95 border border-cyan-400/40 text-xs shadow-xl pointer-events-none flex items-center gap-2 animate-pop z-20">
            <span className="text-cyan-300 font-semibold">{formatDateDisplay(hoveredDay.date)}:</span>
            <span className="text-white font-mono font-bold">{hoveredDay.count} completions</span>
          </div>
        )}
      </div>

      {/* Summary Stats Row */}
      <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Active Logged Days</span>
          <span className="font-mono text-white font-bold text-sm">{activeDaysCount} Days</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Current Streak</span>
          <span className="font-mono text-amber-400 font-bold text-sm flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            {userStats.currentStreak} Days
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Longest Streak</span>
          <span className="font-mono text-cyan-400 font-bold text-sm flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            {userStats.longestStreak} Days
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Total Checkmarks</span>
          <span className="font-mono text-emerald-400 font-bold text-sm">{userStats.totalCompletions}</span>
        </div>
      </div>
    </div>
  );
};
