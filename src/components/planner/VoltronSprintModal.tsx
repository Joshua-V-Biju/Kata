import React, { useEffect } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { Play, Pause, RotateCcw, CheckCircle2, Zap, X, Volume2, Shield } from 'lucide-react';

interface VoltronSprintModalProps {
  onClose: () => void;
}

export const VoltronSprintModal: React.FC<VoltronSprintModalProps> = ({ onClose }) => {
  const {
    sprintTimer,
    pauseSprintTimer,
    resumeSprintTimer,
    resetSprintTimer,
    tickSprintTimer,
    completeVoltronSprint,
    timetable,
    habits
  } = useKataStore();

  const block = timetable.find(b => b.id === sprintTimer.blockId);
  const linkedHabit = habits.find(h => h.id === block?.linkedHabitId);

  // Interval timer tick
  useEffect(() => {
    if (!sprintTimer.active || sprintTimer.isPaused) return;

    const interval = setInterval(() => {
      tickSprintTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [sprintTimer.active, sprintTimer.isPaused, tickSprintTimer]);

  const minutes = Math.floor(sprintTimer.remainingSeconds / 60);
  const seconds = sprintTimer.remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = 1 - (sprintTimer.remainingSeconds / (sprintTimer.totalSeconds || 7200));
  const progressPercent = Math.round(progress * 100);

  const handleFinishEarly = () => {
    if (sprintTimer.blockId) {
      completeVoltronSprint(sprintTimer.blockId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#131926] via-[#0d121c] to-[#080b12] border-2 border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.25)] text-center overflow-hidden">
        
        {/* Background Glowing Circles */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Kanji Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-display font-bold tracking-widest uppercase">
          <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Voltron Sprint Chamber • 極限集中</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-black text-white mt-3">
          {block?.title || 'Voltron Sprint: 2-Hour Deep Focus'}
        </h2>

        {block?.description && (
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            {block.description}
          </p>
        )}

        {/* Linked Habit Banner */}
        {linkedHabit && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
            <span className="text-slate-400">Auto-ticking linked habit:</span>
            <span className="font-bold flex items-center gap-1.5" style={{ color: linkedHabit.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: linkedHabit.color }} />
              {linkedHabit.name}
            </span>
          </div>
        )}

        {/* Main Countdown Timer Circle */}
        <div className="relative my-8 w-60 h-60 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="transparent"
              stroke="url(#voltronGrad)"
              strokeWidth="10"
              strokeDasharray={527}
              strokeDashoffset={527 - (527 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="voltronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#00e5a3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Digits in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-mono font-black text-white tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              {timeFormatted}
            </span>
            <span className="text-xs font-mono text-purple-300 mt-1 uppercase tracking-widest">
              {sprintTimer.isPaused ? 'Chamber Paused' : 'Discipline Active'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetSprintTimer}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {sprintTimer.isPaused ? (
            <button
              onClick={resumeSprintTimer}
              className="p-5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition"
              title="Resume Focus"
            >
              <Play className="w-6 h-6 fill-slate-950" />
            </button>
          ) : (
            <button
              onClick={pauseSprintTimer}
              className="p-5 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition"
              title="Pause Focus"
            >
              <Pause className="w-6 h-6 fill-white" />
            </button>
          )}

          <button
            onClick={handleFinishEarly}
            className="p-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition flex items-center gap-1.5"
            title="Mark Completed Early"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* Finish & Claim Reward */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>2-Hour Sprint Protocol</span>
          </div>
          <span className="font-mono text-amber-300 font-bold">
            Reward: +150 XP
          </span>
        </div>

      </div>
    </div>
  );
};
