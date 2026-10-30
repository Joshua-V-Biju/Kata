import React from 'react';
import { Dumbbell, Calendar, Flame, Activity, Shield } from 'lucide-react';

export type ForgeHubTab = 'workout' | 'tracker' | 'progression' | 'body' | 'armory';

interface Props {
  activeTab: ForgeHubTab;
  onTabChange: (tab: ForgeHubTab) => void;
}

export const ForgeNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { key: ForgeHubTab; label: string; kanji: string; icon: React.ReactNode }[] = [
    {
      key: 'workout',
      label: 'Workouts',
      kanji: '鍛錬',
      icon: <Dumbbell className="w-4 h-4" />
    },
    {
      key: 'tracker',
      label: 'Monthly Tracker',
      kanji: '月間',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      key: 'progression',
      label: 'Progression',
      kanji: '系統樹',
      icon: <Flame className="w-4 h-4" />
    },
    {
      key: 'body',
      label: 'Body Radar',
      kanji: '負荷図',
      icon: <Activity className="w-4 h-4" />
    },
    {
      key: 'armory',
      label: 'Armory & Gear',
      kanji: '装備',
      icon: <Shield className="w-4 h-4" />
    }
  ];

  return (
    <nav className="w-full flex items-center justify-center py-2 px-3 sm:px-4 relative z-20">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#171a22] border border-white/5 shadow-md overflow-x-auto max-w-full scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className={`shrink-0 ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                {tab.icon}
              </div>
              <span className={`whitespace-nowrap leading-none ${isActive ? 'text-orange-200' : 'text-slate-200'}`}>
                {tab.label}
              </span>
              <span className={`text-[10px] font-mono whitespace-nowrap opacity-60 hidden sm:inline ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                {tab.kanji}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
