import React from 'react';
import { Dumbbell, Flame, Activity, Shield } from 'lucide-react';

export type ForgeHubTab = 'workout' | 'progression' | 'body' | 'armory';

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
      desc: 'Routines, History & Logger'
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#0f1118]/90 backdrop-blur-md border border-orange-500/20 shadow-xl w-full max-w-4xl">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.01]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-black/20 text-slate-950' : 'text-orange-400 bg-orange-600/10'}`}>
                {tab.icon}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-display font-black leading-tight ${isActive ? 'text-slate-950' : 'text-white'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[9px] font-mono opacity-70 hidden md:inline ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {tab.kanji}
                  </span>
                </div>
                <div className={`text-[10px] font-mono truncate hidden lg:block ${isActive ? 'text-slate-900/80 font-medium' : 'text-slate-500'}`}>
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
