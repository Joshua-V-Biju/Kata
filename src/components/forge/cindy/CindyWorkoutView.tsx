import React, { useState, useEffect, useRef } from 'react';
import { CindySession } from '../../../types/forge';
import { useForgeStore } from '../../../store/useForgeStore';
import { useKataStore } from '../../../store/useKataStore';
import { soundEngine } from '../../../utils/sound';
import { fireLevelUpConfetti } from '../../../utils/confetti';
import { getTodayStr } from '../../../utils/dates';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Plus,
  Minus,
  Save,
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';

const CINDY_STORAGE_KEY = 'forge_cindy_sessions_v1';

// Initial seed sessions showing progressive improvement
const SEED_CINDY_SESSIONS: CindySession[] = [
  {
    id: 'cindy-seed-1',
    date: '2026-10-20T17:00:00.000Z',
    rounds: 14,
    partialReps: 8,
    totalReps: 428,
    pullupsCount: 75,
    pushupsCount: 143,
    squatsCount: 210,
    durationSeconds: 1200,
    pacePerRoundSeconds: 83,
    notes: 'Paced conservatively. Broke push-ups into 5+5 starting round 8.',
    isPr: false
  },
  {
    id: 'cindy-seed-2',
    date: '2026-10-26T17:00:00.000Z',
    rounds: 16,
    partialReps: 5,
    totalReps: 485,
    pullupsCount: 85,
    pushupsCount: 160,
    squatsCount: 240,
    durationSeconds: 1200,
    pacePerRoundSeconds: 74,
    notes: 'Much better grip endurance. Strict dead-hang on all pull-ups.',
    isPr: true
  }
];

export const CindyWorkoutView: React.FC = () => {
  const { settings } = useForgeStore();

  // Load history of Cindy sessions
  const [sessions, setSessions] = useState<CindySession[]>(() => {
    try {
      const saved = localStorage.getItem(CINDY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SEED_CINDY_SESSIONS;
  });

  const persistSessions = (newSessions: CindySession[]) => {
    setSessions(newSessions);
    try {
      localStorage.setItem(CINDY_STORAGE_KEY, JSON.stringify(newSessions));
    } catch (e) {}
  };

  // Timer & AMRAP Active State
  const TOTAL_DURATION_SECONDS = 1200; // 20 minutes
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(TOTAL_DURATION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);

  // In-workout round counter
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<'pullups' | 'pushups' | 'squats'>('pullups');
  const [partialReps, setPartialReps] = useState<number>(0);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Audio trigger guards so we only play milestone beeps once
  const beepGuards = useRef<{ half: boolean; fiveMin: boolean; oneMin: boolean; countdown: boolean }>({
    half: false,
    fiveMin: false,
    oneMin: false,
    countdown: false
  });

  // Calculate highest rounds (all-time PR)
  const bestSession = [...sessions].sort((a, b) => b.totalReps - a.totalReps)[0];
  const bestRoundsFormatted = bestSession
    ? `${bestSession.rounds} Rds + ${bestSession.partialReps} reps (${bestSession.totalReps} total)`
    : 'No baseline yet';

  // Timer Tick Hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          const next = prev - 1;

          // Halfway chime (10 mins / 600s)
          if (next === 600 && !beepGuards.current.half) {
            beepGuards.current.half = true;
            soundEngine.playCombo();
          }

          // 5 minutes remaining (300s)
          if (next === 300 && !beepGuards.current.fiveMin) {
            beepGuards.current.fiveMin = true;
            soundEngine.playRestBeep(false);
          }

          // 1 minute remaining (60s)
          if (next === 60 && !beepGuards.current.oneMin) {
            beepGuards.current.oneMin = true;
            soundEngine.playRestBeep(false);
          }

          // Final 5 seconds countdown
          if (next <= 5 && next > 0) {
            soundEngine.playRestBeep(false);
          }

          // Timer finished
          if (next <= 0) {
            setIsTimerRunning(false);
            soundEngine.playSprintDone();
            soundEngine.playLevelUp();
            fireLevelUpConfetti();
            setShowSaveModal(true);
            return 0;
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining]);

  const elapsedSeconds = TOTAL_DURATION_SECONDS - timerSecondsRemaining;
  const minutesRem = Math.floor(timerSecondsRemaining / 60);
  const secondsRem = timerSecondsRemaining % 60;
  const timeFormatted = `${String(minutesRem).padStart(2, '0')}:${String(secondsRem).padStart(2, '0')}`;

  // Current pace calculation: rounds per minute or seconds per round
  const currentTotalReps = completedRounds * 30 + partialReps;
  const currentPaceSeconds = completedRounds > 0 ? Math.round(elapsedSeconds / completedRounds) : 0;
  const projectedRounds = elapsedSeconds > 60
    ? ((completedRounds + partialReps / 30) / (elapsedSeconds / 1200)).toFixed(1)
    : '—';

  // Handlers
  const handleStartWorkout = () => {
    soundEngine.playAnvilHit();
    setIsWorkoutActive(true);
    setIsTimerRunning(true);
    beepGuards.current = { half: false, fiveMin: false, oneMin: false, countdown: false };
  };

  const handlePauseResume = () => {
    soundEngine.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetWorkout = () => {
    if (window.confirm('Reset current Cindy session?')) {
      setIsTimerRunning(false);
      setIsWorkoutActive(false);
      setTimerSecondsRemaining(TOTAL_DURATION_SECONDS);
      setCompletedRounds(0);
      setPartialReps(0);
      setCurrentStep('pullups');
    }
  };

  const handleCompleteRound = () => {
    soundEngine.playAnvilHit();
    setCompletedRounds(prev => prev + 1);
    setCurrentStep('pullups');
  };

  const handleStepAdvance = (step: 'pullups' | 'pushups' | 'squats') => {
    soundEngine.playCheckmark();
    if (step === 'pullups') {
      setCurrentStep('pushups');
    } else if (step === 'pushups') {
      setCurrentStep('squats');
    } else {
      // Finished squats -> completed full round!
      handleCompleteRound();
    }
  };

  const handleSaveSession = () => {
    const isPr = !bestSession || currentTotalReps > bestSession.totalReps;
    const pace = completedRounds > 0 ? Math.round(1200 / completedRounds) : 0;

    // Calculate sub-exercise reps
    const pullups = completedRounds * 5 + Math.min(5, partialReps);
    const pushups = completedRounds * 10 + Math.max(0, Math.min(10, partialReps - 5));
    const squats = completedRounds * 15 + Math.max(0, partialReps - 15);

    const newSession: CindySession = {
      id: `cindy-${Date.now()}`,
      date: new Date().toISOString(),
      rounds: completedRounds,
      partialReps,
      totalReps: currentTotalReps,
      pullupsCount: pullups,
      pushupsCount: pushups,
      squatsCount: squats,
      durationSeconds: elapsedSeconds > 0 ? elapsedSeconds : 1200,
      pacePerRoundSeconds: pace,
      notes: sessionNotes.trim() || undefined,
      isPr
    };

    const nextList = [newSession, ...sessions];
    persistSessions(nextList);

    // Auto-tick Kata's "Workouts/Yoga" habit if enabled!
    if (settings.syncToKataWorkoutHabit) {
      try {
        const todayStr = getTodayStr();
        const kataState = useKataStore.getState();
        const currentLog = kataState.dayLogs[todayStr];
        if (!currentLog || !currentLog.completedHabitIds.includes('habit-workout')) {
          kataState.toggleHabit('habit-workout', todayStr);
          kataState.addToast(
            'Cindy Benchmark Saved!',
            '“Workout/Yoga” automatically checked off in Kata!',
            'success'
          );
        }
      } catch (e) {
        console.warn('Kata sync error', e);
      }
    }

    soundEngine.playLevelUp();
    fireLevelUpConfetti();
    setShowSaveModal(false);
    setIsWorkoutActive(false);
    setIsTimerRunning(false);
    setTimerSecondsRemaining(TOTAL_DURATION_SECONDS);
    setCompletedRounds(0);
    setPartialReps(0);
    setSessionNotes('');
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Delete this Cindy record?')) {
      const next = sessions.filter(s => s.id !== id);
      persistSessions(next);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#171a22] p-6 sm:p-8 border border-white/5 space-y-4">
        <div className="absolute -right-6 -bottom-8 text-9xl font-display font-black text-orange-500/[0.03] select-none pointer-events-none">
          極限
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>CROSSFIT BENCHMARK WOD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-100 tracking-tight">
              The Cindy Protocol • 20-Min AMRAP
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              As Many Rounds As Possible in 20:00. Standard round: <strong>5 Pull-ups</strong>, <strong>10 Push-ups</strong>, and <strong>15 Air Squats</strong> (30 reps/round). Test aerobic capacity, muscular endurance, and mental grit. Mark it down daily and watch your score surge.
            </p>
          </div>

          {/* All-Time PR Badge */}
          <div className="p-4 rounded-2xl bg-[#13151b] border border-white/5 flex items-center gap-3.5 shrink-0">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                All-Time Record (PR)
              </span>
              <span className="text-base font-mono font-bold text-amber-300">
                {bestRoundsFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Formula Visual Ribbon */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 border-t border-white/5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#13151b] border border-white/5 flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">5</span>
            <div>
              <span className="font-bold text-slate-200 block">Pull-ups</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Strict or kipping</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#13151b] border border-white/5 flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">10</span>
            <div>
              <span className="font-bold text-slate-200 block">Push-ups</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Chest to deck</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#13151b] border border-white/5 flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">15</span>
            <div>
              <span className="font-bold text-slate-200 block">Air Squats</span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Below parallel</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LIVE 20-MIN AMRAP CHAMBER                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171a22] border border-white/5 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/15 text-orange-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-100">
                Live 20-Minute AMRAP Clock
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {isTimerRunning ? 'Discipline active — push each transition' : 'Ready to start when you are'}
              </span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-4 self-center sm:self-auto">
            <div className="text-center font-mono">
              <span className="text-4xl sm:text-5xl font-bold text-orange-400 tracking-tight block">
                {timeFormatted}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                {isTimerRunning ? 'Countdown Running' : '20:00 Cap'}
              </span>
            </div>

            {/* Main Action Start/Pause Button */}
            {!isWorkoutActive ? (
              <button
                type="button"
                onClick={handleStartWorkout}
                className="py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>START CINDY</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePauseResume}
                  className="p-3 rounded-2xl bg-orange-600 text-slate-950 font-bold transition shadow-sm cursor-pointer"
                  title={isTimerRunning ? 'Pause' : 'Resume'}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
                </button>
                <button
                  type="button"
                  onClick={handleResetWorkout}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Counters & Round Tally */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Round Completed Box (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="p-6 rounded-3xl bg-[#13151b] border border-white/5 text-center space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                COMPLETED ROUNDS
              </span>
              <div className="text-6xl font-mono font-bold text-slate-100">
                {completedRounds}
              </div>
              <span className="text-xs font-mono text-amber-400 block">
                {completedRounds * 30} Total Base Reps Logged
              </span>

              {/* Instant Complete Round Button */}
              <button
                type="button"
                onClick={handleCompleteRound}
                disabled={!isWorkoutActive}
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-slate-950 font-display font-bold text-base uppercase tracking-wider active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>1 ROUND COMPLETED (30 REPS)</span>
              </button>
            </div>

            {/* Step-by-Step Movement Checklist */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStepAdvance('pullups')}
                disabled={!isWorkoutActive}
                className={`p-3 rounded-xl border text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 'pullups'
                    ? 'bg-orange-600/30 border-orange-400 text-orange-200 shadow'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span>5 Pull-ups</span>
                <span className="text-[10px] opacity-75">{currentStep === 'pullups' ? 'Current' : 'Done'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStepAdvance('pushups')}
                disabled={!isWorkoutActive}
                className={`p-3 rounded-xl border text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 'pushups'
                    ? 'bg-orange-600/30 border-orange-400 text-orange-200 shadow'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span>10 Push-ups</span>
                <span className="text-[10px] opacity-75">{currentStep === 'pushups' ? 'Current' : 'Next'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStepAdvance('squats')}
                disabled={!isWorkoutActive}
                className={`p-3 rounded-xl border text-xs font-mono font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 'squats'
                    ? 'bg-orange-600/30 border-orange-400 text-orange-200 shadow'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span>15 Squats</span>
                <span className="text-[10px] opacity-75">{currentStep === 'squats' ? 'Current' : 'Finisher'}</span>
              </button>
            </div>

          </div>

          {/* Live Pace & Partial Rep Adjustment (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Live Pace Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                LIVE PACING ANALYTICS
              </span>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Split Pace:</span>
                <span className="text-base font-bold text-amber-300">
                  {currentPaceSeconds > 0 ? `${currentPaceSeconds}s / round` : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Projected 20m Score:</span>
                <span className="text-base font-bold text-orange-400">
                  {projectedRounds} Rounds
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Reps:</span>
                <span className="text-base font-bold text-white">
                  {currentTotalReps} Reps
                </span>
              </div>
            </div>

            {/* Partial Rep Adjustment (+1 Rep, -1 Rep) */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Additional Partial Reps:</span>
                <span className="text-lg font-bold text-white">+{partialReps}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPartialReps(prev => Math.max(0, prev - 1))}
                  disabled={!isWorkoutActive}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Subtract 1 rep"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>1 Rep</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPartialReps(prev => prev + 1)}
                  disabled={!isWorkoutActive}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 hover:text-slate-950 text-slate-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Add 1 rep"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>1 Rep</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPartialReps(prev => prev + 5)}
                  disabled={!isWorkoutActive}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 hover:text-slate-950 text-slate-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Add 5 reps"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>5 Reps</span>
                </button>
              </div>
            </div>

            {/* Manual Finish Early Button */}
            {isWorkoutActive && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-orange-400 font-display font-bold text-xs uppercase tracking-wider border border-orange-500/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Current Score Now</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CINDY PROGRESSION & DAILY IMPROVEMENT LOG                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-display font-black text-white">
              Daily Improvement &amp; History Log
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {sessions.length} Recorded Sessions
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs rounded-2xl bg-black/20 border border-white/5">
            No Cindy logs recorded yet. Complete your first 20-minute AMRAP above!
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s, idx) => {
              const dateStr = new Date(s.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });

              // Calculate diff vs previous chronological attempt if available
              const prevAttempt = sessions[idx + 1];
              let diffText = '';
              if (prevAttempt) {
                const diffReps = s.totalReps - prevAttempt.totalReps;
                if (diffReps > 0) diffText = `+${diffReps} reps vs previous! 🚀`;
                else if (diffReps === 0) diffText = 'Tied previous record';
                else diffText = `${diffReps} reps vs previous`;
              }

              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl forge-card border border-white/10 hover:border-orange-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-display font-black text-white">
                        {s.rounds} Rounds + {s.partialReps} Reps
                      </span>
                      {s.isPr && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3 fill-amber-300" />
                          <span>PR</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400">
                        • {dateStr}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="text-white font-bold">{s.totalReps} Total Reps</span>
                      <span>•</span>
                      <span>{s.pullupsCount} Pull-ups</span>
                      <span>•</span>
                      <span>{s.pushupsCount} Push-ups</span>
                      <span>•</span>
                      <span>{s.squatsCount} Squats</span>
                      {s.pacePerRoundSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400">Avg {s.pacePerRoundSeconds}s / Round</span>
                        </>
                      )}
                    </div>

                    {s.notes && (
                      <p className="text-xs font-mono text-slate-300 italic pt-1">
                        "{s.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {diffText && (
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                        diffText.includes('+')
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-900 text-slate-400 border-white/5'
                      }`}>
                        {diffText}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteSession(s.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SAVE SCORE MODAL                                                   */}
      {/* ------------------------------------------------------------------ */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0f1118] border-2 border-orange-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                20-MINUTE AMRAP COMPLETED
              </span>
              <h2 className="text-3xl font-display font-black text-white">
                Log Your Cindy Score
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Mark your score to benchmark your daily progressive overload.
              </p>
            </div>

            {/* Score Summary Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-center space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold block">
                Final Tally
              </span>
              <div className="text-4xl font-mono font-black text-amber-300">
                {completedRounds} Rounds + {partialReps} Reps
              </div>
              <div className="text-sm font-mono text-white">
                {currentTotalReps} Total Reps ({completedRounds * 5 + Math.min(5, partialReps)} Pull-ups • {completedRounds * 10 + Math.max(0, Math.min(10, partialReps - 5))} Push-ups • {completedRounds * 15 + Math.max(0, partialReps - 15)} Squats)
              </div>
            </div>

            {/* Reflection Notes Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 block font-bold">
                Session Reflection &amp; Pacing Notes (Optional):
              </label>
              <textarea
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="e.g. Broken sets on push-ups, unbroken squats, felt fast off the bar..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/50 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveSession}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 transition cursor-pointer"
              >
                SAVE RECORD &amp; TICK KATA HABIT
              </button>

              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="py-4 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
