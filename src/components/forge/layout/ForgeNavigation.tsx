import React from 'react';
import { Dumbbell, Calendar, Flame, Activity, Shield } from 'lucide-react';

export type ForgeHubTab = 'workout' | 'tracker' | 'progression' | 'body' | 'armory';

interface Props {
  activeTab: ForgeHubTab;
  onTabChange: (tab: ForgeHubTab) => void;
}

export const ForgeNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { key: ForgeHubTab; label: string; kanji: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'workout',
      label: 'Workouts',
      kanji: '鍛錬',
      icon: <Dumbbell className="w-4 h-4" />,
      desc: 'Routines, Cindy & Live Logger'
    },
    {
      key: 'tracker',
      label: 'Monthly Tracker',
      kanji: '月間',
      icon: <Calendar className="w-4 h-4" />,
      desc: 'Workout Calendar & Consistency'
    },
    {
      key: 'progression',
      label: 'Progression',
      kanji: '系統樹',
      icon: <Flame className="w-4 h-4" />,
      desc: 'Trees, Bosses & PRs'
    },
    {
      key: 'body',
      label: 'Body & Radar',
      kanji: '負荷図',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Muscle Map, Recovery & Fuel'
    },
    {
      key: 'armory',
      label: 'Armory & Command',
      kanji: '装備・設定',
      icon: <Shield className="w-4 h-4" />,
      desc: 'Gear, Ranks & Safety'
    }
  ];

  return (
    <nav className="w-full flex items-center justify-center py-2 px-3 sm:px-4 relative z-20">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-[#171a22] border border-white/5 shadow-lg w-full max-w-5xl">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400 bg-white/5'}`}>
                {tab.icon}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-display font-bold leading-tight ${isActive ? 'text-orange-200' : 'text-slate-200'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[9px] font-mono opacity-60 hidden md:inline ${isActive ? 'text-orange-400' : 'text-slate-400'}`}>
                    {tab.kanji}
                  </span>
                </div>
                <div className={`text-[10px] font-mono truncate hidden xl:block ${isActive ? 'text-orange-300/80' : 'text-slate-400'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
