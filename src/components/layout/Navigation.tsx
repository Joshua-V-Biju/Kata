import React from 'react';
import { LayoutDashboard, Calendar, Clock, BarChart3, Trophy, BookOpen } from 'lucide-react';

export type TabKey = 'dashboard' | 'monthly' | 'planner' | 'insights' | 'badges' | 'journal';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabKey; label: string; kanji: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'dashboard', label: 'Dashboard', kanji: '司令部', icon: LayoutDashboard },
    { key: 'monthly', label: 'Monthly Tracker', kanji: '月間', icon: Calendar },
    { key: 'planner', label: 'Weekly Planner', kanji: '週間', icon: Clock },
    { key: 'insights', label: 'Insights', kanji: '洞察', icon: BarChart3 },
    { key: 'badges', label: 'Hall of Badges', kanji: '勲章', icon: Trophy },
    { key: 'journal', label: 'Journal & Ledger', kanji: '日誌', icon: BookOpen },
  ];

  return (
    <>
      {/* Desktop Navigation Pill Bar */}
      <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-center py-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-card border border-white/5 shadow-xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-400/80' : 'text-slate-600'}`}>
                  {tab.kanji}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Glass Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-cyan-400 scale-105' : 'text-slate-400'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-500/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-display font-medium mt-0.5">
                {tab.kanji}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
