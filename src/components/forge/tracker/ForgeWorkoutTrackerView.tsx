import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { WorkoutSession, CindySession } from '../../../types/forge';
import { WorkoutDetailModal } from '../logger/WorkoutDetailModal';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
  Dumbbell,
  Clock,
  Zap,
  TrendingUp,
  CheckCircle2,
  Trophy,
  Activity,
  Plus
} from 'lucide-react';

const CINDY_STORAGE_KEY = 'forge_cindy_sessions_v1';

export const ForgeWorkoutTrackerView: React.FC = () => {
  const { workouts, startWorkout } = useForgeStore();

  // Load Cindy sessions from storage
  const [cindySessions] = useState<CindySession[]>(() => {
    try {
      const saved = localStorage.getItem(CINDY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Track active month and year
  const [activeDate, setActiveDate] = useState(() => new Date(2026, 9, 1)); // Default to October 2026
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(new Date().getDate());
  const [inspectWorkout, setInspectWorkout] = useState<WorkoutSession | null>(null);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth(); // 0-indexed (9 = October)
  const monthName = activeDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Compute days in active month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const stepMonth = (direction: -1 | 1) => {
    setActiveDate(new Date(year, month + direction, 1));
  };

  // Group workouts by day of this month
  const monthWorkoutsByDay: Record<number, WorkoutSession[]> = {};
  const monthCindyByDay: Record<number, CindySession[]> = {};

  workouts.forEach(w => {
    const d = new Date(w.startedAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate();
      if (!monthWorkoutsByDay[dayNum]) monthWorkoutsByDay[dayNum] = [];
      monthWorkoutsByDay[dayNum].push(w);
    }
  });

  cindySessions.forEach(c => {
    const d = new Date(c.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate();
      if (!monthCindyByDay[dayNum]) monthCindyByDay[dayNum] = [];
      monthCindyByDay[dayNum].push(c);
    }
  });

  // Compute monthly stats
  let totalWorkoutsThisMonth = 0;
  let totalVolumeThisMonth = 0;
  let totalDurationSecondsThisMonth = 0;
  let totalIronThisMonth = 0;

  daysArray.forEach(day => {
    const dayW = monthWorkoutsByDay[day] || [];
    const dayC = monthCindyByDay[day] || [];
    if (dayW.length > 0 || dayC.length > 0) {
      totalWorkoutsThisMonth += dayW.length + dayC.length;
    }
    dayW.forEach(w => {
      totalVolumeThisMonth += w.totalVolumeKg;
      totalDurationSecondsThisMonth += w.durationSeconds;
      totalIronThisMonth += w.ironEarned;
    });
    dayC.forEach(c => {
      totalDurationSecondsThisMonth += c.durationSeconds;
      totalVolumeThisMonth += c.totalReps * 20; // Simulated volume estimate
      totalIronThisMonth += 150;
    });
  });

  const monthlyGoal = 16; // 4 workouts / week target
  const consistencyPct = Math.min(100, Math.round((totalWorkoutsThisMonth / monthlyGoal) * 100));
  const activeHours = Math.floor(totalDurationSecondsThisMonth / 3600);
  const activeMins = Math.floor((totalDurationSecondsThisMonth % 3600) / 60);

  // Selected day data
  const selectedDayWorkouts = monthWorkoutsByDay[selectedDayNumber] || [];
  const selectedDayCindy = monthCindyByDay[selectedDayNumber] || [];
  const selectedDateObj = new Date(year, month, selectedDayNumber);
  const selectedDateLabel = selectedDateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Month Navigation & Telemetry Header */}
      <div className="p-6 rounded-3xl bg-[#171a22] border border-white/5 space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-wider block">
              FORGE MONTHLY TRACKER • 月間鍛錬記録
            </span>
            <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
              <span>{monthName}</span>
            </h1>
          </div>

          {/* Month Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/30 border border-white/5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => stepMonth(-1)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-slate-300">
              {monthName}
            </span>
            <button
              type="button"
              onClick={() => stepMonth(1)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          
          <div className="p-4 rounded-2xl bg-[#13151b] border border-white/5 space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
              <span>Consistency</span>
              <span className="text-orange-400 font-bold">{consistencyPct}%</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {totalWorkoutsThisMonth} <span className="text-xs text-slate-400 font-normal">/ {monthlyGoal} sessions</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#13151b] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Total Volume Moved
            </span>
            <div className="text-2xl font-bold text-amber-400">
              {totalVolumeThisMonth.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#13151b] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Active Time Under Iron
            </span>
            <div className="text-2xl font-bold text-slate-100">
              {activeHours}h {activeMins}m
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#13151b] border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Mined Iron Currency
            </span>
            <div className="text-2xl font-bold text-emerald-400">
              +{totalIronThisMonth} <span className="text-xs font-normal text-slate-400">Iron</span>
            </div>
          </div>

        </div>

      </div>

      {/* Main Interactive Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#171a22] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Interactive Month Grid ({totalDaysInMonth} Days)</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Select any day to inspect details
            </span>
          </div>

          {/* Days Grid: 7 columns (Mon-Sun) */}
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
              <div key={w} className="text-center text-[10px] font-mono text-slate-400 uppercase py-1">
                {w}
              </div>
            ))}

            {daysArray.map(dayNum => {
              const dayWorkouts = monthWorkoutsByDay[dayNum] || [];
              const dayCindy = monthCindyByDay[dayNum] || [];
              const hasTrained = dayWorkouts.length > 0 || dayCindy.length > 0;
              const isSelected = selectedDayNumber === dayNum;

              // Total volume on this day
              let dayVol = 0;
              dayWorkouts.forEach(w => { dayVol += w.totalVolumeKg; });
              dayCindy.forEach(c => { dayVol += c.totalReps * 20; });

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDayNumber(dayNum)}
                  className={`min-h-[72px] sm:min-h-[80px] p-2 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/10 border-orange-500/50 shadow-md ring-1 ring-orange-500/30'
                      : hasTrained
                      ? 'bg-[#14161d] border-orange-500/20 hover:border-orange-500/40'
                      : 'bg-[#13151b]/60 border-white/5 hover:border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-orange-400' : hasTrained ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {dayNum}
                    </span>

                    {hasTrained && (
                      <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
                    )}
                  </div>

                  {hasTrained ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-orange-400 truncate block">
                        {dayWorkouts[0]?.name.split(' ')[0] || (dayCindy.length > 0 ? 'Cindy' : 'Workout')}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block truncate">
                        {dayVol.toLocaleString()}kg
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Rest
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span>Trained Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span>Active Recovery / Rest</span>
            </div>
          </div>
        </div>

        {/* Selected Day Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#171a22] border border-white/5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                DAY INSPECTOR
              </span>
              <h3 className="text-lg font-display font-bold text-slate-100">
                {selectedDateLabel}
              </h3>
            </div>

            {selectedDayWorkouts.length === 0 && selectedDayCindy.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#13151b] border border-dashed border-white/10 text-center space-y-3">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-xs font-mono text-slate-300 font-bold">
                  Rest &amp; Muscular Adaptation Day
                </div>
                <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                  No workout recorded on this date. Tissues repair and synthesize new myofibrils during recovery days.
                </p>
                <button
                  type="button"
                  onClick={() => startWorkout(undefined, `Session on ${selectedDateLabel}`)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600 hover:text-slate-950 text-orange-400 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Workout Here</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Standard Workouts */}
                {selectedDayWorkouts.map(w => (
                  <div
                    key={w.id}
                    onClick={() => setInspectWorkout(w)}
                    className="p-4 rounded-2xl bg-[#13151b] border border-white/5 hover:border-orange-500/30 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-display font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                          {w.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {Math.floor(w.durationSeconds / 60)} mins
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{w.exercises.length} Exercises</span>
                      <span className="text-amber-400 font-bold">{w.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-emerald-400 font-bold">+{w.ironEarned} Iron</span>
                    </div>

                    <span className="text-[11px] font-mono text-orange-400 block pt-1">
                      Tap to view set breakdown &rarr;
                    </span>
                  </div>
                ))}

                {/* Cindy WOD Sessions */}
                {selectedDayCindy.map(c => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#13151b] border border-orange-500/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <h4 className="text-sm font-display font-bold text-slate-200">
                          The Cindy Protocol (20m AMRAP)
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        {c.rounds} Rds + {c.partialReps} Reps
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{c.totalReps} Total Reps</span>
                      <span>5 Pull • 10 Push • 15 Squat</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block text-center">
              Consistency is the single biggest predictor of muscular hypertrophy.
            </span>
          </div>

        </div>

      </div>

      {/* Full Workout Set Inspector Modal */}
      <WorkoutDetailModal
        workout={inspectWorkout}
        isOpen={Boolean(inspectWorkout)}
        onClose={() => setInspectWorkout(null)}
      />

    </div>
  );
};
