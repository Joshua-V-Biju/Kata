import React from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { ShieldCheck, Volume2, Clock, RotateCcw, Scale } from 'lucide-react';

export const ForgeSettingsView: React.FC = () => {
  const { settings, updateSettings, resetForgeData } = useForgeStore();

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-1">
        <h2 className="text-xl font-display font-black text-white">
          Forge Preferences &amp; Kata Bridge
        </h2>
        <p className="text-xs text-slate-400">
          Customize rest intervals, units, and the one-way synchronization to Kata.
        </p>
      </div>

      {/* Kata Bridge Section */}
      <div className="p-5 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <h3 className="font-display font-bold text-white text-sm">
                Kata “Workout/Yoga” Habit Bridge
              </h3>
            </div>
            <p className="text-xs text-slate-300/80 leading-relaxed max-w-md">
              When enabled, saving a finished workout in Forge automatically marks today’s “Workouts/Yoga” cell as done in Kata. No XP, currency, or other data is shared.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={settings.syncToKataWorkoutHabit}
              onChange={(e) => updateSettings({ syncToKataWorkoutHabit: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>

      {/* Rest Timer Presets */}
      <div className="p-5 rounded-2xl forge-card border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <h3 className="font-display font-bold text-white text-sm">
            Default Rest Timer Duration
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Standard rest interval started automatically after each checked set.
        </p>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {[45, 60, 90, 120].map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => updateSettings({ restTimerDuration: sec })}
              className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition border ${
                settings.restTimerDuration === sec
                  ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/5 hover:border-white/20'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div className="p-5 rounded-2xl forge-card border border-white/5 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-orange-400" />
            <h3 className="font-display font-bold text-white text-sm">
              Weight Display Unit
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Kilograms (kg) or Pounds (lbs) for added load / backpacks.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            type="button"
            onClick={() => updateSettings({ weightUnit: 'kg' })}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              settings.weightUnit === 'kg'
                ? 'bg-orange-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            KG
          </button>
          <button
            type="button"
            onClick={() => updateSettings({ weightUnit: 'lbs' })}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              settings.weightUnit === 'lbs'
                ? 'bg-orange-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LBS
          </button>
        </div>
      </div>

      {/* Audio Effects */}
      <div className="p-5 rounded-2xl forge-card border border-white/5 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-400" />
            <h3 className="font-display font-bold text-white text-sm">
              Industrial Anvil Audio FX
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Resonant metallic anvil hits on set completions and rest countdown pings.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all Forge workouts and restore sample home training seeds?')) {
              resetForgeData();
            }
          }}
          className="text-xs font-mono text-slate-500 hover:text-rose-400 transition underline"
        >
          Reset Forge Sample Data
        </button>
      </div>

    </div>
  );
};
