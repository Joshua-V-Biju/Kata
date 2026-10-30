import React from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { AVAILABLE_EQUIPMENT } from '../../../utils/forgeData';
import { Shield, Check, Info, Flame, AlertCircle } from 'lucide-react';

interface Props {
  onOpenOnboarding: () => void;
}

export const ArmoryView: React.FC<Props> = ({ onOpenOnboarding }) => {
  const { equipment, toggleEquipment } = useForgeStore();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl forge-card border border-orange-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-display font-black text-white">
              Home Armory &amp; Equipment
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Toggle the equipment you have at home. The exercise library, starter splits, and progression trees filter dynamically around your arsenal.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenOnboarding}
          className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition shadow-md shrink-0 cursor-pointer"
        >
          Re-Run Armory Wizard
        </button>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_EQUIPMENT.map(item => {
          const isOwned = equipment.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleEquipment(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isOwned
                  ? 'bg-orange-950/20 border-orange-500/40 shadow-[0_0_15px_rgba(255,102,0,0.1)]'
                  : 'bg-black/40 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                    {item.category}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                      isOwned
                        ? 'bg-orange-500 border-orange-400 text-slate-950'
                        : 'border-white/10 bg-black/40'
                    }`}
                  >
                    {isOwned && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <h3 className="text-base font-display font-bold text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Substitution Guideline */}
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="text-orange-400 font-bold flex items-center gap-1 text-[10px] uppercase">
                  <Info className="w-3 h-3" />
                  <span>Substitution Alternative:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {item.substitutionTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
