import { create } from 'zustand';
import {
  ActiveWorkoutState,
  CindySession,
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
import { triggerAutoSync } from '../utils/cloudSync';

const FORGE_STORAGE_KEY = 'forge_fitness_state_v1';
const DELETED_RECORDS_KEY = 'forge_deleted_records_v1';

// Seed workouts: empty for fresh users, preserved locally if user has saved data
const SEED_WORKOUTS: WorkoutSession[] = [];

export interface ForgeState {
  deletedRecordIds: string[];
  equipment: EquipmentId[];
  onboardingCompleted: boolean;
  workouts: WorkoutSession[];
  cindySessions: CindySession[];
  activeWorkout: ActiveWorkoutState;
  customExercises: Exercise[];
  settings: ForgeSettings;
  stats: ForgeUserStats;

  // Actions
  setEquipment: (equipment: EquipmentId[]) => void;
  toggleEquipment: (eq: EquipmentId) => void;
  completeOnboarding: (equipment?: EquipmentId[]) => void;
  importCloudData: (cloudForge: any) => void;
  
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

  // Cindy Benchmark Execution
  recordCindySession: (cindySession: CindySession) => void;
  deleteCindySession: (id: string) => void;
  deleteWorkout: (id: string) => void;

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

const SEED_CINDY_SESSIONS: CindySession[] = [];

export const sanitizeWorkout = (w: any): WorkoutSession => ({
  id: w?.id || `workout-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  name: typeof w?.name === 'string' && w.name.trim() ? w.name : 'Forge Workout Session',
  routineId: w?.routineId,
  startedAt: typeof w?.startedAt === 'string' && w.startedAt ? w.startedAt : new Date().toISOString(),
  completedAt: w?.completedAt,
  durationSeconds: typeof w?.durationSeconds === 'number' && !isNaN(w.durationSeconds) ? Math.max(0, w.durationSeconds) : 0,
  totalVolumeKg: typeof w?.totalVolumeKg === 'number' && !isNaN(w.totalVolumeKg) ? Math.max(0, w.totalVolumeKg) : 0,
  ironEarned: typeof w?.ironEarned === 'number' && !isNaN(w.ironEarned) ? Math.max(0, w.ironEarned) : 50,
  prCount: typeof w?.prCount === 'number' && !isNaN(w.prCount) ? Math.max(0, w.prCount) : 0,
  notes: typeof w?.notes === 'string' ? w.notes : '',
  exercises: Array.isArray(w?.exercises) ? w.exercises.map((ex: any, exIdx: number) => ({
    id: ex?.id || `ex-${exIdx}-${Date.now()}`,
    exerciseId: ex?.exerciseId || ex?.id || 'unknown',
    name: typeof ex?.name === 'string' && ex.name.trim() ? ex.name : 'Exercise',
    notes: ex?.notes,
    supersetGroupId: ex?.supersetGroupId,
    sets: Array.isArray(ex?.sets) ? ex.sets.map((s: any, sIdx: number) => ({
      id: s?.id || `set-${sIdx}-${Date.now()}`,
      setNumber: typeof s?.setNumber === 'number' ? s.setNumber : sIdx + 1,
      type: s?.type || 'normal',
      reps: typeof s?.reps === 'number' && !isNaN(s.reps) ? Math.max(0, s.reps) : 0,
      weightKg: typeof s?.weightKg === 'number' && !isNaN(s.weightKg) ? Math.max(0, s.weightKg) : 0,
      tempo: typeof s?.tempo === 'string' ? s.tempo : 'Standard',
      rpe: typeof s?.rpe === 'number' ? s.rpe : 8,
      completed: Boolean(s?.completed),
      notes: s?.notes
    })) : []
  })) : []
});

const getInitialForgeState = () => {
  let initialDeleted: string[] = [];
  try {
    const rawDeleted = localStorage.getItem(DELETED_RECORDS_KEY);
    if (rawDeleted) {
      const parsed = JSON.parse(rawDeleted);
      if (Array.isArray(parsed)) initialDeleted = parsed;
    }
  } catch (e) {}

  let initialCindy = SEED_CINDY_SESSIONS;
  try {
    const savedCindy = localStorage.getItem('forge_cindy_sessions_v1');
    if (savedCindy) {
      const parsedCindy = JSON.parse(savedCindy);
      if (Array.isArray(parsedCindy)) {
        initialCindy = parsedCindy.filter((c: any) => c && c.id && !initialDeleted.includes(c.id));
      }
    }
  } catch (e) {}

  const defaultState = {
    deletedRecordIds: initialDeleted,
    equipment: ['bodyweight', 'pullup_bar', 'chair_table'] as EquipmentId[],
    onboardingCompleted: false,
    workouts: SEED_WORKOUTS,
    cindySessions: initialCindy,
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
      iron: 0,
      heat: 0,
      heatDecayDays: 0,
      rank: 'Spark' as ForgeRank,
      totalWorkouts: 0,
      totalVolumeKg: 0,
      totalSets: 0,
      currentStreak: 0,
      longestStreak: 0
    }
  };

  try {
    const rawSaved = localStorage.getItem(FORGE_STORAGE_KEY)
      || localStorage.getItem('forge_fitness_state_backup');
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && typeof parsed === 'object') {
        const deletedRecordIds = Array.from(new Set([
          ...initialDeleted,
          ...(Array.isArray(parsed.deletedRecordIds) ? parsed.deletedRecordIds : [])
        ]));

        const savedWorkouts = Array.isArray(parsed.workouts)
          ? parsed.workouts
              .filter((w: any) => w && w.id && !deletedRecordIds.includes(w.id))
              .map(sanitizeWorkout)
          : defaultState.workouts.filter(w => !deletedRecordIds.includes(w.id));

        const savedCindy = Array.isArray(parsed.cindySessions)
          ? parsed.cindySessions.filter((c: any) => c && c.id && !deletedRecordIds.includes(c.id))
          : initialCindy.filter(c => !deletedRecordIds.includes(c.id));

        return {
          ...defaultState,
          ...parsed,
          deletedRecordIds,
          equipment: Array.isArray(parsed.equipment) ? parsed.equipment : defaultState.equipment,
          workouts: savedWorkouts,
          cindySessions: savedCindy,
          customExercises: Array.isArray(parsed.customExercises) ? parsed.customExercises : defaultState.customExercises,
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          stats: {
            ...defaultState.stats,
            ...(parsed.stats || {}),
            iron: typeof parsed.stats?.iron === 'number' && !isNaN(parsed.stats.iron) ? parsed.stats.iron : defaultState.stats.iron,
            heat: typeof parsed.stats?.heat === 'number' && !isNaN(parsed.stats.heat) ? parsed.stats.heat : defaultState.stats.heat,
            totalWorkouts: typeof parsed.stats?.totalWorkouts === 'number' && !isNaN(parsed.stats.totalWorkouts) ? parsed.stats.totalWorkouts : defaultState.stats.totalWorkouts,
            totalVolumeKg: typeof parsed.stats?.totalVolumeKg === 'number' && !isNaN(parsed.stats.totalVolumeKg) ? parsed.stats.totalVolumeKg : defaultState.stats.totalVolumeKg,
            totalSets: typeof parsed.stats?.totalSets === 'number' && !isNaN(parsed.stats.totalSets) ? parsed.stats.totalSets : defaultState.stats.totalSets,
            currentStreak: typeof parsed.stats?.currentStreak === 'number' && !isNaN(parsed.stats.currentStreak) ? parsed.stats.currentStreak : defaultState.stats.currentStreak,
            longestStreak: typeof parsed.stats?.longestStreak === 'number' && !isNaN(parsed.stats.longestStreak) ? parsed.stats.longestStreak : defaultState.stats.longestStreak,
            rank: parsed.stats?.rank || defaultState.stats.rank
          },
          onboardingCompleted: Boolean(parsed.onboardingCompleted),
          activeWorkout: parsed.activeWorkout?.isActive ? parsed.activeWorkout : defaultState.activeWorkout
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
        deletedRecordIds: state.deletedRecordIds || [],
        equipment: state.equipment,
        onboardingCompleted: state.onboardingCompleted,
        workouts: (state.workouts || []).filter(w => !(state.deletedRecordIds || []).includes(w.id)),
        cindySessions: (state.cindySessions || []).filter(c => !(state.deletedRecordIds || []).includes(c.id)),
        activeWorkout: state.activeWorkout,
        customExercises: state.customExercises,
        settings: state.settings,
        stats: state.stats
      };
      const jsonStr = JSON.stringify(toSave);
      localStorage.setItem(FORGE_STORAGE_KEY, jsonStr);
      localStorage.setItem('forge_fitness_state_backup', jsonStr);
      localStorage.setItem(DELETED_RECORDS_KEY, JSON.stringify(state.deletedRecordIds || []));
      if (Array.isArray(state.cindySessions)) {
        localStorage.setItem('forge_cindy_sessions_v1', JSON.stringify(toSave.cindySessions));
      }
      if (typeof window !== 'undefined') {
        fetch('/api/forge-storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonStr
        }).catch(() => {});
      }

      // Automatically queue background push to Supabase
      triggerAutoSync();
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

      persist();
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
      persist();
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
      persist();
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
      persist();
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
      persist();
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
      persist();
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
      persist();

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
      persist();
    },

    recordCindySession: (cindySession: CindySession) => {
      const state = get();
      const nextCindyList = [cindySession, ...state.cindySessions.filter(c => c.id !== cindySession.id)];

      // Synthesize a full WorkoutSession so Cindy integrates seamlessly into PRs, calendar, and stats
      const cindyVolume = (cindySession.pullupsCount * 50) + (cindySession.pushupsCount * 50) + (cindySession.squatsCount * 50);
      const ironEarned = 150 + (cindySession.isPr ? 50 : 0);
      const totalCindySets = (cindySession.rounds * 3) + (cindySession.partialReps > 0 ? 1 : 0);

      const cindyWorkout: WorkoutSession = {
        id: cindySession.id,
        name: `Cindy AMRAP Benchmark (${cindySession.rounds} Rds + ${cindySession.partialReps} Reps)`,
        startedAt: cindySession.date,
        completedAt: cindySession.date,
        durationSeconds: cindySession.durationSeconds,
        totalVolumeKg: cindyVolume,
        ironEarned,
        prCount: cindySession.isPr ? 1 : 0,
        notes: cindySession.notes || 'Cindy 20-min AMRAP benchmark completed.',
        exercises: [
          {
            id: `cindy-pu-${cindySession.id}`,
            exerciseId: 'pullup-strict',
            name: 'Strict Pull-up (Overhand)',
            sets: [
              {
                id: `s-pu-${cindySession.id}`,
                setNumber: 1,
                type: 'normal',
                reps: cindySession.pullupsCount,
                weightKg: 0,
                tempo: 'AMRAP',
                rpe: 10,
                completed: true
              }
            ]
          },
          {
            id: `cindy-push-${cindySession.id}`,
            exerciseId: 'pushup-standard',
            name: 'Standard Push-up',
            sets: [
              {
                id: `s-push-${cindySession.id}`,
                setNumber: 1,
                type: 'normal',
                reps: cindySession.pushupsCount,
                weightKg: 0,
                tempo: 'AMRAP',
                rpe: 10,
                completed: true
              }
            ]
          },
          {
            id: `cindy-sq-${cindySession.id}`,
            exerciseId: 'squat-bodyweight',
            name: 'Bodyweight Squat',
            sets: [
              {
                id: `s-sq-${cindySession.id}`,
                setNumber: 1,
                type: 'normal',
                reps: cindySession.squatsCount,
                weightKg: 0,
                tempo: 'AMRAP',
                rpe: 10,
                completed: true
              }
            ]
          }
        ]
      };

      // Auto-tick Kata's "Workouts/Yoga" habit if enabled
      if (state.settings.syncToKataWorkoutHabit) {
        try {
          const todayStr = getTodayStr();
          const kataState = useKataStore.getState();
          const workoutHabit = kataState.habits.find(h =>
            h.id === 'habit-workout' ||
            h.name.toLowerCase().includes('workout') ||
            h.name.toLowerCase().includes('yoga')
          );
          if (workoutHabit) {
            const currentLog = kataState.dayLogs[todayStr];
            if (!currentLog || !currentLog.completedHabitIds.includes(workoutHabit.id)) {
              kataState.toggleHabit(workoutHabit.id, todayStr);
              kataState.addToast(
                'Cindy Benchmark Saved!',
                '“Workout/Yoga” automatically checked off in Kata!',
                'success'
              );
            }
          }
        } catch (e) {
          console.warn('Kata sync error from Cindy', e);
        }
      }

      set({
        cindySessions: nextCindyList,
        workouts: [cindyWorkout, ...state.workouts.filter(w => w.id !== cindySession.id)],
        stats: {
          ...state.stats,
          iron: state.stats.iron + ironEarned,
          totalWorkouts: state.stats.totalWorkouts + 1,
          totalVolumeKg: state.stats.totalVolumeKg + cindyVolume,
          totalSets: state.stats.totalSets + totalCindySets,
          heat: Math.min(100, state.stats.heat + 25)
        }
      });

      persist();
    },

    deleteCindySession: (id: string) => {
      set(state => {
        const nextDeleted = Array.from(new Set([...(state.deletedRecordIds || []), id]));
        try {
          localStorage.setItem(DELETED_RECORDS_KEY, JSON.stringify(nextDeleted));
        } catch (e) {}

        return {
          cindySessions: (state.cindySessions || []).filter(c => c.id !== id),
          workouts: (state.workouts || []).filter(w => w.id !== id),
          deletedRecordIds: nextDeleted,
          stats: {
            ...state.stats,
            totalWorkouts: Math.max(0, state.stats.totalWorkouts - 1)
          }
        };
      });
      persist();
      triggerAutoSync(0);
    },

    deleteWorkout: (id: string) => {
      set(state => {
        const target = state.workouts.find(w => w.id === id);
        const nextWorkouts = state.workouts.filter(w => w.id !== id);
        const nextCindy = state.cindySessions.filter(c => c.id !== id);
        const nextDeleted = Array.from(new Set([...(state.deletedRecordIds || []), id]));

        try {
          localStorage.setItem(DELETED_RECORDS_KEY, JSON.stringify(nextDeleted));
        } catch (e) {}

        const volumeToSubtract = target?.totalVolumeKg || 0;
        const ironToSubtract = target?.ironEarned || 0;
        let setsToSubtract = 0;
        if (target && Array.isArray(target.exercises)) {
          target.exercises.forEach(ex => {
            if (Array.isArray(ex.sets)) {
              setsToSubtract += ex.sets.filter(s => s.completed).length;
            }
          });
        }

        return {
          workouts: nextWorkouts,
          cindySessions: nextCindy,
          deletedRecordIds: nextDeleted,
          stats: {
            ...state.stats,
            totalWorkouts: Math.max(0, state.stats.totalWorkouts - 1),
            totalVolumeKg: Math.max(0, state.stats.totalVolumeKg - volumeToSubtract),
            totalSets: Math.max(0, state.stats.totalSets - setsToSubtract),
            iron: Math.max(0, state.stats.iron - ironToSubtract)
          }
        };
      });
      persist();
      triggerAutoSync(0);
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

      // Compute total volume & total completed sets, ensuring any set with reps > 0 is marked completed
      let totalVolume = 0;
      let totalCompletedSets = 0;

      const finalizedExercises = session.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => {
          const isDone = s.completed || s.reps > 0;
          if (isDone) {
            totalCompletedSets++;
            const effectiveWeight = s.weightKg > 0 ? s.weightKg : 50;
            totalVolume += s.reps * effectiveWeight;
          }
          return { ...s, completed: isDone };
        })
      }));

      // Calculate Iron earned: +50 base for workout, +5 per set, +25 PR bonus
      const prCount = Math.floor(totalCompletedSets / 4) + 1; // Simulated PRs based on hard sets
      const ironEarned = 50 + totalCompletedSets * 5 + prCount * 25;

      const finalizedSession: WorkoutSession = {
        ...session,
        completedAt,
        durationSeconds: state.activeWorkout.elapsedSeconds,
        exercises: finalizedExercises,
        totalVolumeKg: totalVolume,
        ironEarned,
        prCount
      };

      // Auto-tick Kata's "Workouts/Yoga" habit if enabled!
      if (state.settings.syncToKataWorkoutHabit) {
        try {
          const todayStr = getTodayStr();
          const kataState = useKataStore.getState();
          const workoutHabit = kataState.habits.find(h =>
            h.id === 'habit-workout' ||
            h.name.toLowerCase().includes('workout') ||
            h.name.toLowerCase().includes('yoga')
          );
          if (workoutHabit) {
            const currentLog = kataState.dayLogs[todayStr];
            if (!currentLog || !currentLog.completedHabitIds.includes(workoutHabit.id)) {
              kataState.toggleHabit(workoutHabit.id, todayStr);
              kataState.addToast(
                'Kata Bridge Activated',
                '“Workout/Yoga” marked completed in Kata!',
                'success'
              );
            }
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

    importCloudData: (cloudForge: any) => {
      if (!cloudForge || typeof cloudForge !== 'object') return;
      const state = get();
      const currentDeleted = state.deletedRecordIds || [];
      const cloudDeleted = Array.isArray(cloudForge.deletedRecordIds) ? cloudForge.deletedRecordIds : [];
      const mergedDeleted = Array.from(new Set([...currentDeleted, ...cloudDeleted]));

      try {
        localStorage.setItem(DELETED_RECORDS_KEY, JSON.stringify(mergedDeleted));
      } catch (e) {}

      const incomingWorkouts = Array.isArray(cloudForge.workouts)
        ? cloudForge.workouts
            .filter((w: any) => w && w.id && !mergedDeleted.includes(w.id))
            .map(sanitizeWorkout)
        : state.workouts.filter(w => !mergedDeleted.includes(w.id));

      const incomingCindy = Array.isArray(cloudForge.cindySessions)
        ? cloudForge.cindySessions
            .filter((c: any) => c && c.id && !mergedDeleted.includes(c.id))
        : state.cindySessions.filter(c => !mergedDeleted.includes(c.id));

      set({
        deletedRecordIds: mergedDeleted,
        equipment: Array.isArray(cloudForge.equipment) && cloudForge.equipment.length > 0 ? cloudForge.equipment : state.equipment,
        workouts: incomingWorkouts,
        cindySessions: incomingCindy,
        customExercises: Array.isArray(cloudForge.customExercises) ? cloudForge.customExercises : state.customExercises,
        settings: { ...state.settings, ...(cloudForge.settings || {}) },
        stats: {
          ...state.stats,
          ...(cloudForge.stats || {}),
          totalWorkouts: Math.max(0, incomingWorkouts.length)
        }
      });

      persist();

      // If cloud had items that were marked deleted locally, sync clean state to cloud immediately
      const cloudHadDeletedWorkouts = Array.isArray(cloudForge.workouts) && cloudForge.workouts.some((w: any) => mergedDeleted.includes(w?.id));
      const cloudHadDeletedCindy = Array.isArray(cloudForge.cindySessions) && cloudForge.cindySessions.some((c: any) => mergedDeleted.includes(c?.id));
      if (cloudHadDeletedWorkouts || cloudHadDeletedCindy) {
        triggerAutoSync(0);
      }
    },

    resetForgeData: () => {
      try {
        localStorage.removeItem(DELETED_RECORDS_KEY);
      } catch (e) {}
      const defaults = getInitialForgeState();
      set({ ...defaults, deletedRecordIds: [] });
      persist();
    }
  };
});

// Auto-sync with disk file forge_data.json on startup
if (typeof window !== 'undefined') {
  fetch('/api/forge-storage')
    .then(res => {
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) return null;
      return res.json();
    })
    .then(diskData => {
      if (diskData && typeof diskData === 'object') {
        const state = useForgeStore.getState();
        const deleted = state.deletedRecordIds || [];

        // Filter disk workouts & Cindy against tombstones
        const diskWorkouts = Array.isArray(diskData.workouts)
          ? diskData.workouts.filter((w: any) => w && w.id && !deleted.includes(w.id)).map(sanitizeWorkout)
          : [];
        const diskCindy = Array.isArray(diskData.cindySessions)
          ? diskData.cindySessions.filter((c: any) => c && c.id && !deleted.includes(c.id))
          : [];

        // Only adopt from disk if local is completely empty and no deletions have occurred
        const shouldAdoptWorkouts = state.workouts.length === 0 && deleted.length === 0 && diskWorkouts.length > 0;
        const shouldAdoptCindy = state.cindySessions.length === 0 && deleted.length === 0 && diskCindy.length > 0;

        if (shouldAdoptWorkouts || shouldAdoptCindy) {
          useForgeStore.setState({
            ...(shouldAdoptWorkouts ? { workouts: diskWorkouts } : {}),
            ...(shouldAdoptCindy ? { cindySessions: diskCindy } : {})
          });
        }
      }
    })
    .catch(() => {});
}
