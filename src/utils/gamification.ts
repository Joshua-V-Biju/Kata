import { Badge, DailyQuest, DayLog, Habit, RankTitle, UserStats } from '../types';

/**
 * Progressive Level Scaling Curve:
 * Higher levels require progressively and exponentially more disciplined practice to level up:
 * - Level 1: 150 XP (Fast starter gratification: ~5 habits or 1 Voltron sprint)
 * - Level 2: 382 XP
 * - Level 3: 661 XP
 * - Level 5: 1,317 XP (Wanderer rank)
 * - Level 10: 3,361 XP (Adept rank)
 * - Level 20: 8,574 XP (Sage rank)
 * - Level 35: 18,348 XP (Legend rank)
 */
export const getXpForLevel = (level: number): number => {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(150 * Math.pow(safeLevel, 1.35));
};

export const getRankInfo = (level: number): { title: RankTitle; kanji: string; color: string } => {
  if (level >= 35) return { title: 'Legend', kanji: '伝説', color: '#ff6b8b' };
  if (level >= 20) return { title: 'Sage', kanji: '賢者', color: '#a855f7' };
  if (level >= 10) return { title: 'Adept', kanji: '熟練者', color: '#00e5a3' };
  if (level >= 5) return { title: 'Wanderer', kanji: '放浪者', color: '#00f2fe' };
  return { title: 'Rookie', kanji: '鍛錬生', color: '#ffb300' };
};

export const getStatusTitle = (completionRate: number, streak: number): { title: string; subtitle: string; aura: string } => {
  if (completionRate >= 1) {
    return {
      title: 'Transcendent Flow • 神域の極み',
      subtitle: 'Complete synchronization achieved. Aura blazing.',
      aura: 'legendary'
    };
  }
  if (completionRate >= 0.75) {
    return {
      title: 'Ascending Spirit • 昇天の気迫',
      subtitle: streak > 3 ? `${streak}-Day Streak ignition! Full speed ahead.` : 'In peak rhythm. Finish strong!',
      aura: 'fire'
    };
  }
  if (completionRate >= 0.4) {
    return {
      title: 'Unstoppable Momentum • 破竹の勢い',
      subtitle: 'Building steady velocity. Keep the pressure on.',
      aura: 'energy'
    };
  }
  if (completionRate > 0) {
    return {
      title: 'Silent Focus • 穏やかな集中',
      subtitle: 'First strikes landed. Channel your discipline.',
      aura: 'calm'
    };
  }
  return {
    title: 'Awakening • 目覚め',
    subtitle: 'The day awaits your command. Ready your blade.',
    aura: 'dormant'
  };
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step • 一歩目',
    titleKanji: '初陣',
    description: 'Log your very first habit completion in Kata.',
    icon: 'Sparkles',
    progress: 1,
    maxProgress: 1,
    rarity: 'common',
    unlockedAt: '2026-10-10'
  },
  {
    id: 'streak_7',
    name: 'Iron Will • 鋼の七日',
    titleKanji: '七日練',
    description: 'Maintain an active habit streak of 7 consecutive days.',
    icon: 'Flame',
    progress: 7,
    maxProgress: 7,
    rarity: 'rare',
    unlockedAt: '2026-10-24'
  },
  {
    id: 'streak_30',
    name: 'Way of the Master • 達人の道',
    titleKanji: '月影',
    description: 'Reach a legendary 30-day continuous streak.',
    icon: 'Award',
    progress: 18,
    maxProgress: 30,
    rarity: 'legendary'
  },
  {
    id: 'completions_100',
    name: 'Century Club • 百錬成鋼',
    titleKanji: '百錬',
    description: 'Accumulate 100 total habit checkmarks.',
    icon: 'ShieldAlert',
    progress: 88,
    maxProgress: 100,
    rarity: 'epic'
  },
  {
    id: 'perfect_day',
    name: 'Total Victory • 完勝の日',
    titleKanji: '全勝',
    description: 'Check off 100% of all scheduled habits in a single day.',
    icon: 'Crown',
    progress: 1,
    maxProgress: 1,
    rarity: 'rare',
    unlockedAt: '2026-10-28'
  },
  {
    id: 'perfect_week',
    name: 'Conqueror of Time • 覇王の週',
    titleKanji: '覇王',
    description: 'Achieve 7 consecutive perfect days in a row.',
    icon: 'Trophy',
    progress: 3,
    maxProgress: 7,
    rarity: 'legendary'
  },
  {
    id: 'voltron_sprint_5',
    name: 'Deep Sprint Sage • 集中極意',
    titleKanji: '極意',
    description: 'Complete 5 two-hour Voltron Sprint deep focus blocks.',
    icon: 'Zap',
    progress: 5,
    maxProgress: 5,
    rarity: 'epic',
    unlockedAt: '2026-10-27'
  },
  {
    id: 'early_bird',
    name: 'Night Hunter • 宵月',
    titleKanji: '夜討',
    description: 'Complete "Sleep before 11:30" 10 times.',
    icon: 'Moon',
    progress: 8,
    maxProgress: 10,
    rarity: 'rare'
  },
  {
    id: 'frugal_master',
    name: 'Golden Discipline • 蓄財',
    titleKanji: '金剛',
    description: 'Stay under daily budget & put money to savings for 10 days.',
    icon: 'PiggyBank',
    progress: 9,
    maxProgress: 10,
    rarity: 'rare'
  }
];

export const generateDailyQuests = (todayLog?: DayLog, voltronCompleted: boolean = false): DailyQuest[] => {
  const count = Array.isArray(todayLog?.completedHabitIds) ? todayLog.completedHabitIds.length : 0;
  const journalDone = !!todayLog?.journalNote || !!todayLog?.mood;

  return [
    {
      id: 'quest_1',
      title: 'Strike The Anvil • 3 Habits',
      description: 'Complete any 3 habits today to ignite your combo.',
      targetCount: 3,
      type: 'complete_count',
      xpReward: 50,
      completed: count >= 3
    },
    {
      id: 'quest_2',
      title: 'Voltron Sprint Awakening • 2-Hour Focus',
      description: 'Engage and complete your scheduled 2-hour Voltron Sprint.',
      targetCount: 1,
      type: 'voltron_sprint',
      xpReward: 100,
      completed: voltronCompleted
    },
    {
      id: 'quest_3',
      title: 'Mind & Ledger • Log Reflection',
      description: 'Record your daily mood or one-line journal entry.',
      targetCount: 1,
      type: 'log_journal',
      xpReward: 40,
      completed: journalDone
    }
  ];
};
