import React from 'react';
import { Dumbbell, Shield, Zap, Settings, Flame } from 'lucide-react';

export type ForgeTab = 'workout' | 'armory' | 'stats' | 'settings';

interface Props {
  activeTab: ForgeTab;
  onTabChange: (tab: ForgeTab) => void;
}

export const ForgeNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { key: ForgeTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      key: 'workout',
      label: 'Workout Logger',
      icon: <Dumbbell className="w-4 h-4" />
    },
    {
      key: 'armory',
      label: 'Home Armory',
      icon: <Shield className="w-4 h-4" />
    },
    {
      key: 'stats',
      label: 'Iron & Heat',
      icon: <Flame className="w-4 h-4" />
    },
    {
      key: 'settings',
      label: 'Bridge Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <nav className="w-full flex items-center justify-center py-2 px-4 relative z-20">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#10121a] border border-orange-500/20 shadow-lg overflow-x-auto max-w-full scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
