export type EquipmentId =
  | 'bodyweight'
  | 'pullup_bar'
  | 'dip_bars'
  | 'bands'
  | 'dumbbells'
  | 'weighted_vest'
  | 'bench'
  | 'kettlebell'
  | 'chair_table';

export interface EquipmentItem {
  id: EquipmentId;
  name: string;
  icon: string;
  category: 'core' | 'accessory' | 'improvised';
  description: string;
  substitutionTip: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

export type ExerciseCategory =
  | 'push'
  | 'pull'
  | 'legs'
  | 'core'
  | 'skills'
  | 'mobility';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  requiredEquipment: EquipmentId[];
  difficulty: ExerciseDifficulty;
  formCues: string[];
  progressionNextId?: string;
  regressionPrevId?: string;
  substitutionTips?: string;
  isCustom?: boolean;
}

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  reps: number;
  weightKg: number; // 0 for pure bodyweight, or added backpack / dumbbell weight
  tempo: string; // e.g. "Standard", "3-1-1-0", "Pause 2s", "Slow Eccentric"
  rpe: number; // 6 to 10
  completed: boolean;
  notes?: string;
}

export interface LoggedExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
  notes?: string;
  supersetGroupId?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  routineId?: string;
  startedAt: string; // ISO string
  completedAt?: string;
  durationSeconds: number;
  exercises: LoggedExercise[];
  totalVolumeKg: number;
  ironEarned: number;
  prCount: number;
  notes?: string;
}

export interface ActiveWorkoutState {
  isActive: boolean;
  session: WorkoutSession | null;
  elapsedSeconds: number;
  isPaused: boolean;
  restTimer: {
    active: boolean;
    durationSeconds: number;
    remainingSeconds: number;
    exerciseName?: string;
  };
}

export type ForgeRank = 'Ember' | 'Spark' | 'Flame' | 'Blaze' | 'Inferno' | 'Titan';

export interface ForgeUserStats {
  iron: number; // Permanent forge currency
  heat: number; // Weekly 0-100 meter
  heatDecayDays: number;
  rank: ForgeRank;
  totalWorkouts: number;
  totalVolumeKg: number;
  totalSets: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ForgeSettings {
  syncToKataWorkoutHabit: boolean; // Auto-tick "Workout/Yoga" habit in Kata
  soundEnabled: boolean;
  restTimerDuration: number; // Default in seconds e.g. 90
  restTimerVibrate: boolean;
  weightUnit: 'kg' | 'lbs';
  hideBodyMetrics: boolean;
}

export interface CalisthenicsSkillNode {
  id: string;
  tree: 'pushup' | 'pullup' | 'dip' | 'squat' | 'handstand' | 'lsit';
  name: string;
  level: number;
  description: string;
  unlockCriteria: string;
  exerciseId: string;
}

export interface ForgeRoutine {
  id: string;
  name: string;
  description: string;
  focus: string;
  daysPerWeek: number;
  requiredEquipment: EquipmentId[];
  exerciseIds: string[];
}
