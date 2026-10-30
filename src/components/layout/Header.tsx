import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { useForgeStore } from '../../store/useForgeStore';
import { getTodayStr, formatDateDisplay, getDayOfWeekIndex } from '../../utils/dates';
import { Flame, Zap, Sun, Moon, Settings, Bell, Calendar, ChevronLeft, ChevronRight, Sparkles, Sliders, Dumbbell } from 'lucide-react';

interface HeaderProps {
  currentMode: 'kata' | 'forge';
  onModeChange: (mode: 'kata' | 'forge') => void;
  onOpenSettings: () => void;
  onOpenHabitManager: () => void;
  onLaunchSprint: () => void;
  onOpenArmory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onOpenSettings,
  onOpenHabitManager,
  onLaunchSprint,
  onOpenArmory
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

  const { activeWorkout } = useForgeStore();

  const todayStr = getTodayStr();
  const isToday = selectedDate === todayStr;

  // Forge active workout live timer format
  const isWorkoutActive = activeWorkout.isActive;
  const wMin = Math.floor(activeWorkout.elapsedSeconds / 60);
  const wSec = activeWorkout.elapsedSeconds % 60;
  const workoutElapsedFormatted = `${wMin}:${String(wSec).padStart(2, '0')}`;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4 py-3">
        
        {/* Left: Brand / Logo (Dynamic between Kata and Forge) */}
        <div className="flex items-center gap-3">
          {currentMode === 'kata' ? (
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-2xl flex items-center justify-center">
                <span className="font-display font-black text-cyan-400 text-lg">型</span>
              </div>
            </div>
          ) : (
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-red-600 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0 animate-impact">
              <div className="w-full h-full bg-[#0c0d12] rounded-2xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-display font-black tracking-tight text-white">
                {currentMode === 'kata' ? 'KATA' : 'FORGE'}
              </span>
              <span className="text-xs font-display font-medium text-slate-400">
                {currentMode === 'kata' ? '• 習慣' : '• 鍛錬'}
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block -mt-1">
              {currentMode === 'kata' ? 'Command Center' : 'Home Armor Lab'}
            </span>
          </div>
        </div>

        {/* Center: Always-Visible Two-Mode Switcher [ Kata | Forge ] */}
        <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => onModeChange('kata')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'kata'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Kata Habit Command Center"
          >
            <span className="text-xs">型</span>
            <span>Kata</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('forge')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentMode === 'forge'
                ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-slate-950 shadow-lg shadow-orange-500/30'
                : 'text-orange-400 hover:text-orange-300'
            } ${isWorkoutActive ? 'animate-pulse' : ''}`}
            title={isWorkoutActive ? `Forge Live: ${workoutElapsedFormatted}` : 'Switch to Forge Home Fitness Mode (Shift+F)'}
          >
            <Flame className={`w-3.5 h-3.5 ${isWorkoutActive ? 'fill-current animate-bounce' : 'fill-current'}`} />
            <span>Forge</span>
            {isWorkoutActive && (
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono text-white">
                {workoutElapsedFormatted}
              </span>
            )}
          </button>
        </div>

        {/* Date Stepper & Today Indicator (Visible in Kata mode on larger screens) */}
        {currentMode === 'kata' && (
          <div className="hidden lg:flex items-center gap-2 p-1 rounded-2xl bg-slate-900/60 border border-white/5">
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
        )}

        {/* Right: Actions, Voltron Timer, Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {currentMode === 'kata' && (
            <>
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
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
                  title="Launch 2-Hour Voltron Sprint"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sprint</span>
                </button>
              )}

              {/* Habit Manager trigger */}
              <button
                onClick={onOpenHabitManager}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium transition"
                title="Manage Habits"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Habits</span>
              </button>
            </>
          )}

          {currentMode === 'forge' && onOpenArmory && (
            <button
              onClick={onOpenArmory}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-mono font-semibold transition"
              title="Configure Home Armory"
            >
              <Dumbbell className="w-3.5 h-3.5 text-orange-400" />
              <span>Armory</span>
            </button>
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

