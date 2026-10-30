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
        // Peak discipline: The greenest and brightest with intense neon aura!
        return 'bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.95)] ring-1 ring-white/60';
      case 3:
        // Strong consistency: Rich vibrant emerald green
        return 'bg-[#10b981] shadow-[0_0_7px_rgba(16,185,129,0.7)]';
      case 2:
        // Moderate activity: Warm glowing orange/amber
        return 'bg-[#fb923c] shadow-[0_0_6px_rgba(251,146,60,0.65)]';
      case 1:
        // Lesser activity: The reddest! Vivid fiery crimson red with radiant glow
        return 'bg-[#ff2b4e] shadow-[0_0_8px_rgba(255,43,78,0.85)] border border-rose-400/40';
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
          <div className="flex items-center gap-1 mr-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-white/10" title="0 completions (None)" />
            <span className="text-[10px] text-slate-500 font-mono">0</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-semibold text-rose-400">Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#ff2b4e] shadow-[0_0_6px_rgba(255,43,78,0.85)]" title="1–2 completions (The Reddest)" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#fb923c] shadow-[0_0_5px_rgba(251,146,60,0.65)]" title="3–4 completions" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.7)]" title="5–7 completions" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,1)] ring-1 ring-white/50" title="8+ completions (The Greenest & Brightest)" />
          <span className="font-semibold text-emerald-400">More</span>
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
          <div className="absolute top-0 right-4 px-3.5 py-1.5 rounded-xl bg-slate-900/95 border border-white/10 text-xs shadow-2xl pointer-events-none flex items-center gap-2 animate-pop z-20 backdrop-blur-md">
            <span className="text-slate-300 font-medium">{formatDateDisplay(hoveredDay.date)}:</span>
            <span
              className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                hoveredDay.count >= 8
                  ? 'bg-emerald-500/20 text-[#00ff88] border border-emerald-400/40 shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                  : hoveredDay.count >= 5
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : hoveredDay.count >= 3
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : hoveredDay.count >= 1
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}
            >
              {hoveredDay.count} {hoveredDay.count === 1 ? 'completion' : 'completions'}
            </span>
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
