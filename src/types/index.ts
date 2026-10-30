export type HabitCategory = 'Mind' | 'Body' | 'Craft' | 'Lifestyle' | 'Finance';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  color: string; // Hex color e.g. #00f2fe
  icon: string; // Lucide icon name
  monthlyGoal: number; // e.g. 20 days/month
  scheduleDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  voltronSprintSlot?: string; // Optional link to sprint block e.g. "mon-sprint"
  archived?: boolean;
  order: number;
  createdAt: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  completedBlockIds?: string[]; // IDs of timetable / Voltron sprint blocks completed on this date
  amountSpent?: number;
  savingsDeposited?: number;
  mood?: 'zen' | 'energized' | 'calm' | 'focused' | 'fatigued' | 'inspired';
  journalNote?: string;
}

export interface VoltronBlock {
  id: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string; // "16:00"
  endTime: string; // "18:00"
  title: string;
  isVoltronSprint: boolean;
  linkedHabitId?: string; // Linked habit to auto-tick
  color?: string;
  description?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  type: 'complete_count' | 'voltron_sprint' | 'log_journal' | 'early_bird';
  xpReward: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  titleKanji: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type RankTitle = 'Rookie' | 'Wanderer' | 'Adept' | 'Sage' | 'Legend';

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  rankTitle: RankTitle;
  rankKanji: string;
  voltronSprintsCompleted: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  sakuraEnabled: boolean;
  notificationsEnabled: boolean;
  dailyBudget: number;
  monthlySavingsGoal: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'xp' | 'badge';
  timestamp: number;
}
