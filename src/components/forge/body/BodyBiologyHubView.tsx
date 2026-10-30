import React, { useState } from 'react';
import { MuscleMapView } from '../muscle/MuscleMapView';
import { RecoveryView } from '../recovery/RecoveryView';
import { NutritionView } from '../nutrition/NutritionView';
import { Activity, HeartPulse, Utensils } from 'lucide-react';

export const BodyBiologyHubView: React.FC = () => {
  const [subTab, setSubTab] = useState<'muscle' | 'recovery' | 'nutrition'>('muscle');

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Segmented Top Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14161d] border border-white/5 overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSubTab('muscle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'muscle'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Muscle Map (Weekly Volume)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('recovery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'recovery'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Readiness &amp; Guided Mobility</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('nutrition')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'nutrition'
                ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Supportive Fueling &amp; Water</span>
          </button>
        </div>
      </div>

      {/* Render Active Sub-View */}
      {subTab === 'muscle' && <MuscleMapView />}
      {subTab === 'recovery' && <RecoveryView />}
      {subTab === 'nutrition' && <NutritionView />}

    </div>
  );
};
