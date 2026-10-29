import { DayLog, Habit, VoltronBlock } from '../types';
import { getTodayStr, getPastDays } from './dates';

export const SEED_HABITS: Habit[] = [
  {
    id: 'habit-animation',
    name: 'Animation',
    category: 'Craft',
    color: '#ff6b8b', // Coral
    icon: 'Film',
    monthlyGoal: 20,
    scheduleDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    voltronSprintSlot: 'voltron-mon',
    order: 1,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-japanese',
    name: 'Japanese',
    category: 'Mind',
    color: '#6366f1', // Indigo
    icon: 'Languages',
    monthlyGoal: 25,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6], // Daily
    order: 2,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-reading',
    name: 'Read a book chapter',
    category: 'Mind',
    color: '#ffb300', // Amber
    icon: 'BookOpen',
    monthlyGoal: 22,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    voltronSprintSlot: 'voltron-wed',
    order: 3,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-declutter',
    name: 'Declutter a space',
    category: 'Lifestyle',
    color: '#00e5a3', // Mint
    icon: 'Sparkles',
    monthlyGoal: 18,
    scheduleDays: [1, 3, 5, 6],
    order: 4,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-html',
    name: 'Learn HTML',
    category: 'Craft',
    color: '#00f2fe', // Cyan
    icon: 'Code',
    monthlyGoal: 16,
    scheduleDays: [1, 2, 4],
    voltronSprintSlot: 'voltron-mon',
    order: 5,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-java',
    name: 'Learn Java',
    category: 'Craft',
    color: '#818cf8', // Indigo light
    icon: 'Cpu',
    monthlyGoal: 20,
    scheduleDays: [1, 3, 5, 6],
    voltronSprintSlot: 'voltron-sat',
    order: 6,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-workout',
    name: 'Workout/Yoga',
    category: 'Body',
    color: '#f43f5e', // Rose/Coral
    icon: 'Dumbbell',
    monthlyGoal: 20,
    scheduleDays: [1, 2, 3, 4, 5, 6],
    order: 7,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-journal',
    name: 'Journal',
    category: 'Mind',
    color: '#a855f7', // Purple
    icon: 'PenTool',
    monthlyGoal: 26,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 8,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-bible',
    name: 'Bible',
    category: 'Mind',
    color: '#f59e0b', // Amber/Gold
    icon: 'Heart',
    monthlyGoal: 28,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 9,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-minecraft',
    name: 'Minecraft Mods',
    category: 'Craft',
    color: '#10b981', // Emerald Mint
    icon: 'Gamepad2',
    monthlyGoal: 14,
    scheduleDays: [2, 4, 5, 6],
    voltronSprintSlot: 'voltron-fri',
    order: 10,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-sleep',
    name: 'Sleep before 11:30',
    category: 'Body',
    color: '#06b6d4', // Teal Cyan
    icon: 'Moon',
    monthlyGoal: 25,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 11,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-budget',
    name: 'Don’t spend more than daily budget',
    category: 'Finance',
    color: '#eab308', // Amber
    icon: 'Coins',
    monthlyGoal: 26,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 12,
    createdAt: '2026-10-01'
  },
  {
    id: 'habit-savings',
    name: 'Put $10 to savings',
    category: 'Finance',
    color: '#14b8a6', // Mint Teal
    icon: 'PiggyBank',
    monthlyGoal: 24,
    scheduleDays: [0, 1, 2, 3, 4, 5, 6],
    order: 13,
    createdAt: '2026-10-01'
  }
];

export const SEED_TIMETABLE: VoltronBlock[] = [
  // Monday
  { id: 'mon-classes-1', dayOfWeek: 1, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'mon-lunch', dayOfWeek: 1, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'mon-classes-2', dayOfWeek: 1, startTime: '13:30', endTime: '15:00', title: 'Uni Labs / Tutorial', isVoltronSprint: false, color: '#334155' },
  { id: 'mon-workout', dayOfWeek: 1, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#f43f5e' },
  { id: 'voltron-mon', dayOfWeek: 1, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Code / Art / Animation', isVoltronSprint: true, linkedHabitId: 'habit-animation', color: '#ff6b8b', description: 'Deep 2-Hour Focus: Keyframe animation & scene composition' },
  { id: 'mon-dinner', dayOfWeek: 1, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'mon-review', dayOfWeek: 1, startTime: '20:30', endTime: '22:00', title: 'Uni Review & Tomorrow Prep', isVoltronSprint: false, color: '#6366f1' },

  // Tuesday
  { id: 'tue-classes-1', dayOfWeek: 2, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'tue-lunch', dayOfWeek: 2, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'tue-workout', dayOfWeek: 2, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#f43f5e' },
  { id: 'voltron-tue', dayOfWeek: 2, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Guitar + FL Studio', isVoltronSprint: true, linkedHabitId: 'habit-declutter', color: '#a855f7', description: 'Chord progression mastery, synth design and track mastering' },
  { id: 'tue-dinner', dayOfWeek: 2, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'tue-review', dayOfWeek: 2, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Wednesday
  { id: 'wed-classes-1', dayOfWeek: 3, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'wed-lunch', dayOfWeek: 3, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'wed-workout', dayOfWeek: 3, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#f43f5e' },
  { id: 'voltron-wed', dayOfWeek: 3, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Writing & Lore', isVoltronSprint: true, linkedHabitId: 'habit-reading', color: '#ffb300', description: 'Scriptwriting, anime lore building, world design notes' },
  { id: 'wed-dinner', dayOfWeek: 3, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'wed-review', dayOfWeek: 3, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Thursday
  { id: 'thu-classes-1', dayOfWeek: 4, startTime: '09:00', endTime: '12:30', title: 'Classes & Uni Lectures', isVoltronSprint: false, color: '#334155' },
  { id: 'thu-lunch', dayOfWeek: 4, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'thu-workout', dayOfWeek: 4, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#f43f5e' },
  { id: 'voltron-thu', dayOfWeek: 4, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Video Editing', isVoltronSprint: true, linkedHabitId: 'habit-animation', color: '#00f2fe', description: 'Timeline cutting, motion graphics, sound design sync' },
  { id: 'thu-dinner', dayOfWeek: 4, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'thu-review', dayOfWeek: 4, startTime: '20:30', endTime: '22:00', title: 'Uni Review', isVoltronSprint: false, color: '#6366f1' },

  // Friday
  { id: 'fri-classes-1', dayOfWeek: 5, startTime: '09:00', endTime: '12:30', title: 'Classes & Projects', isVoltronSprint: false, color: '#334155' },
  { id: 'fri-lunch', dayOfWeek: 5, startTime: '12:30', endTime: '13:30', title: 'Lunch & Malayalam Break', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'fri-workout', dayOfWeek: 5, startTime: '15:00', endTime: '16:00', title: 'Workout / Physical Reset', isVoltronSprint: false, linkedHabitId: 'habit-workout', color: '#f43f5e' },
  { id: 'voltron-fri', dayOfWeek: 5, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Creative Sandbox & Minecraft Mods', isVoltronSprint: true, linkedHabitId: 'habit-minecraft', color: '#00e5a3', description: 'Mod architecture, Java forge integration, custom items' },
  { id: 'fri-dinner', dayOfWeek: 5, startTime: '18:30', endTime: '20:00', title: 'Dinner & Social Time', isVoltronSprint: false, color: '#10b981' },
  { id: 'fri-review', dayOfWeek: 5, startTime: '20:30', endTime: '22:00', title: 'Uni Review & Weekend Kickoff', isVoltronSprint: false, color: '#6366f1' },

  // Saturday
  { id: 'sat-morning', dayOfWeek: 6, startTime: '10:00', endTime: '12:00', title: 'Japanese Study & Kanji Drill', isVoltronSprint: false, linkedHabitId: 'habit-japanese', color: '#6366f1' },
  { id: 'sat-lunch', dayOfWeek: 6, startTime: '12:30', endTime: '13:30', title: 'Lunch & Relax', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sat', dayOfWeek: 6, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Deep Code & Java Systems', isVoltronSprint: true, linkedHabitId: 'habit-java', color: '#818cf8', description: 'Data structures, backend algorithms & game engine mechanics' },
  { id: 'sat-social', dayOfWeek: 6, startTime: '19:00', endTime: '22:00', title: 'Friends, Gaming & Anime Night', isVoltronSprint: false, color: '#f472b6' },

  // Sunday
  { id: 'sun-service', dayOfWeek: 0, startTime: '09:30', endTime: '12:00', title: 'Worship, Bible & Fellowship', isVoltronSprint: false, linkedHabitId: 'habit-bible', color: '#f59e0b' },
  { id: 'sun-lunch', dayOfWeek: 0, startTime: '12:30', endTime: '14:00', title: 'Family Lunch & Rest', isVoltronSprint: false, color: '#0ea5e9' },
  { id: 'voltron-sun', dayOfWeek: 0, startTime: '16:00', endTime: '18:00', title: '⚡ Voltron Sprint: Weekly Reset & Creative Lab', isVoltronSprint: true, linkedHabitId: 'habit-declutter', color: '#00e5a3', description: 'Workspace clean, schedule audit, creative experimentation' },
  { id: 'sun-prep', dayOfWeek: 0, startTime: '20:00', endTime: '21:30', title: 'Week Ahead Planning & Journaling', isVoltronSprint: false, linkedHabitId: 'habit-journal', color: '#a855f7' }
];

export const generateSeedDayLogs = (): Record<string, DayLog> => {
  const pastDates = getPastDays(28); // 4 weeks of rich history
  const logs: Record<string, DayLog> = {};
  const todayStr = getTodayStr();

  const habitPool = [
    'habit-animation',
    'habit-japanese',
    'habit-reading',
    'habit-declutter',
    'habit-html',
    'habit-java',
    'habit-workout',
    'habit-journal',
    'habit-bible',
    'habit-minecraft',
    'habit-sleep',
    'habit-budget',
    'habit-savings'
  ];

  const moods: DayLog['mood'][] = ['zen', 'energized', 'calm', 'focused', 'inspired', 'focused'];
  const notes = [
    'Crushed the Voltron sprint! Keyframe transitions are coming together.',
    'Solid workout session today. Felt grounded and sharp.',
    'Japanese kanji review felt effortless. 30 new flashcards cleared.',
    'FL Studio chords hit just right today. Melody locked in.',
    'Quiet evening of reading and reflection. Good mental clarity.',
    'Java algorithm problem finally solved after 2 hours of debugging.',
    'Clean desk, clean mind. Budget strictly maintained under limit.'
  ];

  pastDates.forEach((dateStr, index) => {
    // Generate realistic completion pattern: higher consistency in recent days
    const isToday = dateStr === todayStr;
    const completionRate = isToday ? 0.72 : 0.65 + Math.sin(index * 0.7) * 0.22;
    const completedCount = Math.max(3, Math.min(habitPool.length, Math.floor(habitPool.length * completionRate)));

    // Pick habits
    const shuffled = [...habitPool].sort((a, b) => (a.charCodeAt(a.length - 1) + index) % 7 - (b.charCodeAt(b.length - 1) + index) % 7);
    const completed = shuffled.slice(0, completedCount);

    // Make sure Bible, Journal and Savings are fairly frequent
    if (!completed.includes('habit-bible') && index % 2 === 0) completed.push('habit-bible');
    if (!completed.includes('habit-savings') && index % 3 !== 0) completed.push('habit-savings');

    const spent = Math.floor(12 + (index % 5) * 8.5);
    const saved = completed.includes('habit-savings') ? 10 : 0;

    logs[dateStr] = {
      date: dateStr,
      completedHabitIds: completed,
      amountSpent: spent,
      savingsDeposited: saved,
      mood: moods[index % moods.length],
      journalNote: notes[index % notes.length]
    };
  });

  return logs;
};
