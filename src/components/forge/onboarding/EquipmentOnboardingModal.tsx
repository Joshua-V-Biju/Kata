import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { AVAILABLE_EQUIPMENT } from '../../../utils/forgeData';
import { EquipmentId } from '../../../types/forge';
import { soundEngine } from '../../../utils/sound';
import {
  Flame,
  Check,
  Shield,
  Dumbbell,
  Maximize2,
  Activity,
  AlignJustify,
  Infinity as InfinityIcon,
  MinusSquare,
  Disc,
  Grid,
  X,
  Sparkles
} from 'lucide-react';

interface Props {
  onClose?: () => void;
  isOpen: boolean;
}

const getEquipmentIcon = (id: EquipmentId) => {
  switch (id) {
    case 'bodyweight':
      return <Activity className="w-5 h-5" />;
    case 'pullup_bar':
      return <Maximize2 className="w-5 h-5" />;
    case 'dip_bars':
      return <AlignJustify className="w-5 h-5" />;
    case 'bands':
      return <InfinityIcon className="w-5 h-5" />;
    case 'dumbbells':
      return <Dumbbell className="w-5 h-5" />;
    case 'weighted_vest':
      return <Shield className="w-5 h-5" />;
    case 'bench':
      return <MinusSquare className="w-5 h-5" />;
    case 'kettlebell':
      return <Disc className="w-5 h-5" />;
    case 'chair_table':
      return <Grid className="w-5 h-5" />;
    default:
      return <Dumbbell className="w-5 h-5" />;
  }
};

export const EquipmentOnboardingModal: React.FC<Props> = ({ onClose, isOpen }) => {
  const { equipment, completeOnboarding, setEquipment } = useForgeStore();
  const [selected, setSelected] = useState<EquipmentId[]>(() =>
    equipment.length > 0 ? equipment : ['bodyweight', 'pullup_bar', 'chair_table']
  );

  if (!isOpen) return null;

  const toggleItem = (id: EquipmentId) => {
    soundEngine.playCheckmark();
    if (selected.includes(id)) {
      // Don't allow deselecting bodyweight
      if (id === 'bodyweight') return;
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = () => {
    soundEngine.playCheckmark();
    setSelected(AVAILABLE_EQUIPMENT.map(e => e.id));
  };

  const handleMinimal = () => {
    soundEngine.playCheckmark();
    setSelected(['bodyweight', 'chair_table']);
  };

  const handleSave = () => {
    soundEngine.playAnvilHit();
    setEquipment(selected);
    completeOnboarding(selected);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0e1017] border-2 border-orange-500/40 shadow-[0_0_60px_rgba(255,102,0,0.25)] overflow-hidden">
        
        {/* Molten Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600" />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
                  HOME ARMORY SETUP • 装備選定
                </span>
              </div>
              <h2 className="text-2xl font-display font-black text-white tracking-tight">
                What Equipment Do You Have?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
                Forge calibrates all exercises, progressions, and starter routines around what you actually own. Lacking gear? Substitutions are automatically provided.
              </p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-500">Quick Presets:</span>
            <button
              type="button"
              onClick={handleMinimal}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono border border-white/5 transition"
            >
              Minimal (Floor Only)
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 text-xs font-mono border border-orange-500/20 transition"
            >
              Select All (Full Home Gym)
            </button>
          </div>

          {/* Equipment Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {AVAILABLE_EQUIPMENT.map(item => {
              const isChecked = selected.includes(item.id);
              const isRequired = item.id === 'bodyweight';

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isChecked
                      ? 'bg-orange-950/30 border-orange-500/60 shadow-[0_0_15px_rgba(255,102,0,0.15)] ring-1 ring-orange-500/40'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-xl border ${
                          isChecked
                            ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        {getEquipmentIcon(item.id)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-xs sm:text-sm">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 line-clamp-1">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition ${
                        isChecked
                          ? 'bg-orange-500 border-orange-400 text-slate-950'
                          : 'border-white/20 bg-black/40'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Substitution Tip */}
                  <div className="text-[10px] font-mono text-slate-500 bg-black/30 p-1.5 rounded-lg border border-white/5">
                    💡 <span className="text-slate-400">{item.substitutionTip}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-slate-950" />
              <span>LOCK IN ARMORY &amp; ENTER FORGE • 錬成開始</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
