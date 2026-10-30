import React from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { Clock, Plus, SkipForward, Play, Pause, Flame } from 'lucide-react';

export const RestTimerBar: React.FC = () => {
  const { activeWorkout, pauseRestTimer, skipRestTimer, addRestSeconds, startRestTimer } = useForgeStore();
  const { restTimer } = activeWorkout;

  if (!restTimer.active && restTimer.remainingSeconds <= 0) return null;

  const minutes = Math.floor(restTimer.remainingSeconds / 60);
  const seconds = restTimer.remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percent = restTimer.durationSeconds > 0
    ? Math.min(100, Math.max(0, (restTimer.remainingSeconds / restTimer.durationSeconds) * 100))
    : 0;

  return (
    <div className="sticky top-16 z-30 w-full p-3 sm:p-4 rounded-2xl bg-[#141620] border-2 border-orange-500/40 shadow-[0_0_25px_rgba(255,102,0,0.25)] flex flex-wrap items-center justify-between gap-3 animate-fade-in backdrop-blur-md">
      
      {/* Left: Timer info */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-orange-500 transition-all duration-300"
              strokeWidth="3.5"
              strokeDasharray={`${percent}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 absolute" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold">
              REST TIMER • 休息
            </span>
            {restTimer.exerciseName && (
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                after {restTimer.exerciseName}
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider flex items-center gap-2">
            <span>{timeFormatted}</span>
            {!restTimer.active && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                PAUSED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Quick Presets */}
      <div className="hidden md:flex items-center gap-1.5">
        {[45, 60, 90, 120].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => startRestTimer(s)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 text-slate-300 text-xs font-mono transition border border-white/5"
          >
            {s}s
          </button>
        ))}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => addRestSeconds(30)}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 border border-white/5 transition"
          title="Add 30 seconds"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>30s</span>
        </button>

        <button
          type="button"
          onClick={pauseRestTimer}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
          title={restTimer.active ? 'Pause' : 'Resume'}
        >
          {restTimer.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={skipRestTimer}
          className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 shadow-md transition cursor-pointer"
          title="Skip Rest and Next Set"
        >
          <span>Skip</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
