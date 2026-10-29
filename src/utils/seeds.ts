import { DayLog, Habit, VoltronBlock } from '../types';
import { getTodayStr } from './dates';

export const SEED_HABITS: Habit[] = [
  {
    id: 'habit-animation',
    name: 'Animation',
    category: 'Craft',
    color: '#00e5a3', // Mint Green from Excel
    icon: 'Film',
    monthlyGoal: 21,
    scheduleDays: [1, 2, 3, 4, 5, 6],
    voltronSprintSlot: 'voltron-mon',
    order: 1,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-japanese',
    name: 'Japanese',
    category: 'Mind',
    color: '#38bdf8', // Sky Blue from Excel
    icon: 'Languages',
    monthlyGoal: 5,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 2,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-reading',
    name: 'Read a book chapter',
    category: 'Mind',
    color: '#6366f1', // Indigo Purple from Excel
    icon: 'BookOpen',
    monthlyGoal: 15,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    voltronSprintSlot: 'voltron-wed',
    order: 3,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-declutter',
    name: 'Declutter a space',
    category: 'Lifestyle',
    color: '#eab308', // Amber Yellow from Excel
    icon: 'Sparkles',
    monthlyGoal: 5,
    scheduleDays: [1, 3, 5, 6],
    order: 4,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-html',
    name: 'Learn HTML',
    category: 'Craft',
    color: '#f43f5e', // Coral Rose from Excel
    icon: 'Code',
    monthlyGoal: 20,
    scheduleDays: [1, 2, 4],
    voltronSprintSlot: 'voltron-mon',
    order: 5,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-java',
    name: 'Learn JAVA',
    category: 'Craft',
    color: '#06b6d4', // Cyan from Excel
    icon: 'Cpu',
    monthlyGoal: 10,
    scheduleDays: [1, 3, 5, 6],
    voltronSprintSlot: 'voltron-sat',
    order: 6,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-lpu',
    name: 'Learn LPU',
    category: 'Craft',
    color: '#3b82f6', // Light Blue from Excel
    icon: 'GraduationCap',
    monthlyGoal: 10,
    scheduleDays: [1, 2, 3, 4, 5],
    order: 7,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-workout',
    name: 'Workout/Yoga',
    category: 'Body',
    color: '#8b5cf6', // Indigo Violet from Excel
    icon: 'Dumbbell',
    monthlyGoal: 3,
    scheduleDays: [1, 2, 3, 4, 5, 6],
    order: 8,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-budget',
    name: 'Didn’t Use More than Daily Budget',
    category: 'Finance',
    color: '#f59e0b', // Amber Gold from Excel
    icon: 'Coins',
    monthlyGoal: 25,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 9,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-journal',
    name: 'Journal',
    category: 'Mind',
    color: '#fb923c', // Orange from Excel
    icon: 'PenTool',
    monthlyGoal: 4,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 10,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-bible',
    name: 'Bible',
    category: 'Mind',
    color: '#10b981', // Mint Emerald from Excel
    icon: 'Heart',
    monthlyGoal: 10,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 11,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-mods',
    name: 'Mods',
    category: 'Craft',
    color: '#14b8a6', // Cyan Teal from Excel
    icon: 'Gamepad2',
    monthlyGoal: 10,
    scheduleDays: [2, 4, 5, 6],
    voltronSprintSlot: 'voltron-fri',
    order: 12,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-sleep',
    name: 'Slept before 11:30',
    category: 'Body',
    color: '#a855f7', // Purple from Excel
    icon: 'Moon',
    monthlyGoal: 3,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 13,
    createdAt: '2026-08-01'
  },
  {
    id: 'habit-savings',
    name: 'Put $10 to savings (cu',
    category: 'Finance',
    color: '#4f46e5', // Deep Indigo from Excel
    icon: 'PiggyBank',
    monthlyGoal: 10,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 14,
    createdAt: '2026-08-01'
  }
];

export const SEED_TIMETABLE: VoltronBlock[] = [
  // Monday
  { id: 'mon-classes-1', dayOfWeek: 1, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'mon-lunch', dayOfWeek: 1, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'mon-classes-2', dayOfWeek: 1, startTime: '13:30', endTime: '15:00', title: 'Uni Labs / Tutorial', isVoltronSprint: false, color: '#334155' },
  { id: 'mon-workout', dayOfWeek: 1, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-mon', dayOfWeek: 1, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Code / Art / Animation', isVoltronSprint: true, linkedHabitId: 'habit-animation', color: '#00e5a3', description: 'Deep 2-Hour Focus: Keyframe animation & scene composition' },
  { id: 'mon-dinner', dayOfWeek: 1, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'mon-review', dayOfWeek: 1, startTime: '20:30', endTime: '22:00', title: 'Uni Review & Tomorrow Prep', isVoltronSprint: false, color: '#6366f1' },

  // Tuesday
  { id: 'tue-classes-1', dayOfWeek: 2, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'tue-lunch', dayOfWeek: 2, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'tue-workout', dayOfWeek: 2, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-tue', dayOfWeek: 2, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Guitar + FL Studio', isVoltronSprint: true, linkedHabitId: 'habit-declutter', color: '#a855f7', description: 'Chord progression mastery, synth design and track mastering' },
  { id: 'tue-dinner', dayOfWeek: 2, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'tue-review', dayOfWeek: 2, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Wednesday
  { id: 'wed-classes-1', dayOfWeek: 3, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'wed-lunch', dayOfWeek: 3, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'wed-workout', dayOfWeek: 3, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-wed', dayOfWeek: 3, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Writing & Lore', isVoltronSprint: true, linkedHabitId: 'habit-reading', color: '#eab308', description: 'Scriptwriting, anime lore building, world design notes' },
  { id: 'wed-dinner', dayOfWeek: 3, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'wed-review', dayOfWeek: 3, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Thursday
  { id: 'thu-classes-1', dayOfWeek: 4, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'thu-lunch', dayOfWeek: 4, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'thu-workout', dayOfWeek: 4, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-thu', dayOfWeek: 4, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Video Editing', isVoltronSprint: true, linkedHabitId: 'habit-animation', color: '#06b6d4', description: 'Timeline cutting, motion graphics, sound design sync' },
  { id: 'thu-dinner', dayOfWeek: 4, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'thu-review', dayOfWeek: 4, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Friday
  { id: 'fri-classes-1', dayOfWeek: 5, startTime: '09:00', endTime: '12:30', title: 'Classes & Projects', isVoltronSprint: false, color: '#334155' },
  { id: 'fri-lunch', dayOfWeek: 5, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'fri-workout', dayOfWeek: 5, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-fri', dayOfWeek: 5, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Creative Sandbox & Minecraft Mods', isVoltronSprint: true, linkedHabitId: 'habit-mods', color: '#14b8a6', description: 'Mod architecture, Java forge integration, custom items' },
  { id: 'fri-dinner', dayOfWeek: 5, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'fri-review', dayOfWeek: 5, startTime: '20:30', endTime: '22:00', title: 'Uni Review & Weekend Kickoff', isVoltronSprint: false, color: '#6366f1' },

  // Saturday
  { id: 'sat-morning', dayOfWeek: 6, startTime: '10:00', endTime: '12:00', title: 'Japanese Study & Kanji Drill', isVoltronSprint: false, linkedHabitId: 'habit-japanese', color: '#38bdf8' },
  { id: 'sat-lunch', dayOfWeek: 6, startTime: '12:30', endTime: '13:30', title: 'Lunch & Relax', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sat', dayOfWeek: 6, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Deep Code & Java Systems', isVoltronSprint: true, linkedHabitId: 'habit-java', color: '#06b6d4', description: 'Data structures, backend algorithms & game engine mechanics' },
  { id: 'sat-social', dayOfWeek: 6, startTime: '19:00', endTime: '22:00', title: 'Friends, Gaming & Anime Night', isVoltronSprint: false, color: '#f472b6' },

  // Sunday
  { id: 'sun-service', dayOfWeek: 0, startTime: '09:30', endTime: '12:00', title: 'Worship, Bible & Fellowship', isVoltronSprint: false, linkedHabitId: 'habit-bible', color: '#10b981' },
  { id: 'sun-lunch', dayOfWeek: 0, startTime: '12:30', endTime: '14:00', title: 'Family Lunch & Rest', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sun', dayOfWeek: 0, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Weekly Reset & Creative Lab', isVoltronSprint: true, linkedHabitId: 'habit-declutter', color: '#00e5a3', description: 'Workspace clean, schedule audit, creative experimentation' },
  { id: 'sun-prep', dayOfWeek: 0, startTime: '20:00', endTime: '21:30', title: 'Week Ahead Planning & Journaling', isVoltronSprint: false, linkedHabitId: 'habit-journal', color: '#fb923c' }
];

// Seed ONLY the exact checkmarks from the user's Excel sheet!
// Every other day is strictly 0 checkmarks!
export const generateSeedDayLogs = (): Record<string, DayLog> => {
  const logs: Record<string, DayLog> = {};

  // Exact checkmark mapping from the Excel sheet:
  const excelDayCheckmarks: Record<number, { habits: string[]; spent?: number }> = {
    10: {
      habits: ['habit-animation', 'habit-japanese', 'habit-declutter', 'habit-workout', 'habit-budget', 'habit-mods'] // 6 done
    },
    11: {
      habits: ['habit-japanese', 'habit-declutter', 'habit-lpu', 'habit-workout', 'habit-mods'] // 5 done
    },
    12: {
      habits: ['habit-japanese', 'habit-reading', 'habit-html', 'habit-workout', 'habit-budget', 'habit-mods'], // 6 done
      spent: 30
    },
    13: {
      habits: ['habit-japanese', 'habit-declutter', 'habit-workout', 'habit-budget', 'habit-mods', 'habit-sleep'], // 6 done
      spent: 0
    },
    19: {
      habits: ['habit-japanese', 'habit-declutter', 'habit-workout', 'habit-budget', 'habit-mods'] // 5 done
    },
    22: {
      habits: ['habit-japanese', 'habit-reading', 'habit-budget', 'habit-bible', 'habit-mods'], // 5 done
      spent: 25
    },
    23: {
      habits: ['habit-japanese', 'habit-java', 'habit-budget', 'habit-bible', 'habit-mods'] // 5 done
    },
    24: {
      habits: ['habit-journal'] // 1 done
    },
    25: {
      habits: ['habit-reading', 'habit-declutter', 'habit-workout', 'habit-budget', 'habit-bible', 'habit-mods', 'habit-sleep', 'habit-animation'], // 8 done
      spent: 25
    },
    26: {
      habits: ['habit-workout', 'habit-budget', 'habit-mods'], // 3 done
      spent: 55
    },
    27: {
      habits: ['habit-japanese', 'habit-declutter', 'habit-workout', 'habit-budget', 'habit-mods', 'habit-sleep'], // 6 done
      spent: 35
    },
    30: {
      habits: ['habit-animation', 'habit-japanese'] // 2 done
    }
  };

  // Populate for August 2026 (the exact month in the user's Excel) AND for the current month (October 2026)
  const targetMonths = ['2026-08', '2026-10'];

  targetMonths.forEach(yearMonth => {
    for (let d = 1; d <= 31; d++) {
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${yearMonth}-${dayStr}`;
      const entry = excelDayCheckmarks[d];

      logs[dateKey] = {
        date: dateKey,
        completedHabitIds: entry ? [...entry.habits] : [],
        amountSpent: entry?.spent !== undefined ? entry.spent : undefined,
        savingsDeposited: 0,
        mood: entry && entry.habits.length > 5 ? 'focused' : undefined,
        journalNote: entry ? `${entry.habits.length} habits completed.` : undefined
      };
    }
  });

  return logs;
};
