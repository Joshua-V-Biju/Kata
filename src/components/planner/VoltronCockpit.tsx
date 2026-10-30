import React, { useState, useEffect } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { soundEngine } from '../../utils/sound';
import { fireLevelUpConfetti } from '../../utils/confetti';
import { getTodayStr } from '../../utils/dates';
import {
  Zap, Play, Pause, RotateCcw, CheckCircle2, Shield, Headphones,
  Volume2, VolumeX, Sparkles, Target, Plus, Trash2, Maximize2, Minimize2, X
} from 'lucide-react';

interface VoltronCockpitProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const VoltronCockpit: React.FC<VoltronCockpitProps> = ({ onClose, isModal = false }) => {
  const {
    sprintTimer,
    startSprintTimer,
    pauseSprintTimer,
    resumeSprintTimer,
    resetSprintTimer,
    tickSprintTimer,
    completeVoltronSprint,
    timetable,
    habits,
    dayLogs
  } = useKataStore();

  const [activeLion, setActiveLion] = useState<'black' | 'red' | 'blue' | 'green' | 'yellow'>('red');
  const [isDroneActive, setIsDroneActive] = useState<boolean>(soundEngine.isFocusDroneActive());
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Live Sprint Task Checklist
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Define 2-hour sprint objective & scope', done: true },
    { id: '2', text: 'Execute deep creative forge block', done: false },
    { id: '3', text: 'Review output & log reflection note', done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Voltron 5 Lions Configuration
  const lions = [
    {
      id: 'black' as const,
      name: 'Black Lion • 黒獅子',
      title: 'Code & Architecture',
      linkedHabitId: 'habit-java',
      color: '#06b6d4',
      bgGrad: 'from-cyan-950/40 to-slate-900',
      description: 'Java Forge, backend systems, algorithmic flow'
    },
    {
      id: 'red' as const,
      name: 'Red Lion • 赤獅子',
      title: 'Animation & Keyframes',
      linkedHabitId: 'habit-animation',
      color: '#00e5a3',
      bgGrad: 'from-emerald-950/40 to-slate-900',
      description: 'Character turnaround, scene composition & motion'
    },
    {
      id: 'blue' as const,
      name: 'Blue Lion • 青獅子',
      title: 'FL Studio & Audio Synth',
      linkedHabitId: 'habit-declutter',
      color: '#38bdf8',
      bgGrad: 'from-sky-950/40 to-slate-900',
      description: 'Chords progression, synth sound design, mixing'
    },
    {
      id: 'green' as const,
      name: 'Green Lion • 緑獅子',
      title: 'Writing & World Lore',
      linkedHabitId: 'habit-reading',
      color: '#eab308',
      bgGrad: 'from-amber-950/40 to-slate-900',
      description: 'Story scripts, dialogue polish, universe design'
    },
    {
      id: 'yellow' as const,
      name: 'Yellow Lion • 黄獅子',
      title: 'Sandbox & Minecraft Mods',
      linkedHabitId: 'habit-mods',
      color: '#14b8a6',
      bgGrad: 'from-teal-950/40 to-slate-900',
      description: 'Custom item attributes, creative experimentation'
    }
  ];

  const currentLion = lions.find(l => l.id === activeLion) || lions[1];
  const linkedHabit = habits.find(h => h.id === currentLion.linkedHabitId);

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
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;

  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = sprintTimer.totalSeconds || 7200;
  const progressRatio = Math.min(1, Math.max(0, 1 - sprintTimer.remainingSeconds / totalSeconds));
  const progressPercent = Math.round(progressRatio * 100);

  const handleToggleDrone = () => {
    const active = soundEngine.toggleFocusDrone();
    setIsDroneActive(active);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, { id: String(Date.now()), text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
    soundEngine.playCheckmark();
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleClaimMission = () => {
    if (sprintTimer.blockId) {
      completeVoltronSprint(sprintTimer.blockId);
    } else {
      completeVoltronSprint('voltron-mon');
    }
    if (onClose) onClose();
  };

  const containerClass = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto'
    : 'relative w-full rounded-3xl';

  return (
    <div className={containerClass}>
      <div
        className={`relative w-full max-w-5xl rounded-3xl bg-gradient-to-b from-[#111724] via-[#0b0f19] to-[#070a10] border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(0,242,254,0.25)] text-slate-100 overflow-hidden ${
          isFullScreen ? 'fixed inset-2 z-50 max-w-none rounded-2xl' : ''
        }`}
      >
        {/* ==================================================================== */}
        {/* ANIME MECH HUD DECORATION & SCANLINES                                */}
        {/* ==================================================================== */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: currentLion.color }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: '#00f2fe' }} />

        {/* Top Telemetry Command Strip */}
        <div className="relative z-10 px-6 py-3 border-b border-white/10 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold tracking-widest uppercase">VOLTRON MK-V // TACTICAL COMMAND COCKPIT</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">SYNC RATE: 99.8%</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Focus Audio Synthesizer */}
            <button
              onClick={handleToggleDrone}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition border ${
                isDroneActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Toggle Web Audio Theta Binaural Focus Drone (108Hz)"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{isDroneActive ? 'Binaural Zen Active' : 'Enable Focus Drone'}</span>
              {isDroneActive ? <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
            </button>

            {/* Expand / Minimize */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Cockpit'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="Close Cockpit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MAIN COCKPIT BODY                                                    */}
        {/* ==================================================================== */}
        <div className="relative z-10 p-6 md:p-8 space-y-6">
          
          {/* 1. Voltron Lion Disciplines Selector Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SELECT CREATIVE LION CHAMBER
              </span>
              <span>16:00 – 18:00 DAILY PROTOCOL</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {lions.map(lion => {
                const isSelected = activeLion === lion.id;

                return (
                  <button
                    key={lion.id}
                    onClick={() => {
                      setActiveLion(lion.id);
                      if (lion.linkedHabitId) {
                        startSprintTimer(lion.id, 120);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-300 relative select-none overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-2 shadow-lg scale-[1.02]'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/15 opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isSelected ? lion.color : undefined,
                      boxShadow: isSelected ? `0 0 20px ${lion.color}40` : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lion.color }} />
                      <span className="text-[10px] font-mono text-slate-400">120M</span>
                    </div>
                    <span className="block text-xs font-display font-bold text-white truncate">
                      {lion.title}
                    </span>
                    <span className="block text-[10px] font-display text-slate-400 truncate mt-0.5">
                      {lion.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Tactical Centerpiece: Massive Cyber Digital Chronometer */}
          <div className="relative p-7 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl overflow-hidden text-center space-y-4">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>CORE FOCUS CHAMBER: {currentLion.title}</span>
            </div>

            {/* Giant Digital HUD Numbers */}
            <div className="py-2">
              <div className="text-6xl sm:text-7xl md:text-8xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_25px_rgba(0,242,254,0.6)] select-none">
                {timeFormatted}
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-cyan-400 mt-2 tracking-widest uppercase">
                <span>{sprintTimer.isPaused ? 'DRILL TEMPORARILY PAUSED' : 'NEURAL FLOW LOCKED IN'}</span>
                <span>•</span>
                <span>{progressPercent}% PROTOCOL DISCHARGED</span>
              </div>
            </div>

            {/* Animated Energy Conduit Progress Bar */}
            <div className="max-w-2xl mx-auto space-y-1.5">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 via-teal-400 to-pink-500 shadow-[0_0_15px_rgba(0,242,254,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Protocol Phase Markers */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                <span>00:00 (Ignition)</span>
                <span>40:00 (Deep Flow)</span>
                <span>80:00 (Apex Output)</span>
                <span>120:00 (Mission Complete)</span>
              </div>
            </div>

            {/* Tactical Control Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              
              {/* Reset */}
              <button
                onClick={resetSprintTimer}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Main Play / Pause Button */}
              {sprintTimer.isPaused || !sprintTimer.active ? (
                <button
                  onClick={() => {
                    if (!sprintTimer.active) {
                      startSprintTimer(currentLion.id, 120);
                    } else {
                      resumeSprintTimer();
                    }
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-display font-black text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(0,242,254,0.5)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>ENGAGE VOLTRON CORE</span>
                </button>
              ) : (
                <button
                  onClick={pauseSprintTimer}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 text-white font-display font-black text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  <span>PAUSE DISCIPLINE</span>
                </button>
              )}

              {/* Complete & Claim XP */}
              {(() => {
                const currentBlockId = sprintTimer.blockId || 'voltron-mon';
                const isMissionDoneToday = !!dayLogs[getTodayStr()]?.completedBlockIds?.includes(currentBlockId);
                return (
                  <button
                    onClick={handleClaimMission}
                    className={`px-6 py-4 rounded-2xl font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                      isMissionDoneToday
                        ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(0,229,163,0.4)]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(0,229,163,0.4)]'
                    }`}
                    title={isMissionDoneToday ? 'Mission completed today (+150 XP claimed). Click to toggle/unmark.' : 'Complete sprint and earn +150 XP'}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isMissionDoneToday ? 'CLAIMED (+150 XP)' : 'COMPLETE (+150 XP)'}</span>
                  </button>
                );
              })()}

            </div>

            {/* Quick Preset Selector */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Presets:</span>
              <button
                onClick={() => startSprintTimer(currentLion.id, 120)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/5"
              >
                120 Min (Full)
              </button>
              <button
                onClick={() => startSprintTimer(currentLion.id, 60)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              >
                60 Min (Burst)
              </button>
              <button
                onClick={() => startSprintTimer(currentLion.id, 25)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              >
                25 Min (Strike)
              </button>
            </div>

          </div>

          {/* 3. Bottom Grid: Linked Habit Synergy + Live Mission Objectives Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Card: Habit Synergy Slot */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  AUTOTICK LINKED HABIT
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                  SYNC VERIFIED
                </span>
              </div>

              {linkedHabit ? (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: linkedHabit.color }} />
                    <div>
                      <span className="text-sm font-display font-bold text-white block">
                        {linkedHabit.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Category: {linkedHabit.category} • Target: {linkedHabit.monthlyGoal}d/mo
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-300 block">+150 XP</span>
                    <span className="text-[10px] text-slate-500">Auto-ticked upon finish</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Independent Sprint Session</p>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentLion.description}. Engaging this 2-hour chamber locks your focus into flow state and awards maximum mastery XP.
              </p>
            </div>

            {/* Right Card: Live Sprint Tasks Checklist */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  SPRINT TARGET CHECKLIST
                </span>
                <span className="text-xs font-mono text-cyan-300">
                  {tasks.filter(t => t.done).length}/{tasks.length} Cleared
                </span>
              </div>

              {/* Task list */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition cursor-pointer ${
                      task.done
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                        : 'bg-slate-950/60 border-white/5 text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          task.done ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'border-slate-600'
                        }`}
                      >
                        {task.done && '✓'}
                      </div>
                      <span className="truncate">{task.text}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task form */}
              <form onSubmit={handleAddTask} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={e => setNewTaskInput(e.target.value)}
                  placeholder="Add target for this 2h sprint..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
