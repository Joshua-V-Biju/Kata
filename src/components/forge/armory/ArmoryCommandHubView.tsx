import React, { useState } from 'react';
import { ArmoryView } from './ArmoryView';
import { ForgeStatsView } from '../stats/ForgeStatsView';
import { SafetyHealthView } from '../safety/SafetyHealthView';
import { ForgeSettingsView } from '../settings/ForgeSettingsView';
import { Shield, Zap, ShieldAlert, Settings } from 'lucide-react';

interface Props {
  onOpenOnboarding: () => void;
}

export const ArmoryCommandHubView: React.FC<Props> = ({ onOpenOnboarding }) => {
  const [subTab, setSubTab] = useState<'armory' | 'stats' | 'safety' | 'settings'>('armory');

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Segmented Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#10121a] border border-white/5 overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSubTab('armory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'armory'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Home Equipment</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'stats'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Iron &amp; Heat Ranks</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('safety')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'safety'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Protocols</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'settings'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kata Bridge &amp; Settings</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {subTab === 'armory' && <ArmoryView onOpenOnboarding={onOpenOnboarding} />}
      {subTab === 'stats' && <ForgeStatsView />}
      {subTab === 'safety' && <SafetyHealthView />}
      {subTab === 'settings' && <ForgeSettingsView />}

    </div>
  );
};
