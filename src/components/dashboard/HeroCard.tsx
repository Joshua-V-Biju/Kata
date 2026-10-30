import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getTodayStr, getDayOfWeekIndex, formatDateDisplay } from '../../utils/dates';
import { getStatusTitle, getXpForLevel } from '../../utils/gamification';
import { AnimeMascot } from './AnimeMascot';
import { Flame, Zap, Sparkles, TrendingUp, Calendar } from 'lucide-react';

export const HeroCard: React.FC = () => {
  const { habits, dayLogs, userStats, selectedDate, setSelectedDate, comboMultiplier } = useKataStore();
  const todayStr = getTodayStr();
  const isToday = selectedDate === todayStr;

  // Compute yesterday string
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yYear = yesterdayObj.getFullYear();
  const yMonth = String(yesterdayObj.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayObj.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;
  const yesterdayLog = dayLogs[yesterdayStr];
  const yesterdayDoneCount = yesterdayLog?.completedHabitIds?.length || 0;

  const currentLog = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };
  const dayOfWeek = getDayOfWeekIndex(selectedDate);
  const scheduledHabits = habits.filter(h => !h.archived && h.scheduleDays.includes(dayOfWeek));

  const totalCount = scheduledHabits.length || 1;
  const completedCount = scheduledHabits.filter(h => currentLog.completedHabitIds.includes(h.id)).length;
  const completionRate = Math.min(1, completedCount / totalCount);
  const percentage = Math.round(completionRate * 100);

  const status = getStatusTitle(completionRate, userStats.currentStreak);
  const nextLevelXp = getXpForLevel(userStats.level);
  const xpPercent = Math.min(100, Math.round((userStats.xp / nextLevelXp) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 border border-white/10 shadow-2xl">
      {/* Background Anime Kanwa / Cyber Watermark */}
      <div className="absolute -right-8 -bottom-10 text-[140px] font-display font-black text-white/[0.02] select-none pointer-events-none leading-none">
        鍛錬
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left: Mascot & Interactive Performance Aura */}
        <div className="shrink-0 flex flex-col items-center">
          <AnimeMascot completionRate={completionRate} streak={userStats.currentStreak} />
          <div className="mt-2 text-center">
            <span className="text-[11px] font-mono text-slate-400">Companion Kata</span>
          </div>
        </div>

        {/* Center: Hero Performance Status */}
        <div className="flex-1 text-center lg:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            {/* Seamless Date Switcher Pills: Today & Yesterday */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                  isToday
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Today ({formatDateDisplay(todayStr)})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(yesterdayStr)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                  selectedDate === yesterdayStr
                    ? 'bg-purple-500/20 border border-purple-400 text-purple-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View or log habits for yesterday"
              >
                <span>Yesterday ({yesterdayDoneCount} done)</span>
              </button>
            </div>

            {/* Streak Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{userStats.currentStreak}-Day Streak</span>
            </div>

            {/* Combo Multiplier Pill */}
            {comboMultiplier > 1 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold animate-pulse">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>{comboMultiplier.toFixed(1)}x Combo</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
              {status.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300/80 mt-1 max-w-xl font-normal">
              {status.subtitle}
            </p>
          </div>

          {/* Level & XP Progression Bar */}
          <div className="pt-2 max-w-md">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-white text-sm">Lv.{userStats.level}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px]">
                  {userStats.rankTitle} • {userStats.rankKanji}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-cyan-400 text-xs">
                <Zap className="w-3 h-3 fill-cyan-400" />
                <span>{userStats.xp} / {nextLevelXp} XP</span>
              </div>
            </div>

            {/* Glowing Surge XP Bar */}
            <div className="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-pink-500 shadow-[0_0_12px_rgba(0,242,254,0.6)] transition-all duration-700 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Big Fluid Daily Percentage Ring */}
        <div className="shrink-0 flex flex-col items-center justify-center p-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-800/80"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke="url(#heroRingGrad)"
                strokeWidth="7"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="50%" stopColor="#00e5a3" />
                  <stop offset="100%" stopColor="#ff6b8b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Percentage & Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-display font-black text-white tracking-tight">
                {percentage}%
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {completedCount}/{totalCount} Done
              </span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-1">Today's Progress</span>
        </div>

      </div>
    </div>
  );
};
