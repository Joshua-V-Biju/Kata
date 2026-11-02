import { create } from 'zustand';
import { AppSettings, Badge, DailyQuest, DailyTask, DayLog, Habit, ToastMessage, UserStats, VoltronBlock } from '../types';
import { getTodayStr, isWeekend, getDayOfWeekIndex } from '../utils/dates';
import { fireCheckmarkConfetti, fireLevelUpConfetti } from '../utils/confetti';
import { soundEngine } from '../utils/sound';
import { generateDailyQuests, getRankInfo, getXpForLevel, INITIAL_BADGES } from '../utils/gamification';
import { generateSeedDayLogs, SEED_HABITS, SEED_TIMETABLE } from '../utils/seeds';
import { getDailyQuote, getRandomQuote, MotivationQuote } from '../utils/quotes';

const LOCAL_STORAGE_KEY = 'kata_habit_app_state_v3';

export interface SprintTimerState {
  active: boolean;
  blockId: string | null;
  remainingSeconds: number;
  totalSeconds: number;
  isPaused: boolean;
}

export interface LevelUpModalState {
  show: boolean;
  newLevel: number;
  rankTitle: string;
  rankKanji: string;
}

interface KataState {
  habits: Habit[];
  dayLogs: Record<string, DayLog>;
  timetable: VoltronBlock[];
  badges: Badge[];
  userStats: UserStats;
  selectedDate: string;
  settings: AppSettings;
  dailyQuests: DailyQuest[];
  comboMultiplier: number;
  toasts: ToastMessage[];
  sprintTimer: SprintTimerState;
  levelUpModal: LevelUpModalState;
  lastSeenQuoteDate: string;
  showDailyQuoteModal: boolean;
  currentQuote: MotivationQuote;

  // Actions
  setSelectedDate: (date: string) => void;
  toggleHabit: (habitId: string, dateStr?: string) => void;
  completeVoltronSprint: (blockId: string) => void;
  
  // Daily Motivation Quote
  openDailyQuoteModal: () => void;
  closeDailyQuoteModal: (markSeen?: boolean) => void;
  rollNewQuote: () => void;
  
  // Habit Management
  addHabit: (habit: Omit<Habit, 'id' | 'order' | 'createdAt'>) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabit: (id: string, direction: 'up' | 'down') => void;

  // Journal & Expenses
  setDayMoodAndNote: (date: string, mood?: DayLog['mood'], note?: string) => void;
  setDaySpending: (date: string, spent?: number | null, savings?: number | null) => void;

  // Daily Tasks
  addDailyTask: (date: string, text: string) => void;
  toggleDailyTask: (date: string, taskId: string) => void;
  deleteDailyTask: (date: string, taskId: string) => void;
  editDailyTask: (date: string, taskId: string, text: string) => void;
  clearCompletedDailyTasks: (date: string) => void;

  // Timetable
  addTimetableBlock: (block: Omit<VoltronBlock, 'id'>) => void;
  updateTimetableBlock: (block: VoltronBlock) => void;
  deleteTimetableBlock: (id: string) => void;

  // Sprint Focus Timer
  startSprintTimer: (blockId: string, durationMinutes?: number) => void;
  pauseSprintTimer: () => void;
  resumeSprintTimer: () => void;
  resetSprintTimer: () => void;
  tickSprintTimer: () => void;

  // Settings & System
  updateSettings: (updates: Partial<AppSettings>) => void;
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  closeLevelUpModal: () => void;
  resetToSeedData: () => void;
  importBackupData: (importedData: any) => void;
}

// Compute active streak (consecutive days with at least 1 completed habit)
const calculateStreak = (logs: Record<string, DayLog>, today: string, preservedStreak: number = 0): { current: number; longest: number } => {
  let current = 0;
  let datePointer = new Date(today);

  // Check if today has completions; if not, check from yesterday
  const todayLog = logs[today];
  if (!todayLog || todayLog.completedHabitIds.length === 0) {
    datePointer.setDate(datePointer.getDate() - 1);
  }

  while (true) {
    const y = datePointer.getFullYear();
    const m = String(datePointer.getMonth() + 1).padStart(2, '0');
    const d = String(datePointer.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    const log = logs[key];
    if (log && log.completedHabitIds.length > 0) {
      current++;
      datePointer.setDate(datePointer.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest
  const allDates = Object.keys(logs).sort();
  let longest = current;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dateKey of allDates) {
    if (logs[dateKey].completedHabitIds.length > 0) {
      const [y, m, d] = dateKey.split('-').map(Number);
      const curr = new Date(y, m - 1, d);
      if (prevDate) {
        const diffDays = Math.round((curr.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          running++;
        } else {
          running = 1;
        }
      } else {
        running = 1;
      }
      prevDate = curr;
      if (running > longest) longest = running;
    }
  }

  const effectiveCurrent = Math.max(current, preservedStreak);
  const effectiveLongest = Math.max(effectiveCurrent, longest, preservedStreak, 7);

  return { current: effectiveCurrent, longest: effectiveLongest };
};

// Calculate total completions across all days
const calculateTotalCompletions = (logs: Record<string, DayLog>): number => {
  return Object.values(logs).reduce((acc, log) => acc + log.completedHabitIds.length, 0);
};

// Load or create initial state with rock-solid fallback for every key
const getInitialState = () => {
  const today = getTodayStr();
  const initialLogs = generateSeedDayLogs();
  const rank = getRankInfo(3);

  const defaultState = {
    habits: SEED_HABITS,
    dayLogs: initialLogs,
    timetable: SEED_TIMETABLE,
    badges: INITIAL_BADGES,
    userStats: {
      xp: 285,
      level: 3,
      currentStreak: 6,
      longestStreak: 14,
      totalCompletions: calculateTotalCompletions(initialLogs),
      rankTitle: rank.title,
      rankKanji: rank.kanji,
      voltronSprintsCompleted: 5
    },
    selectedDate: today,
    settings: {
      theme: 'dark' as const,
      soundEnabled: true,
      sakuraEnabled: true,
      notificationsEnabled: true,
      dailyBudget: 25,
      monthlySavingsGoal: 300
    },
    dailyQuests: generateDailyQuests(initialLogs[today], false),
    comboMultiplier: 1.0,
    toasts: [] as ToastMessage[],
    sprintTimer: {
      active: false,
      blockId: null,
      remainingSeconds: 7200,
      totalSeconds: 7200,
      isPaused: false
    },
    levelUpModal: {
      show: false,
      newLevel: 3,
      rankTitle: 'Rookie',
      rankKanji: '鍛錬生'
    },
    lastSeenQuoteDate: '',
    showDailyQuoteModal: false,
    currentQuote: getDailyQuote(today)
  };

  try {
    const rawSaved = localStorage.getItem(LOCAL_STORAGE_KEY)
      || localStorage.getItem('kata_habit_app_state_backup')
      || localStorage.getItem('kata_habit_app_state_v2');

    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && typeof parsed === 'object') {
        const rawLogs = parsed.dayLogs && typeof parsed.dayLogs === 'object'
          ? { ...defaultState.dayLogs, ...parsed.dayLogs }
          : defaultState.dayLogs;

        // Ensure every single dayLog has a safe completedHabitIds array
        const savedLogs: Record<string, DayLog> = {};
        for (const [key, log] of Object.entries(rawLogs)) {
          if (log && typeof log === 'object') {
            savedLogs[key] = {
              date: key,
              ...log,
              completedHabitIds: Array.isArray((log as any).completedHabitIds) ? (log as any).completedHabitIds : [],
              completedBlockIds: Array.isArray((log as any).completedBlockIds) ? (log as any).completedBlockIds : [],
              tasks: Array.isArray((log as any).tasks) ? (log as any).tasks : []
            };
          }
        }

        const savedStats = {
          ...defaultState.userStats,
          ...(parsed.userStats || {})
        };

        const savedQuests = generateDailyQuests(savedLogs[today], (savedStats.voltronSprintsCompleted || 0) > 0);

        return {
          ...defaultState,
          ...parsed,
          habits: Array.isArray(parsed.habits) && parsed.habits.length > 0 ? parsed.habits : defaultState.habits,
          dayLogs: savedLogs,
          timetable: Array.isArray(parsed.timetable) ? parsed.timetable : defaultState.timetable,
          badges: Array.isArray(parsed.badges) ? parsed.badges : defaultState.badges,
          userStats: savedStats,
          settings: { ...defaultState.settings, ...(parsed.settings || {}) },
          selectedDate: today, // Always start on Today when reopening the app!
          comboMultiplier: typeof parsed.comboMultiplier === 'number' ? parsed.comboMultiplier : 1.0,
          lastSeenQuoteDate: typeof parsed.lastSeenQuoteDate === 'string' ? parsed.lastSeenQuoteDate : '',
          dailyQuests: savedQuests,
          sprintTimer: defaultState.sprintTimer,
          toasts: [],
          levelUpModal: defaultState.levelUpModal,
          showDailyQuoteModal: false,
          currentQuote: getDailyQuote(today)
        };
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved state, using seeds', e);
  }

  return defaultState;
};

export const useKataStore = create<KataState>((set, get) => {
  const initial = getInitialState();

  // Helper to persist state to local storage & hard drive file
  const persist = (state: Partial<KataState>) => {
    try {
      const current = get();
      const toSave = {
        habits: current.habits,
        dayLogs: current.dayLogs,
        timetable: current.timetable,
        badges: current.badges,
        userStats: current.userStats,
        settings: current.settings,
        selectedDate: current.selectedDate,
        comboMultiplier: current.comboMultiplier,
        lastSeenQuoteDate: current.lastSeenQuoteDate
      };
      const jsonStr = JSON.stringify(toSave);
      localStorage.setItem(LOCAL_STORAGE_KEY, jsonStr);
      localStorage.setItem('kata_habit_app_state_backup', jsonStr);

      // Persist to local disk file kata_data.json
      if (typeof window !== 'undefined') {
        fetch('/api/kata-storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonStr
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  return {
    ...initial,

    setSelectedDate: (date: string) => {
      set({ selectedDate: date });
      persist({});
    },

    openDailyQuoteModal: () => set({ showDailyQuoteModal: true }),

    closeDailyQuoteModal: (markSeen = true) => {
      const today = getTodayStr();
      set(state => {
        const nextState = {
          showDailyQuoteModal: false,
          ...(markSeen ? { lastSeenQuoteDate: today } : {})
        };
        return nextState;
      });
      if (markSeen) {
        persist({ lastSeenQuoteDate: today });
      }
    },

    rollNewQuote: () => {
      const current = get().currentQuote;
      const nextQuote = getRandomQuote(current?.id);
      set({ currentQuote: nextQuote });
    },

    toggleHabit: (habitId: string, dateStr?: string) => {
      const state = get();
      const targetDate = dateStr || state.selectedDate || getTodayStr();
      const dayLog = state.dayLogs[targetDate] || {
        date: targetDate,
        completedHabitIds: []
      };

      const habit = state.habits.find(h => h.id === habitId);
      const isAlreadyCompleted = dayLog.completedHabitIds.includes(habitId);

      const newCompleted = isAlreadyCompleted
        ? dayLog.completedHabitIds.filter(id => id !== habitId)
        : [...dayLog.completedHabitIds, habitId];

      const newDayLogs = {
        ...state.dayLogs,
        [targetDate]: {
          ...dayLog,
          completedHabitIds: newCompleted
        }
      };

      // Sound & visuals
      let newMultiplier = state.comboMultiplier;
      let addedXp = 0;
      let newStats = { ...state.userStats };

      if (!isAlreadyCompleted) {
        soundEngine.playCheckmark();
        fireCheckmarkConfetti();

        // Increment combo multiplier up to 2.0x
        newMultiplier = Math.min(2.0, Number((newMultiplier + 0.1).toFixed(1)));
        if (newMultiplier >= 1.3) soundEngine.playCombo();

        // Base 25 XP * multiplier + streak bonus
        addedXp = Math.round(25 * newMultiplier);

        // Check if all scheduled habits completed for today
        const dayOfWeek = getDayOfWeekIndex(targetDate);
        const scheduledToday = state.habits.filter(h => !h.archived && h.scheduleDays.includes(dayOfWeek));
        const allDone = scheduledToday.length > 0 && scheduledToday.every(h => newCompleted.includes(h.id));
        if (allDone) {
          addedXp += 100;
          fireLevelUpConfetti();
        }

        // Apply XP and evaluate Level
        let currXp = newStats.xp + addedXp;
        let currLevel = newStats.level;
        let xpNeeded = getXpForLevel(currLevel);

        let leveledUp = false;
        while (currXp >= xpNeeded) {
          currXp -= xpNeeded;
          currLevel++;
          xpNeeded = getXpForLevel(currLevel);
          leveledUp = true;
        }

        const rank = getRankInfo(currLevel);
        const streak = calculateStreak(newDayLogs, getTodayStr(), state.userStats.currentStreak);

        newStats = {
          ...newStats,
          xp: currXp,
          level: currLevel,
          rankTitle: rank.title,
          rankKanji: rank.kanji,
          currentStreak: Math.max(streak.current, state.userStats.currentStreak),
          longestStreak: Math.max(streak.longest, newStats.longestStreak),
          totalCompletions: newStats.totalCompletions + 1
        };

        if (leveledUp) {
          soundEngine.playLevelUp();
          fireLevelUpConfetti();
          set({
            levelUpModal: {
              show: true,
              newLevel: currLevel,
              rankTitle: rank.title,
              rankKanji: rank.kanji
            }
          });
        }
      } else {
        // Unticked habit: Revert XP without down-leveling or wiping streak!
        const dayOfWeek = getDayOfWeekIndex(targetDate);
        const scheduledToday = state.habits.filter(h => !h.archived && h.scheduleDays.includes(dayOfWeek));
        // If prior to unticking, all scheduled habits were completed, user had received +100 bonus
        const wasAllDone = scheduledToday.length > 0 && scheduledToday.every(h => dayLog.completedHabitIds.includes(h.id));
        
        const deductedXp = Math.round(25 * state.comboMultiplier) + (wasAllDone ? 100 : 0);
        newMultiplier = Math.max(1.0, Number((newMultiplier - 0.2).toFixed(1)));

        // Floor at 0 XP within the current level. NEVER down-level a user!
        let currXp = Math.max(0, newStats.xp - deductedXp);
        let currLevel = newStats.level;

        const rank = getRankInfo(currLevel);
        const streak = calculateStreak(newDayLogs, getTodayStr(), state.userStats.currentStreak);
        newStats = {
          ...newStats,
          xp: currXp,
          level: currLevel,
          rankTitle: rank.title,
          rankKanji: rank.kanji,
          currentStreak: Math.max(streak.current, state.userStats.currentStreak),
          totalCompletions: Math.max(0, newStats.totalCompletions - 1)
        };
      }

      // Check Badges & Quests
      const today = getTodayStr();
      const updatedQuests = generateDailyQuests(newDayLogs[today], state.userStats.voltronSprintsCompleted > 0);

      set({
        dayLogs: newDayLogs,
        userStats: newStats,
        comboMultiplier: newMultiplier,
        dailyQuests: updatedQuests
      });

      // Show toast
      if (!isAlreadyCompleted && habit) {
        state.addToast(
          `Habit Completed! +${addedXp} XP`,
          `${habit.name} logged (${newMultiplier}x combo)`,
          'xp'
        );
      } else if (isAlreadyCompleted && habit) {
        state.addToast(
          `Habit Unchecked`,
          `${habit.name} reverted (-${Math.round(25 * state.comboMultiplier)} XP)`,
          'info'
        );
      }

      persist({});
    },

    completeVoltronSprint: (blockId: string) => {
      const state = get();
      const block = state.timetable.find(b => b.id === blockId);
      const today = getTodayStr();

      let dayLogs = { ...state.dayLogs };
      const currentLog = dayLogs[today] || { date: today, completedHabitIds: [], completedBlockIds: [] };
      const completedBlockIds = currentLog.completedBlockIds || [];
      const isAlreadyCompleted = completedBlockIds.includes(blockId);

      let newStats = { ...state.userStats };

      if (isAlreadyCompleted) {
        // Toggle OFF: Unmark the sprint block and revert the 150 XP without down-leveling!
        const newCompletedBlocks = completedBlockIds.filter(id => id !== blockId);
        
        // Floor at 0 XP within the current level. NEVER down-level!
        let currXp = Math.max(0, newStats.xp - 150);
        let currLevel = newStats.level;

        const rank = getRankInfo(currLevel);
        newStats = {
          ...newStats,
          xp: currXp,
          level: currLevel,
          rankTitle: rank.title,
          rankKanji: rank.kanji,
          voltronSprintsCompleted: Math.max(0, newStats.voltronSprintsCompleted - 1),
          totalCompletions: Math.max(0, newStats.totalCompletions - 1)
        };

        dayLogs[today] = {
          ...currentLog,
          completedBlockIds: newCompletedBlocks
        };

        const updatedQuests = generateDailyQuests(dayLogs[today], newStats.voltronSprintsCompleted > 0);

        set({
          dayLogs,
          userStats: newStats,
          dailyQuests: updatedQuests
        });

        state.addToast(
          'Block Unmarked',
          `${block?.title || 'Block'} unmarked (-150 XP reverted)`,
          'info'
        );
        persist({});
        return;
      }

      // First time completing today: Award 150 XP
      const newCompletedBlocks = [...completedBlockIds, blockId];
      soundEngine.playSprintDone();
      fireLevelUpConfetti();

      // Tick linked habit if exists and not yet ticked
      let completedHabits = currentLog.completedHabitIds;
      if (block?.linkedHabitId && !completedHabits.includes(block.linkedHabitId)) {
        completedHabits = [...completedHabits, block.linkedHabitId];
      }

      dayLogs[today] = {
        ...currentLog,
        completedHabitIds: completedHabits,
        completedBlockIds: newCompletedBlocks
      };

      // Award 150 bonus XP
      let currXp = newStats.xp + 150;
      let currLevel = newStats.level;
      let xpNeeded = getXpForLevel(currLevel);
      let leveledUp = false;

      while (currXp >= xpNeeded) {
        currXp -= xpNeeded;
        currLevel++;
        xpNeeded = getXpForLevel(currLevel);
        leveledUp = true;
      }

      const rank = getRankInfo(currLevel);
      newStats = {
        ...newStats,
        xp: currXp,
        level: currLevel,
        rankTitle: rank.title,
        rankKanji: rank.kanji,
        voltronSprintsCompleted: newStats.voltronSprintsCompleted + 1,
        totalCompletions: newStats.totalCompletions + 1
      };

      if (leveledUp) {
        soundEngine.playLevelUp();
        set({
          levelUpModal: {
            show: true,
            newLevel: currLevel,
            rankTitle: rank.title,
            rankKanji: rank.kanji
          }
        });
      }

      set({
        dayLogs,
        userStats: newStats,
        sprintTimer: {
          ...state.sprintTimer,
          active: false,
          remainingSeconds: state.sprintTimer.totalSeconds,
          isPaused: false
        },
        dailyQuests: generateDailyQuests(dayLogs[today], true)
      });

      state.addToast(
        '⚡ Voltron Sprint Complete! (+150 XP)',
        `${block?.title || '2-Hour Focus block'} finished & linked habit verified.`,
        'success'
      );

      persist({});
    },

    addHabit: (habitData) => {
      const state = get();
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}`,
        order: state.habits.length + 1,
        createdAt: getTodayStr()
      };

      set({ habits: [...state.habits, newHabit] });
      state.addToast('Habit Created', `${newHabit.name} added to your command center.`, 'info');
      persist({});
    },

    editHabit: (id, updates) => {
      const state = get();
      const habits = state.habits.map(h => h.id === id ? { ...h, ...updates } : h);
      set({ habits });
      state.addToast('Habit Updated', 'Changes saved successfully.', 'info');
      persist({});
    },

    deleteHabit: (id) => {
      const state = get();
      const habits = state.habits.filter(h => h.id !== id);
      set({ habits });
      state.addToast('Habit Removed', 'Habit was removed from Kata.', 'info');
      persist({});
    },

    reorderHabit: (id, direction) => {
      const state = get();
      const index = state.habits.findIndex(h => h.id === id);
      if (index === -1) return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.habits.length) return;

      const newHabits = [...state.habits];
      const temp = newHabits[index];
      newHabits[index] = newHabits[targetIndex];
      newHabits[targetIndex] = temp;

      // Update order index
      newHabits.forEach((h, i) => (h.order = i + 1));
      set({ habits: newHabits });
      persist({});
    },

    setDayMoodAndNote: (date, mood, note) => {
      const state = get();
      const current = state.dayLogs[date] || { date, completedHabitIds: [] };
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          mood: mood !== undefined ? mood : current.mood,
          journalNote: note !== undefined ? note : current.journalNote
        }
      };

      set({
        dayLogs: newDayLogs,
        dailyQuests: generateDailyQuests(newDayLogs[getTodayStr()], state.userStats.voltronSprintsCompleted > 0)
      });
      state.addToast('Journal Saved', 'Daily reflection recorded.', 'info');
      persist({});
    },

    setDaySpending: (date, spent, savings) => {
      const state = get();
      const current = state.dayLogs[date] || { date, completedHabitIds: [] };
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          amountSpent: spent !== undefined ? (spent === null ? undefined : spent) : current.amountSpent,
          savingsDeposited: savings !== undefined ? (savings === null ? undefined : savings) : current.savingsDeposited
        }
      };

      set({ dayLogs: newDayLogs });
      state.addToast('Finances Updated', 'Daily spending and savings updated.', 'info');
      persist({});
    },

    addDailyTask: (date, text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const state = get();
      const current = state.dayLogs[date] || { date, completedHabitIds: [] };
      const currentTasks = Array.isArray(current.tasks) ? current.tasks : [];
      const newTask: DailyTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: trimmed,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          tasks: [...currentTasks, newTask]
        }
      };
      set({ dayLogs: newDayLogs });
      state.addToast('Task Added', `"${trimmed}" added`, 'info');
      persist({});
    },

    toggleDailyTask: (date, taskId) => {
      const state = get();
      const current = state.dayLogs[date];
      if (!current || !Array.isArray(current.tasks)) return;

      let isNowCompleted = false;
      const newTasks = current.tasks.map(t => {
        if (t.id === taskId) {
          isNowCompleted = !t.completed;
          return { ...t, completed: !t.completed };
        }
        return t;
      });

      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          tasks: newTasks
        }
      };

      set({ dayLogs: newDayLogs });
      if (isNowCompleted) {
        soundEngine.playCheckmark();
      }
      persist({});
    },

    deleteDailyTask: (date, taskId) => {
      const state = get();
      const current = state.dayLogs[date];
      if (!current || !Array.isArray(current.tasks)) return;

      const newTasks = current.tasks.filter(t => t.id !== taskId);
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          tasks: newTasks
        }
      };
      set({ dayLogs: newDayLogs });
      persist({});
    },

    editDailyTask: (date, taskId, newText) => {
      const trimmed = newText.trim();
      if (!trimmed) return;
      const state = get();
      const current = state.dayLogs[date];
      if (!current || !Array.isArray(current.tasks)) return;

      const newTasks = current.tasks.map(t => t.id === taskId ? { ...t, text: trimmed } : t);
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          tasks: newTasks
        }
      };
      set({ dayLogs: newDayLogs });
      persist({});
    },

    clearCompletedDailyTasks: (date) => {
      const state = get();
      const current = state.dayLogs[date];
      if (!current || !Array.isArray(current.tasks)) return;

      const newTasks = current.tasks.filter(t => !t.completed);
      const newDayLogs = {
        ...state.dayLogs,
        [date]: {
          ...current,
          tasks: newTasks
        }
      };
      set({ dayLogs: newDayLogs });
      persist({});
    },

    addTimetableBlock: (blockData) => {
      const state = get();
      const newBlock: VoltronBlock = {
        ...blockData,
        id: `block-${Date.now()}`
      };
      set({ timetable: [...state.timetable, newBlock] });
      state.addToast('Schedule Block Added', newBlock.title, 'info');
      persist({});
    },

    updateTimetableBlock: (block) => {
      const state = get();
      const timetable = state.timetable.map(b => b.id === block.id ? block : b);
      set({ timetable });
      state.addToast('Schedule Block Updated', block.title, 'info');
      persist({});
    },

    deleteTimetableBlock: (id) => {
      const state = get();
      const timetable = state.timetable.filter(b => b.id !== id);
      set({ timetable });
      state.addToast('Schedule Block Deleted', 'Removed from weekly timetable.', 'info');
      persist({});
    },

    startSprintTimer: (blockId, durationMinutes = 120) => {
      const totalSeconds = durationMinutes * 60;
      set({
        sprintTimer: {
          active: true,
          blockId,
          remainingSeconds: totalSeconds,
          totalSeconds,
          isPaused: false
        }
      });
    },

    pauseSprintTimer: () => {
      const current = get().sprintTimer;
      set({ sprintTimer: { ...current, isPaused: true } });
    },

    resumeSprintTimer: () => {
      const current = get().sprintTimer;
      set({ sprintTimer: { ...current, isPaused: false } });
    },

    resetSprintTimer: () => {
      const current = get().sprintTimer;
      set({
        sprintTimer: {
          ...current,
          active: false,
          remainingSeconds: current.totalSeconds,
          isPaused: false
        }
      });
    },

    tickSprintTimer: () => {
      const state = get();
      const { sprintTimer } = state;
      if (!sprintTimer.active || sprintTimer.isPaused) return;

      if (sprintTimer.remainingSeconds <= 1) {
        if (sprintTimer.blockId) {
          state.completeVoltronSprint(sprintTimer.blockId);
        }
      } else {
        set({
          sprintTimer: {
            ...sprintTimer,
            remainingSeconds: sprintTimer.remainingSeconds - 1
          }
        });
      }
    },

    updateSettings: (updates) => {
      const current = get().settings;
      const newSettings = { ...current, ...updates };

      if (updates.theme) {
        if (updates.theme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }

      if (updates.soundEnabled !== undefined) {
        soundEngine.setEnabled(updates.soundEnabled);
      }

      set({ settings: newSettings });
      persist({});
    },

    addToast: (title, description, type = 'info') => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, title, description, type, timestamp: Date.now() };
      set(state => ({ toasts: [newToast, ...state.toasts.slice(0, 4)] }));

      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },

    removeToast: (id) => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    },

    closeLevelUpModal: () => {
      set(state => ({ levelUpModal: { ...state.levelUpModal, show: false } }));
    },

    resetToSeedData: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      const initialLogs = generateSeedDayLogs();
      const rank = getRankInfo(3);
      set({
        habits: SEED_HABITS,
        dayLogs: initialLogs,
        timetable: SEED_TIMETABLE,
        badges: INITIAL_BADGES,
        userStats: {
          xp: 285,
          level: 3,
          currentStreak: 6,
          longestStreak: 14,
          totalCompletions: calculateTotalCompletions(initialLogs),
          rankTitle: rank.title,
          rankKanji: rank.kanji,
          voltronSprintsCompleted: 5
        },
        selectedDate: getTodayStr(),
        comboMultiplier: 1.0,
        dailyQuests: generateDailyQuests(initialLogs[getTodayStr()], false)
      });
      get().addToast('Data Reset', 'Restored Kata sample habits & timetable.', 'info');
      persist({});
    },

    importBackupData: (imported) => {
      if (!imported || !imported.habits || !imported.dayLogs) {
        get().addToast('Import Failed', 'Invalid Kata backup file format.', 'badge');
        return;
      }
      set({
        habits: imported.habits,
        dayLogs: imported.dayLogs,
        timetable: imported.timetable || SEED_TIMETABLE,
        badges: imported.badges || INITIAL_BADGES,
        userStats: imported.userStats || get().userStats,
        settings: imported.settings || get().settings
      });
      get().addToast('Backup Restored', 'Successfully loaded all habits and history.', 'success');
      persist({});
    }
  };
});

// Auto-sync with disk file kata_data.json on startup
if (typeof window !== 'undefined') {
  fetch('/api/kata-storage')
    .then(res => res.json())
    .then(diskData => {
      if (diskData && typeof diskData === 'object' && diskData.dayLogs) {
        const state = useKataStore.getState();
        const mergedLogs = { ...state.dayLogs, ...diskData.dayLogs };
        const mergedStats = { ...state.userStats, ...(diskData.userStats || {}) };
        useKataStore.setState({
          dayLogs: mergedLogs,
          userStats: mergedStats,
          habits: Array.isArray(diskData.habits) && diskData.habits.length > 0 ? diskData.habits : state.habits,
          timetable: Array.isArray(diskData.timetable) ? diskData.timetable : state.timetable,
          badges: Array.isArray(diskData.badges) ? diskData.badges : state.badges
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(diskData));
        } catch (e) {}
      }
    })
    .catch(() => {});
}
