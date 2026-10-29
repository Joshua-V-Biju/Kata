import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getTodayStr, formatDateDisplay, getDayOfWeekIndex } from '../../utils/dates';
import { Flame, Zap, Sun, Moon, Settings, Bell, Calendar, ChevronLeft, ChevronRight, Sparkles, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHabitManager: () => void;
  onLaunchSprint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenHabitManager,
  onLaunchSprint
}) => {
  const {
    userStats,
    selectedDate,
    setSelectedDate,
    settings,
    updateSettings,
    sprintTimer,
    habits,
    dayLogs
  } = useKataStore();

  const todayStr = getTodayStr();
  const isToday = selectedDate === todayStr;

  // Calculate uncompleted habits for today
  const currentDayLog = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };
  const dow = getDayOfWeekIndex(selectedDate);
  const scheduledToday = habits.filter(h => !h.archived && h.scheduleDays.includes(dow));
  const remainingCount = scheduledToday.filter(h => !currentDayLog.completedHabitIds.includes(h.id)).length;

  const stepDate = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${ny}-${nm}-${nd}`);
  };

  const minutes = Math.floor(sprintTimer.remainingSeconds / 60);
  const seconds = sprintTimer.remainingSeconds % 60;
  const sprintCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0d14] rounded-2xl flex items-center justify-center">
              <span className="font-display font-black text-cyan-400 text-lg">型</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-display font-black tracking-tight text-white">
                KATA
              </span>
              <span className="text-xs font-display font-medium text-slate-400">
                • 習慣
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block -mt-1">
              Command Center
            </span>
          </div>
        </div>

        {/* Center: Date Stepper & Today Indicator */}
        <div className="hidden md:flex items-center gap-2 p-1 rounded-2xl bg-slate-900/60 border border-white/5">
          <button
            onClick={() => stepDate(-1)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1 rounded-xl text-xs font-medium font-mono transition ${
              isToday
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {formatDateDisplay(selectedDate)}
            {isToday && <span className="ml-1 text-[10px] opacity-75">(Today)</span>}
          </button>

          <button
            onClick={() => stepDate(1)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions, Streaks, Voltron Timer, Settings */}
        <div className="flex items-center gap-2.5">
          
          {/* Voltron Sprint Active Pill */}
          {sprintTimer.active ? (
            <button
              onClick={onLaunchSprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold animate-pulse shadow-lg shadow-purple-500/20"
              title="Open Voltron Sprint Chamber"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span>{sprintCountdown}</span>
            </button>
          ) : (
            <button
              onClick={onLaunchSprint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
              title="Launch 2-Hour Voltron Sprint"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Voltron Sprint</span>
            </button>
          )}

          {/* Habit Manager trigger */}
          <button
            onClick={onOpenHabitManager}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium transition"
            title="Manage Habits"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Habits</span>
          </button>

          {/* Notification Prompt Badge */}
          {remainingCount > 0 && isToday && (
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
              title={`${remainingCount} habits left today`}
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>{remainingCount} left</span>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Toggle Light/Dark Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Settings & Cloud Sync"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
