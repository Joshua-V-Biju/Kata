import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../../utils/sound';
import {
  HeartPulse,
  Moon,
  BatteryCharging,
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Shield,
  Activity,
  Flame,
  Volume2
} from 'lucide-react';

interface MobilityExercise {
  name: string;
  durationSeconds: number;
  instruction: string;
}

interface MobilityRoutine {
  id: string;
  title: string;
  titleKanji: string;
  durationMinutes: number;
  description: string;
  focus: string;
  exercises: MobilityExercise[];
}

const MOBILITY_ROUTINES: MobilityRoutine[] = [
  {
    id: 'shoulder-thoracic',
    title: 'Thoracic Spine & Shoulder Armor Reset',
    titleKanji: '胸椎・肩甲骨',
    durationMinutes: 5,
    description: 'Relieve posture stiffness and lubricate shoulder capsules for smooth push-ups and pull-ups.',
    focus: 'Shoulders, Upper Spine, Pectorals',
    exercises: [
      { name: 'Scapular Arm Circles & Glides', durationSeconds: 60, instruction: 'Slow circular rotations of shoulder blades backward and forward without bending elbows.' },
      { name: 'Cat-Cow Spinal Waves', durationSeconds: 60, instruction: 'On all fours, inhale as belly dips and chest opens; exhale as upper back rounds toward the ceiling.' },
      { name: 'Thread the Needle Rotations', durationSeconds: 60, instruction: 'Reach one arm beneath chest, laying shoulder gently to floor, exhaling deeply on each twist.' },
      { name: 'Doorway Pec & Bicep Stretch', durationSeconds: 60, instruction: 'Forearm flush with doorframe, step forward gently to stretch chest and front delt.' },
      { name: 'Prone Cobra Hold', durationSeconds: 60, instruction: 'Lie face down, squeeze shoulder blades together and lift upper chest slightly off the ground.' }
    ]
  },
  {
    id: 'hip-pistol',
    title: 'Deep Hip Mobility & Pistol Squat Primer',
    titleKanji: '股関節・開脚',
    durationMinutes: 7,
    description: 'Unlock ankle dorsiflexion, hip internal rotation, and posterior chain length for deep squats.',
    focus: 'Hips, Adductors, Ankles, Hamstrings',
    exercises: [
      { name: 'Deep Squat Pry & Hold', durationSeconds: 90, instruction: 'Sink into deepest comfortable squat, press elbows against inner knees, keep chest proud.' },
      { name: '90/90 Dynamic Hip Switches', durationSeconds: 90, instruction: 'Seated with knees at 90-degree angles, pivot smoothly between internal and external rotation.' },
      { name: 'Couch / Hip Flexor Opener', durationSeconds: 90, instruction: 'Knee near wall or couch, squeeze glute of rear leg to release tight hip flexors.' },
      { name: 'Hamstring Flossing & Sweep', durationSeconds: 90, instruction: 'Front leg extended, hinge hips backward with flat spine to stretch hamstring belly.' },
      { name: 'Ankle Dorsiflexion Lunge Waves', durationSeconds: 60, instruction: 'Drive knee forward over toes while keeping heel pinned flat to the floor.' }
    ]
  },
  {
    id: 'wrist-conditioning',
    title: 'Wrist & Handstand Conditioning Flow',
    titleKanji: '手首・前腕強化',
    durationMinutes: 5,
    description: 'Bulletproof wrists, carpal tendons, and forearms against strain from handstands, push-ups, and dips.',
    focus: 'Wrists, Extensors, Flexors',
    exercises: [
      { name: 'Kneeling Palm Pulses', durationSeconds: 60, instruction: 'Hands on floor under shoulders, gently pulse bodyweight forward into knuckles and palms.' },
      { name: 'Reverse Wrist Flexor Stretch', durationSeconds: 60, instruction: 'Turn fingers backward pointing toward knees, lean weight back cautiously.' },
      { name: 'Back of Hand Knuckle Leans', durationSeconds: 60, instruction: 'Place backs of hands flat on floor, gently close and open fists to mobilize extensors.' },
      { name: 'Side-to-Side Wrist Oscillations', durationSeconds: 60, instruction: 'Fingers pointing outward to sides, sway torso side to side gently.' },
      { name: 'First Knuckle Lifts', durationSeconds: 60, instruction: 'Palms flat, elevate palm heel while pressing base of fingers firmly into ground.' }
    ]
  },
  {
    id: 'fullbody-steel-reset',
    title: 'Full Body Steel Reset & Decompression',
    titleKanji: '全身調律',
    durationMinutes: 8,
    description: 'Complete restorative reset to calm CNS arousal, release spinal compression, and promote muscular bloodflow.',
    focus: 'Whole Body Restoration',
    exercises: [
      { name: 'Downward Dog to Upward Dog Flow', durationSeconds: 90, instruction: 'Transition slowly between lengthening hamstrings/calves and opening chest/hips.' },
      { name: 'Extended Child’s Pose with Side Reach', durationSeconds: 90, instruction: 'Knees wide, hips on heels, arms walking diagonally to open lats and serratus.' },
      { name: 'Pigeon Pose / Glute Stretch', durationSeconds: 120, instruction: '60 seconds per leg. Fold gently over front bent shin to release gluteus medius.' },
      { name: 'Supine Spinal Twist', durationSeconds: 90, instruction: 'Arms spread wide, drop knees to one side while turning gaze to opposite hand.' },
      { name: 'Box Breathing Corpse Savasana', durationSeconds: 90, instruction: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Full muscular relaxation.' }
    ]
  }
];

export const RecoveryView: React.FC = () => {
  // Readiness Check-in local states
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sorenessScore, setSorenessScore] = useState<number>(2); // 1 = none, 5 = severe
  const [energyScore, setEnergyScore] = useState<number>(4); // 1 = drained, 5 = supercharged
  const [stressScore, setStressScore] = useState<number>(2); // 1 = low, 5 = high

  // Active Guided Mobility Routine State
  const [activeRoutine, setActiveRoutine] = useState<MobilityRoutine | null>(null);
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(0);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);

  // Compute readiness score (0 - 100)
  // Higher sleep -> higher score
  // Lower soreness -> higher score
  // Higher energy -> higher score
  // Lower stress -> higher score
  const calculateReadiness = () => {
    const sleepFactor = Math.min(100, (sleepHours / 8) * 40); // Max 40 pts
    const energyFactor = (energyScore / 5) * 30; // Max 30 pts
    const sorenessPenalty = ((sorenessScore - 1) / 4) * 20; // Up to 20 penalty
    const stressPenalty = ((stressScore - 1) / 4) * 10; // Up to 10 penalty

    const score = Math.max(10, Math.min(100, Math.round(sleepFactor + energyFactor - sorenessPenalty - stressPenalty + 15)));
    return score;
  };

  const readinessScore = calculateReadiness();

  const getReadinessTier = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Prime Combat Condition',
        sub: 'Optimal CNS & muscular recovery. Green light to break PRs and train with high intensity.',
        color: '#ff6600',
        textColor: 'text-orange-400',
        glow: '0 0 20px rgba(255, 102, 0, 0.4)',
        border: 'border-orange-500/50'
      };
    }
    if (score >= 60) {
      return {
        label: 'Hypertrophy Steady-State',
        sub: 'Moderate readiness. Great for hypertrophy volume; keep sets 1–2 reps in reserve (RPE 7.5–8.5).',
        color: '#f59e0b',
        textColor: 'text-amber-400',
        glow: '0 0 16px rgba(245, 158, 11, 0.3)',
        border: 'border-amber-500/40'
      };
    }
    return {
      label: 'Active Restoration Recommended',
      sub: 'Fatigue is elevated. Favor 5-10m mobility, hydration, and light skill warm-ups over heavy failure sets.',
      color: '#38bdf8',
      textColor: 'text-sky-400',
      glow: '0 0 16px rgba(56, 189, 248, 0.3)',
      border: 'border-sky-500/40'
    };
  };

  const readinessTier = getReadinessTier(readinessScore);

  // Timer Tick Hook
  useEffect(() => {
    let interval: any = null;
    if (timerIsRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          if (prev <= 1) {
            soundEngine.playRestComplete();
            // Move to next exercise if available
            if (activeRoutine && currentExIndex < activeRoutine.exercises.length - 1) {
              const nextIdx = currentExIndex + 1;
              setCurrentExIndex(nextIdx);
              return activeRoutine.exercises[nextIdx].durationSeconds;
            } else {
              setTimerIsRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerIsRunning, timerSecondsRemaining, activeRoutine, currentExIndex]);

  const handleStartRoutine = (routine: MobilityRoutine) => {
    soundEngine.playAnvilHit();
    setActiveRoutine(routine);
    setCurrentExIndex(0);
    setTimerSecondsRemaining(routine.exercises[0].durationSeconds);
    setTimerIsRunning(true);
  };

  const handleStopRoutine = () => {
    setTimerIsRunning(false);
    setActiveRoutine(null);
    setCurrentExIndex(0);
    setTimerSecondsRemaining(0);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950">
            <HeartPulse className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
            RESTORATION CHAMBER • 肉体再生
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Readiness Gauge &amp; Guided Mobility
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          Muscles are broken down during workouts; they grow during sleep and recovery. Gauge CNS readiness and run guided joint pre-hab.
        </p>
      </div>

      {/* Readiness Check-in and Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Readiness Check-in Inputs (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl forge-card border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              <span>Daily Neuromuscular Check-in</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">Updates Readiness Real-Time</span>
          </div>

          <div className="space-y-4">
            
            {/* Sleep Hours Slider */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Last Night Sleep</span>
                </span>
                <span className="font-bold text-indigo-300">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>4h (Severe Deficit)</span>
                <span>8h (Ideal)</span>
                <span>10h (Full Recovery)</span>
              </div>
            </div>

            {/* Muscle Soreness 1-5 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Muscle Soreness (DOMS)</span>
                </span>
                <span className="font-bold text-amber-300">
                  {sorenessScore === 1 ? 'Fresh (1/5)' : sorenessScore <= 3 ? 'Mild (3/5)' : 'Deep Soreness (5/5)'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSorenessScore(val)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      sorenessScore === val
                        ? 'bg-amber-600 text-slate-950 font-black scale-105'
                        : 'bg-black/40 text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level 1-5 */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-orange-400" />
                  <span>Physical Energy &amp; Drive</span>
                </span>
                <span className="font-bold text-orange-300">
                  {energyScore <= 2 ? 'Lethargic' : energyScore <= 4 ? 'Solid Drive' : 'Electrified (5/5)'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEnergyScore(val)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      energyScore === val
                        ? 'bg-orange-600 text-slate-950 font-black scale-105'
                        : 'bg-black/40 text-slate-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Readiness Gauge Hero (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl forge-card border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              CALCULATED READINESS
            </span>
            <div className="mt-4 flex items-center justify-center relative py-6">
              
              {/* Circular Score Display */}
              <div
                className="w-44 h-44 rounded-full flex flex-col items-center justify-center p-4 border-4 transition-all duration-700 bg-slate-950/80"
                style={{
                  borderColor: readinessTier.color,
                  boxShadow: readinessTier.glow
                }}
              >
                <span className="text-4xl font-mono font-black text-white">
                  {readinessScore}%
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1 font-bold">
                  Readiness
                </span>
              </div>
            </div>
          </div>

          {/* Classification text */}
          <div className={`p-4 rounded-2xl bg-black/60 border ${readinessTier.border} space-y-1.5`}>
            <div className={`text-sm font-display font-black ${readinessTier.textColor}`}>
              {readinessTier.label}
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {readinessTier.sub}
            </p>
          </div>
        </div>

      </div>

      {/* Guided Mobility Player Modal / Drawer (When Active) */}
      {activeRoutine && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12131b] to-[#1c1510] border-2 border-orange-500/50 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-600/30 text-orange-400 font-mono text-[10px] font-bold border border-orange-500/30">
                  GUIDED MOBILITY ACTIVE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Step {currentExIndex + 1} of {activeRoutine.exercises.length}
                </span>
              </div>
              <h2 className="text-xl font-display font-black text-white mt-1">
                {activeRoutine.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleStopRoutine}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all self-start sm:self-center"
            >
              Close Routine
            </button>
          </div>

          {/* Current Exercise Spotlight & Timer */}
          <div className="p-6 rounded-2xl bg-black/70 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider block">
                Current Movement:
              </span>
              <h3 className="text-2xl font-display font-black text-white">
                {activeRoutine.exercises[currentExIndex].name}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-lg leading-relaxed">
                {activeRoutine.exercises[currentExIndex].instruction}
              </p>
            </div>

            {/* Countdown Clock & Controls */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center font-mono">
                <div className="text-4xl font-black text-orange-400">
                  {Math.floor(timerSecondsRemaining / 60)}:
                  {(timerSecondsRemaining % 60).toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Remaining
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerIsRunning(!timerIsRunning)}
                  className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold transition-all shadow-lg cursor-pointer"
                >
                  {timerIsRunning ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
                </button>
                <button
                  type="button"
                  onClick={() => setTimerSecondsRemaining(activeRoutine.exercises[currentExIndex].durationSeconds)}
                  className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Reset Step"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Guided Mobility Routines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span>Guided 5–10 Minute Joint Pre-Hab Routines</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">Audio Chimes &amp; Timers Built-In</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOBILITY_ROUTINES.map(routine => (
            <div
              key={routine.id}
              className="p-5 rounded-2xl forge-card border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-500/20 font-bold">
                    {routine.titleKanji} • {routine.durationMinutes} min
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {routine.exercises.length} Exercises
                  </span>
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  {routine.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  {routine.description}
                </p>
                <div className="text-[11px] font-mono text-slate-500">
                  Focus: <span className="text-slate-300">{routine.focus}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartRoutine(routine)}
                className="w-full py-2.5 rounded-xl bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-slate-950 font-display font-bold text-xs transition-all flex items-center justify-center gap-2 border border-orange-500/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Guided Flow ({routine.durationMinutes}m)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
