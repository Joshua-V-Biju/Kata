import React from 'react';
import {
  Dumbbell,
  Shield,
  Zap,
  Settings,
  Flame,
  Activity,
  Trophy,
  Swords,
  BookOpen,
  HeartPulse,
  Utensils,
  ShieldAlert
} from 'lucide-react';

export type ForgeTab =
  | 'workout'
  | 'progression'
  | 'exercises'
  | 'prs'
  | 'boss'
  | 'muscle'
  | 'recovery'
  | 'nutrition'
  | 'armory'
  | 'stats'
  | 'safety'
  | 'settings';

interface Props {
  activeTab: ForgeTab;
  onTabChange: (tab: ForgeTab) => void;
}

export const ForgeNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { key: ForgeTab; label: string; icon: React.ReactNode; kanji?: string }[] = [
    {
      key: 'workout',
      label: 'Workout',
      kanji: '鍛錬',
      icon: <Dumbbell className="w-3.5 h-3.5" />
    },
    {
      key: 'progression',
      label: 'Skill Trees',
      kanji: '系統樹',
      icon: <Flame className="w-3.5 h-3.5" />
    },
    {
      key: 'exercises',
      label: 'Library',
      kanji: '目録',
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
    {
      key: 'prs',
      label: 'PR Wall',
      kanji: '最高記録',
      icon: <Trophy className="w-3.5 h-3.5" />
    },
    {
      key: 'boss',
      label: 'Boss Lifts',
      kanji: '強敵',
      icon: <Swords className="w-3.5 h-3.5" />
    },
    {
      key: 'muscle',
      label: 'Muscle Map',
      kanji: '負荷図',
      icon: <Activity className="w-3.5 h-3.5" />
    },
    {
      key: 'recovery',
      label: 'Recovery',
      kanji: '再生',
      icon: <HeartPulse className="w-3.5 h-3.5" />
    },
    {
      key: 'nutrition',
      label: 'Fueling',
      kanji: '栄養',
      icon: <Utensils className="w-3.5 h-3.5" />
    },
    {
      key: 'armory',
      label: 'Armory',
      kanji: '装備',
      icon: <Shield className="w-3.5 h-3.5" />
    },
    {
      key: 'stats',
      label: 'Iron & Heat',
      kanji: '鉄と熱',
      icon: <Zap className="w-3.5 h-3.5" />
    },
    {
      key: 'safety',
      label: 'Safety',
      kanji: '安全',
      icon: <ShieldAlert className="w-3.5 h-3.5" />
    },
    {
      key: 'settings',
      label: 'Settings',
      kanji: '設定',
      icon: <Settings className="w-3.5 h-3.5" />
    }
  ];

  return (
    <nav className="w-full flex items-center justify-center py-2 px-3 sm:px-4 relative z-20">
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0f1118]/90 backdrop-blur-md border border-orange-500/20 shadow-xl overflow-x-auto max-w-full scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.kanji && (
                <span className={`text-[9px] font-mono opacity-60 hidden md:inline ${isActive ? 'text-slate-900 font-black' : ''}`}>
                  {tab.kanji}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
