import { create } from 'zustand';
import {
  ActiveWorkoutState,
  EquipmentId,
  Exercise,
  ForgeRank,
  ForgeRoutine,
  ForgeSettings,
  ForgeUserStats,
  LoggedExercise,
  SetType,
  WorkoutSession,
  WorkoutSet
} from '../types/forge';
import { AVAILABLE_EQUIPMENT, INITIAL_EXERCISES, STARTER_ROUTINES } from '../utils/forgeData';
import { useKataStore } from './useKataStore';
import { getTodayStr } from '../utils/dates';
import { soundEngine } from '../utils/sound';

const FORGE_STORAGE_KEY = 'forge_fitness_state_v1';

// Sample seeded past workouts to ensure history & charts look alive immediately
const SEED_WORKOUTS: WorkoutSession[] = [
  {
    id: 'seed-w-1',
    name: 'Home Upper Armor Blast',
    startedAt: '2026-10-25T16:00:00.000Z',
    completedAt: '2026-10-25T16:48:00.000Z',
    durationSeconds: 2880,
    totalVolumeKg: 1420,
    ironEarned: 165,
    prCount: 2,
    notes: 'Pushed tempo to 3s eccentric on all push-ups. Incredible pump.',
    exercises: [
      {
        id: 'le-1',
        exerciseId: 'pushup-standard',
        name: 'Standard Push-up',
        sets: [
          { id: 's-1', setNumber: 1, type: 'warmup', reps: 15, weightKg: 0, tempo: 'Standard', rpe: 7, completed: true },
          { id: 's-2', setNumber: 2, type: 'normal', reps: 16, weightKg: 0, tempo: '3-1-1-0', rpe: 8.5, completed: true },
          { id: 's-3', setNumber: 3, type: 'normal', reps: 14, weightKg: 0, tempo: '3-1-1-0', rpe: 9, completed: true },
          { id: 's-4', setNumber: 4, type: 'failure', reps: 12, weightKg: 0, tempo: 'Pause 2s', rpe: 10, completed: true }
        ]
      },
      {
        id: 'le-2',
        exerciseId: 'pullup-strict',
        name: 'Strict Pull-up (Overhand)',
        sets: [
          { id: 's-5', setNumber: 1, type: 'normal', reps: 8, weightKg: 0, tempo: 'Standard', rpe: 8, completed: true },
          { id: 's-6', setNumber: 2, type: 'normal', reps: 7, weightKg: 0, tempo: 'Standard', rpe: 9, completed: true },
          { id: 's-7', setNumber: 3, type: 'normal', reps: 6, weightKg: 0, tempo: 'Pause 1s', rpe: 9.5, completed: true }
        ]
      },
      {
        id: 'le-3',
        exerciseId: 'dip-standard',
        name: 'Parallel Bar Dips',
        sets: [
          { id: 's-8', setNumber: 1, type: 'normal', reps: 10, weightKg: 0, tempo: 'Standard', rpe: 8, completed: true },
          { id: 's-9', setNumber: 2, type: 'normal', reps: 10, weightKg: 0, tempo: '3-1-1-0', rpe: 9, completed: true },
          { id: 's-10', setNumber: 3, type: 'failure', reps: 8, weightKg: 0, tempo: 'Standard', rpe: 10, completed: true }
        ]
      }
    ]
  },
  {
    id: 'seed-w-2',
    name: 'Lower Wheelhouse & Core',
    startedAt: '2026-10-27T16:00:00.000Z',
    completedAt: '2026-10-27T16:42:00.000Z',
    durationSeconds: 2520,
    totalVolumeKg: 1950,
    ironEarned: 140,
    prCount: 1,
    notes: 'Bulgarian split squats are brutal. Hamstrings fired up.',
    exercises: [
      {
        id: 'le-4',
        exerciseId: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        sets: [
          { id: 's-11', setNumber: 1, type: 'normal', reps: 12, weightKg: 10, tempo: 'Standard', rpe: 8, completed: true },
          { id: 's-12', setNumber: 2, type: 'normal', reps: 12, weightKg: 10, tempo: 'Standard', rpe: 8.5, completed: true },
          { id: 's-13', setNumber: 3, type: 'normal', reps: 10, weightKg: 10, tempo: 'Pause 2s', rpe: 9.5, completed: true }
        ]
      },
      {
        id: 'le-5',
        exerciseId: 'single-leg-rdl',
        name: 'Single-Leg Romanian Deadlift (Hinge)',
        sets: [
          { id: 's-14', setNumber: 1, type: 'normal', reps: 12, weightKg: 0, tempo: '3-1-1-0', rpe: 7.5, completed: true },
          { id: 's-15', setNumber: 2, type: 'normal', reps: 12, weightKg: 0, tempo: '3-1-1-0', rpe: 8, completed: true }
        ]
      },
      {
        id: 'le-6',
        exerciseId: 'hollow-body-hold',
        name: 'Hollow Body Hold',
        sets: [
          { id: 's-16', setNumber: 1, type: 'normal', reps: 45, weightKg: 0, tempo: 'Static', rpe: 9, completed: true },
          { id: 's-17', setNumber: 2, type: 'failure', reps: 40, weightKg: 0, tempo: 'Static', rpe: 10, completed: true }
        ]
      }
    ]
  }
];

export interface ForgeState {
  equipment: EquipmentId[];
  onboardingCompleted: boolean;
  workouts: WorkoutSession[];
  activeWorkout: ActiveWorkoutState;
  customExercises: Exercise[];
  settings: ForgeSettings;
  stats: ForgeUserStats;

  // Actions
  setEquipment: (equipment: EquipmentId[]) => void;
  toggleEquipment: (eq: EquipmentId) => void;
  completeOnboarding: (equipment?: EquipmentId[]) => void;
  
  // Workout Execution
  startWorkout: (routine?: ForgeRoutine, customName?: string) => void;
  cancelWorkout: () => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  addSetToExercise: (exerciseId: string, type?: SetType) => void;
  repeatLastSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  tickWorkoutTimer: () => void;

  // Rest Timer
  startRestTimer: (durationSeconds?: number, exerciseName?: string) => void;
  pauseRestTimer: () => void;
  skipRestTimer: () => void;
  addRestSeconds: (seconds: number) => void;
  tickRestTimer: () => void;

  // Finish Workout
  finishWorkout: () => { volumeKg: number; ironEarned: number; prCount: number };

  // Settings & Reset
  updateSettings: (updates: Partial<ForgeSettings>) => void;
  resetForgeData: () => void;
}

const getInitialForgeState = () => {
  const defaultState = {
    equipment: ['bodyweight', 'pullup_bar', 'chair_table'] as EquipmentId[],
    onboardingCompleted: false,
    workouts: SEED_WORKOUTS,
    customExercises: [] as Exercise[],
    activeWorkout: {
      isActive: false,
      session: null,
      elapsedSeconds: 0,
      isPaused: false,
      restTimer: {
        active: false,
        durationSeconds: 90,
        remainingSeconds: 90
      }
    } as ActiveWorkoutState,
    settings: {
      syncToKataWorkoutHabit: true,
      soundEnabled: true,
      restTimerDuration: 90,
      restTimerVibrate: true,
      weightUnit: 'kg' as const,
      hideBodyMetrics: false
    },
    stats: {
      iron: 305,
      heat: 60,
      heatDecayDays: 0,
      rank: 'Spark' as ForgeRank,
      totalWorkouts: 2,
      totalVolumeKg: 3370,
      totalSets: 17,
      currentStreak: 2,
      longestStreak: 5
    }
  };

  try {
    const saved = localStorage.getItem(FORGE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          ...defaultState,
          ...parsed,
          equipment: Array.isArray(parsed.equipment) ? parsed.equipment : defaultState.equipment,
          workouts: Array.isArray(parsed.workouts) && parsed.workouts.length > 0 ? parsed.workouts : defaultState.workouts,
          customExercises: Array.isArray(parsed.customExercises) ? parsed.customExercises : defaultState.customExercises,
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          stats: { ...defaultState.stats, ...(parsed.stats || {}) },
          onboardingCompleted: Boolean(parsed.onboardingCompleted),
          activeWorkout: defaultState.activeWorkout
        };
      }
    }
  } catch (e) {
    console.warn('Forge state parse error, using defaults', e);
  }

  return defaultState;
};

export const useForgeStore = create<ForgeState>((set, get) => {
  const initial = getInitialForgeState();

  const persist = () => {
    try {
      const state = get();
      const toSave = {
        equipment: state.equipment,
        onboardingCompleted: state.onboardingCompleted,
        workouts: state.workouts,
        customExercises: state.customExercises,
        settings: state.settings,
        stats: state.stats
      };
      localStorage.setItem(FORGE_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('LocalStorage Forge save error', e);
    }
  };

  return {
    ...initial,

    setEquipment: (equipment: EquipmentId[]) => {
      set({ equipment });
      persist();
    },

    toggleEquipment: (eq: EquipmentId) => {
      set(state => {
        const next = state.equipment.includes(eq)
          ? state.equipment.filter(id => id !== eq)
          : [...state.equipment, eq];
        return { equipment: next };
      });
      persist();
    },

    completeOnboarding: (equipment?: EquipmentId[]) => {
      set(state => ({
        onboardingCompleted: true,
        ...(equipment ? { equipment } : {})
      }));
      persist();
    },

    startWorkout: (routine?: ForgeRoutine, customName?: string) => {
      let initialExercises: LoggedExercise[] = [];

      if (routine && routine.exerciseIds.length > 0) {
        initialExercises = routine.exerciseIds.map((exId, idx) => {
          const exDef = INITIAL_EXERCISES.find(e => e.id === exId);
          return {
            id: `le-${Date.now()}-${idx}`,
            exerciseId: exId,
            name: exDef ? exDef.name : 'Exercise',
            sets: [
              {
                id: `s-${Date.now()}-${idx}-1`,
                setNumber: 1,
                type: 'normal',
                reps: 10,
                weightKg: 0,
                tempo: 'Standard',
                rpe: 8,
                completed: false
              },
              {
                id: `s-${Date.now()}-${idx}-2`,
                setNumber: 2,
                type: 'normal',
                reps: 10,
                weightKg: 0,
                tempo: 'Standard',
                rpe: 8.5,
                completed: false
              },
              {
                id: `s-${Date.now()}-${idx}-3`,
                setNumber: 3,
                type: 'normal',
                reps: 10,
                weightKg: 0,
                tempo: 'Standard',
                rpe: 9,
                completed: false
              }
            ]
          };
        });
      }

      const newSession: WorkoutSession = {
        id: `workout-${Date.now()}`,
        name: customName || (routine ? routine.name : 'Freestyle Forge Session'),
        routineId: routine ? routine.id : undefined,
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
        exercises: initialExercises,
        totalVolumeKg: 0,
        ironEarned: 0,
        prCount: 0
      };

      set({
        activeWorkout: {
          isActive: true,
          session: newSession,
          elapsedSeconds: 0,
          isPaused: false,
          restTimer: {
            active: false,
            durationSeconds: get().settings.restTimerDuration || 90,
            remainingSeconds: get().settings.restTimerDuration || 90
          }
        }
      });

      soundEngine.playAnvilHit();
    },

    cancelWorkout: () => {
      set({
        activeWorkout: {
          isActive: false,
          session: null,
          elapsedSeconds: 0,
          isPaused: false,
          restTimer: {
            active: false,
            durationSeconds: 90,
            remainingSeconds: 90
          }
        }
      });
    },

    addExerciseToWorkout: (exercise: Exercise) => {
      set(state => {
        if (!state.activeWorkout.session) return state;

        const newLoggedExercise: LoggedExercise = {
          id: `le-${Date.now()}`,
          exerciseId: exercise.id,
          name: exercise.name,
          sets: [
            {
              id: `s-${Date.now()}-1`,
              setNumber: 1,
              type: 'normal',
              reps: 10,
              weightKg: 0,
              tempo: 'Standard',
              rpe: 8,
              completed: false
            }
          ]
        };

        const updatedSession = {
          ...state.activeWorkout.session,
          exercises: [...state.activeWorkout.session.exercises, newLoggedExercise]
        };

        return {
          activeWorkout: {
            ...state.activeWorkout,
            session: updatedSession
          }
        };
      });
      soundEngine.playAnvilHit();
    },

    removeExerciseFromWorkout: (exerciseId: string) => {
      set(state => {
        if (!state.activeWorkout.session) return state;
        return {
          activeWorkout: {
            ...state.activeWorkout,
            session: {
              ...state.activeWorkout.session,
              exercises: state.activeWorkout.session.exercises.filter(e => e.id !== exerciseId)
            }
          }
        };
      });
    },

    addSetToExercise: (exerciseId: string, type: SetType = 'normal') => {
      set(state => {
        if (!state.activeWorkout.session) return state;

        const exercises = state.activeWorkout.session.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const nextSetNum = ex.sets.length + 1;
          const lastSet = ex.sets[ex.sets.length - 1];

          const newSet: WorkoutSet = {
            id: `s-${Date.now()}-${nextSetNum}`,
            setNumber: nextSetNum,
            type: type,
            reps: lastSet ? lastSet.reps : 10,
            weightKg: lastSet ? lastSet.weightKg : 0,
            tempo: lastSet ? lastSet.tempo : 'Standard',
            rpe: 8.5,
            completed: false
          };

          return {
            ...ex,
            sets: [...ex.sets, newSet]
          };
        });

        return {
          activeWorkout: {
            ...state.activeWorkout,
            session: { ...state.activeWorkout.session, exercises }
          }
        };
      });
    },

    repeatLastSet: (exerciseId: string) => {
      get().addSetToExercise(exerciseId);
      soundEngine.playCheckmark();
    },

    updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
      set(state => {
        if (!state.activeWorkout.session) return state;

        const exercises = state.activeWorkout.session.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(s => (s.id === setId ? { ...s, ...updates } : s))
          };
        });

        return {
          activeWorkout: {
            ...state.activeWorkout,
            session: { ...state.activeWorkout.session, exercises }
          }
        };
      });
    },

    completeSet: (exerciseId: string, setId: string) => {
      const state = get();
      if (!state.activeWorkout.session) return;

      let exerciseName = 'Exercise';
      let justCompleted = false;

      const exercises = state.activeWorkout.session.exercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        exerciseName = ex.name;
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              justCompleted = !s.completed;
              return { ...s, completed: !s.completed };
            }
            return s;
          })
        };
      });

      set({
        activeWorkout: {
          ...state.activeWorkout,
          session: { ...state.activeWorkout.session, exercises }
        }
      });

      if (justCompleted) {
        soundEngine.playAnvilHit();
        // Start rest timer automatically!
        get().startRestTimer(state.settings.restTimerDuration || 90, exerciseName);
      }
    },

    removeSet: (exerciseId: string, setId: string) => {
      set(state => {
        if (!state.activeWorkout.session) return state;

        const exercises = state.activeWorkout.session.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          const filtered = ex.sets.filter(s => s.id !== setId);
          // Renumber sets
          const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
          return { ...ex, sets: renumbered };
        });

        return {
          activeWorkout: {
            ...state.activeWorkout,
            session: { ...state.activeWorkout.session, exercises }
          }
        };
      });
    },

    tickWorkoutTimer: () => {
      set(state => {
        if (!state.activeWorkout.isActive || state.activeWorkout.isPaused) return state;
        const nextElapsed = state.activeWorkout.elapsedSeconds + 1;
        return {
          activeWorkout: {
            ...state.activeWorkout,
            elapsedSeconds: nextElapsed,
            session: state.activeWorkout.session
              ? { ...state.activeWorkout.session, durationSeconds: nextElapsed }
              : null
          }
        };
      });
    },

    startRestTimer: (durationSeconds?: number, exerciseName?: string) => {
      const dur = durationSeconds || get().settings.restTimerDuration || 90;
      set(state => ({
        activeWorkout: {
          ...state.activeWorkout,
          restTimer: {
            active: true,
            durationSeconds: dur,
            remainingSeconds: dur,
            exerciseName: exerciseName || state.activeWorkout.restTimer.exerciseName
          }
        }
      }));
    },

    pauseRestTimer: () => {
      set(state => ({
        activeWorkout: {
          ...state.activeWorkout,
          restTimer: {
            ...state.activeWorkout.restTimer,
            active: !state.activeWorkout.restTimer.active
          }
        }
      }));
    },

    skipRestTimer: () => {
      set(state => ({
        activeWorkout: {
          ...state.activeWorkout,
          restTimer: {
            ...state.activeWorkout.restTimer,
            active: false,
            remainingSeconds: 0
          }
        }
      }));
      soundEngine.playRestBeep(true);
    },

    addRestSeconds: (seconds: number) => {
      set(state => {
        const nextRemaining = state.activeWorkout.restTimer.remainingSeconds + seconds;
        const nextDuration = Math.max(state.activeWorkout.restTimer.durationSeconds, nextRemaining);
        return {
          activeWorkout: {
            ...state.activeWorkout,
            restTimer: {
              ...state.activeWorkout.restTimer,
              active: true,
              remainingSeconds: nextRemaining,
              durationSeconds: nextDuration
            }
          }
        };
      });
    },

    tickRestTimer: () => {
      set(state => {
        if (!state.activeWorkout.restTimer.active) return state;
        const nextRem = state.activeWorkout.restTimer.remainingSeconds - 1;

        if (nextRem === 3 || nextRem === 2 || nextRem === 1) {
          soundEngine.playRestBeep(false);
        }

        if (nextRem <= 0) {
          soundEngine.playRestBeep(true);
          return {
            activeWorkout: {
              ...state.activeWorkout,
              restTimer: {
                ...state.activeWorkout.restTimer,
                active: false,
                remainingSeconds: 0
              }
            }
          };
        }

        return {
          activeWorkout: {
            ...state.activeWorkout,
            restTimer: {
              ...state.activeWorkout.restTimer,
              remainingSeconds: nextRem
            }
          }
        };
      });
    },

    finishWorkout: () => {
      const state = get();
      if (!state.activeWorkout.session) return { volumeKg: 0, ironEarned: 0, prCount: 0 };

      const session = state.activeWorkout.session;
      const completedAt = new Date().toISOString();

      // Compute total volume & total completed sets
      let totalVolume = 0;
      let totalCompletedSets = 0;

      session.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed) {
            totalCompletedSets++;
            // If bodyweight (0kg), count bodyweight estimate of 50kg for volume work
            const effectiveWeight = s.weightKg > 0 ? s.weightKg : 50;
            totalVolume += s.reps * effectiveWeight;
          }
        });
      });

      // Calculate Iron earned: +50 base for workout, +5 per set, +25 PR bonus
      const prCount = Math.floor(totalCompletedSets / 4) + 1; // Simulated PRs based on hard sets
      const ironEarned = 50 + totalCompletedSets * 5 + prCount * 25;

      const finalizedSession: WorkoutSession = {
        ...session,
        completedAt,
        durationSeconds: state.activeWorkout.elapsedSeconds,
        totalVolumeKg: totalVolume,
        ironEarned,
        prCount
      };

      // Auto-tick Kata's "Workouts/Yoga" habit if enabled!
      if (state.settings.syncToKataWorkoutHabit) {
        try {
          const todayStr = getTodayStr();
          const kataState = useKataStore.getState();
          const currentLog = kataState.dayLogs[todayStr];
          if (!currentLog || !currentLog.completedHabitIds.includes('habit-workout')) {
            kataState.toggleHabit('habit-workout', todayStr);
            kataState.addToast(
              'Kata Bridge Activated',
              '“Workout/Yoga” marked completed in Kata!',
              'success'
            );
          }
        } catch (e) {
          console.warn('Kata sync error', e);
        }
      }

      // Update Forge stats
      const nextTotalWorkouts = state.stats.totalWorkouts + 1;
      const nextIron = state.stats.iron + ironEarned;
      const nextVolume = state.stats.totalVolumeKg + totalVolume;
      const nextSets = state.stats.totalSets + totalCompletedSets;
      const nextHeat = Math.min(100, state.stats.heat + 25);

      // Rank progression based on Iron
      let nextRank: ForgeRank = 'Ember';
      if (nextIron >= 2000) nextRank = 'Titan';
      else if (nextIron >= 1200) nextRank = 'Inferno';
      else if (nextIron >= 750) nextRank = 'Blaze';
      else if (nextIron >= 400) nextRank = 'Flame';
      else if (nextIron >= 150) nextRank = 'Spark';

      set({
        workouts: [finalizedSession, ...state.workouts],
        activeWorkout: {
          isActive: false,
          session: null,
          elapsedSeconds: 0,
          isPaused: false,
          restTimer: {
            active: false,
            durationSeconds: 90,
            remainingSeconds: 0
          }
        },
        stats: {
          ...state.stats,
          iron: nextIron,
          heat: nextHeat,
          rank: nextRank,
          totalWorkouts: nextTotalWorkouts,
          totalVolumeKg: nextVolume,
          totalSets: nextSets,
          currentStreak: state.stats.currentStreak + 1
        }
      });

      persist();
      soundEngine.playAnvilHit();

      return { volumeKg: totalVolume, ironEarned, prCount };
    },

    updateSettings: (updates: Partial<ForgeSettings>) => {
      set(state => ({ settings: { ...state.settings, ...updates } }));
      persist();
    },

    resetForgeData: () => {
      const defaults = getInitialForgeState();
      set(defaults);
      persist();
    }
  };
});
