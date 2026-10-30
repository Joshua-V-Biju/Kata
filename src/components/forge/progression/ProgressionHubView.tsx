import React, { useState } from 'react';
import { ProgressionTreesView } from './ProgressionTreesView';
import { BossLiftsView } from '../boss/BossLiftsView';
import { PrWallView } from '../prs/PrWallView';
import { Flame, Swords, Trophy } from 'lucide-react';

export const ProgressionHubView: React.FC = () => {
  const [subTab, setSubTab] = useState<'trees' | 'boss' | 'prs'>('trees');

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Segmented Top Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14161d] border border-white/5 overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSubTab('trees')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'trees'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Calisthenics Trees (6 Ladders)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('boss')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'boss'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Boss Lifts Chamber</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('prs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'prs'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>PR Vault &amp; History</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {subTab === 'trees' && <ProgressionTreesView />}
      {subTab === 'boss' && <BossLiftsView />}
      {subTab === 'prs' && <PrWallView />}

    </div>
  );
};
