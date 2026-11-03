import { DayLog, Habit, VoltronBlock } from '../types';

export const SEED_HABITS: Habit[] = [
  {
    id: 'habit-workout',
    name: 'Workout / Physical Reset',
    category: 'Body',
    color: '#8b5cf6',
    icon: 'Dumbbell',
    monthlyGoal: 20,
    scheduleDays: [1, 2, 3, 4, 5, 6],
    order: 1,
    createdAt: '2026-11-01'
  },
  {
    id: 'habit-deep-focus',
    name: 'Deep Focus & Creative Practice',
    category: 'Craft',
    color: '#00e5a3',
    icon: 'Code',
    monthlyGoal: 20,
    scheduleDays: [1, 2, 3, 4, 5],
    voltronSprintSlot: 'voltron-mon',
    order: 2,
    createdAt: '2026-11-01'
  },
  {
    id: 'habit-reading',
    name: 'Read 20 Minutes',
    category: 'Mind',
    color: '#6366f1',
    icon: 'BookOpen',
    monthlyGoal: 15,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 3,
    createdAt: '2026-11-01'
  },
  {
    id: 'habit-sleep',
    name: 'Sleep by 11:30 PM',
    category: 'Body',
    color: '#a855f7',
    icon: 'Moon',
    monthlyGoal: 25,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 4,
    createdAt: '2026-11-01'
  }
];

export const SEED_TIMETABLE: VoltronBlock[] = [
  // Monday
  { id: 'mon-morning', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', title: 'Morning Routine & Planning', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'mon-deepwork', dayOfWeek: 1, startTime: '09:30', endTime: '12:30', title: 'Deep Work & Study Session', isVoltronSprint: false, color: '#334155' },
  { id: 'mon-lunch', dayOfWeek: 1, startTime: '12:30', endTime: '13:30', title: 'Lunch & Reset', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'mon-workout', dayOfWeek: 1, startTime: '16:00', endTime: '17:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-mon', dayOfWeek: 1, startTime: '17:00', endTime: '19:00', title: '⚡ Voltron Sprint: Deep Craft', isVoltronSprint: true, linkedHabitId: 'habit-deep-focus', color: '#00e5a3', description: '2-Hour Unbroken Focus' },
  { id: 'mon-review', dayOfWeek: 1, startTime: '21:00', endTime: '22:00', title: 'Day Review & Wind Down', isVoltronSprint: false, color: '#6366f1' },

  // Tuesday
  { id: 'tue-morning', dayOfWeek: 2, startTime: '08:00', endTime: '09:00', title: 'Morning Routine', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'tue-deepwork', dayOfWeek: 2, startTime: '09:30', endTime: '12:30', title: 'Deep Work & Study Session', isVoltronSprint: false, color: '#334155' },
  { id: 'tue-lunch', dayOfWeek: 2, startTime: '12:30', endTime: '13:30', title: 'Lunch & Reset', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'tue-workout', dayOfWeek: 2, startTime: '16:00', endTime: '17:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-tue', dayOfWeek: 2, startTime: '17:00', endTime: '19:00', title: '⚡ Voltron Sprint: Skill Mastery', isVoltronSprint: true, color: '#a855f7', description: 'Deep immersion & practice' },
  { id: 'tue-review', dayOfWeek: 2, startTime: '21:00', endTime: '22:00', title: 'Day Review & Wind Down', isVoltronSprint: false, color: '#6366f1' },

  // Wednesday
  { id: 'wed-morning', dayOfWeek: 3, startTime: '08:00', endTime: '09:00', title: 'Morning Routine', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'wed-deepwork', dayOfWeek: 3, startTime: '09:30', endTime: '12:30', title: 'Deep Work & Study Session', isVoltronSprint: false, color: '#334155' },
  { id: 'wed-lunch', dayOfWeek: 3, startTime: '12:30', endTime: '13:30', title: 'Lunch & Reset', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'wed-workout', dayOfWeek: 3, startTime: '16:00', endTime: '17:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-wed', dayOfWeek: 3, startTime: '17:00', endTime: '19:00', title: '⚡ Voltron Sprint: Reading & Lore', isVoltronSprint: true, linkedHabitId: 'habit-reading', color: '#eab308', description: 'Deep reading & synthesis' },
  { id: 'wed-review', dayOfWeek: 3, startTime: '21:00', endTime: '22:00', title: 'Day Review & Wind Down', isVoltronSprint: false, color: '#6366f1' },

  // Thursday
  { id: 'thu-morning', dayOfWeek: 4, startTime: '08:00', endTime: '09:00', title: 'Morning Routine', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'thu-deepwork', dayOfWeek: 4, startTime: '09:30', endTime: '12:30', title: 'Deep Work & Study Session', isVoltronSprint: false, color: '#334155' },
  { id: 'thu-lunch', dayOfWeek: 4, startTime: '12:30', endTime: '13:30', title: 'Lunch & Reset', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'thu-workout', dayOfWeek: 4, startTime: '16:00', endTime: '17:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-thu', dayOfWeek: 4, startTime: '17:00', endTime: '19:00', title: '⚡ Voltron Sprint: Creative Projects', isVoltronSprint: true, color: '#06b6d4', description: 'Project build session' },
  { id: 'thu-review', dayOfWeek: 4, startTime: '21:00', endTime: '22:00', title: 'Day Review & Wind Down', isVoltronSprint: false, color: '#6366f1' },

  // Friday
  { id: 'fri-morning', dayOfWeek: 5, startTime: '08:00', endTime: '09:00', title: 'Morning Routine', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'fri-deepwork', dayOfWeek: 5, startTime: '09:30', endTime: '12:30', title: 'Deep Work & Study Session', isVoltronSprint: false, color: '#334155' },
  { id: 'fri-lunch', dayOfWeek: 5, startTime: '12:30', endTime: '13:30', title: 'Lunch & Reset', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'fri-workout', dayOfWeek: 5, startTime: '16:00', endTime: '17:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#8b5cf6' },
  { id: 'voltron-fri', dayOfWeek: 5, startTime: '17:00', endTime: '19:00', title: '⚡ Voltron Sprint: Sandbox & Lab', isVoltronSprint: true, color: '#14b8a6', description: 'Experimentation & sandbox' },
  { id: 'fri-review', dayOfWeek: 5, startTime: '21:00', endTime: '22:00', title: 'Weekend Kickoff Review', isVoltronSprint: false, color: '#6366f1' },

  // Saturday
  { id: 'sat-morning', dayOfWeek: 6, startTime: '09:00', endTime: '11:00', title: 'Learning & Skill Drills', isVoltronSprint: false, color: '#38bdf8' },
  { id: 'sat-lunch', dayOfWeek: 6, startTime: '12:30', endTime: '13:30', title: 'Lunch & Relax', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sat', dayOfWeek: 6, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Deep Code & Systems', isVoltronSprint: true, color: '#06b6d4', description: 'System design & architecture' },
  { id: 'sat-social', dayOfWeek: 6, startTime: '19:00', endTime: '22:00', title: 'Social, Gaming & Chill', isVoltronSprint: false, color: '#f472b6' },

  // Sunday
  { id: 'sun-morning', dayOfWeek: 0, startTime: '09:30', endTime: '12:00', title: 'Rest, Fellowship & Meditation', isVoltronSprint: false, color: '#10b981' },
  { id: 'sun-lunch', dayOfWeek: 0, startTime: '12:30', endTime: '14:00', title: 'Lunch & Family Time', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sun', dayOfWeek: 0, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Weekly Reset & Planning', isVoltronSprint: true, color: '#00e5a3', description: 'Clean workspace & audit week ahead' },
  { id: 'sun-prep', dayOfWeek: 0, startTime: '20:00', endTime: '21:30', title: 'Week Ahead Preparation', isVoltronSprint: false, color: '#fb923c' }
];

export const generateSeedDayLogs = (): Record<string, DayLog> => {
  // Fresh clean logs for new users
  return {};
};
