import React, { useState } from 'react';
import { soundEngine } from '../../../utils/sound';
import { fireLevelUpConfetti } from '../../../utils/confetti';
import {
  Utensils,
  Droplet,
  Plus,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  RotateCcw,
  ShieldCheck,
  Coffee,
  Sun,
  Dumbbell,
  Moon
} from 'lucide-react';

export const NutritionView: React.FC = () => {
  // Protein state in grams (stored in localStorage)
  const [proteinCurrent, setProteinCurrent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('forge_nutrition_protein');
      return saved ? parseInt(saved, 10) : 85;
    } catch (e) {
      return 85;
    }
  });

  const [proteinGoal, setProteinGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('forge_nutrition_protein_goal');
      return saved ? parseInt(saved, 10) : 140;
    } catch (e) {
      return 140;
    }
  });

  // Water glasses drank today (0 to 8)
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('forge_nutrition_water');
      return saved ? parseInt(saved, 10) : 5;
    } catch (e) {
      return 5;
    }
  });

  // 4 Daily Growth Pillars Checked
  const [pillarsChecked, setPillarsChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('forge_nutrition_pillars');
      return saved ? JSON.parse(saved) : { morning: true, pre: true, post: false, night: false };
    } catch (e) {
      return { morning: true, pre: true, post: false, night: false };
    }
  });

  const addProtein = (grams: number) => {
    soundEngine.playAnvilHit();
    const next = Math.max(0, proteinCurrent + grams);
    setProteinCurrent(next);
    try {
      localStorage.setItem('forge_nutrition_protein', next.toString());
    } catch (e) {}

    if (proteinCurrent < proteinGoal && next >= proteinGoal) {
      soundEngine.playLevelUp();
      fireLevelUpConfetti();
    }
  };

  const resetDailyFuel = () => {
    setProteinCurrent(0);
    setWaterGlasses(0);
    setPillarsChecked({ morning: false, pre: false, post: false, night: false });
    try {
      localStorage.setItem('forge_nutrition_protein', '0');
      localStorage.setItem('forge_nutrition_water', '0');
      localStorage.setItem('forge_nutrition_pillars', JSON.stringify({ morning: false, pre: false, post: false, night: false }));
    } catch (e) {}
  };

  const toggleWaterGlass = (index: number) => {
    soundEngine.playClick();
    const next = index + 1 === waterGlasses ? index : index + 1;
    setWaterGlasses(next);
    try {
      localStorage.setItem('forge_nutrition_water', next.toString());
    } catch (e) {}
  };

  const togglePillar = (key: string) => {
    soundEngine.playClick();
    const next = { ...pillarsChecked, [key]: !pillarsChecked[key] };
    setPillarsChecked(next);
    try {
      localStorage.setItem('forge_nutrition_pillars', JSON.stringify(next));
    } catch (e) {}
  };

  const proteinPct = Math.min(100, Math.round((proteinCurrent / proteinGoal) * 100));

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950">
            <Utensils className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            SUPPORTIVE FUELING • 筋肥大栄養
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-black text-white">
              Muscle Growth Nutrition &amp; Hydration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Zero diet guilt. Food is structural material to build dense, functional muscle fibers and recharge glycogen stores.
            </p>
          </div>

          <button
            type="button"
            onClick={resetDailyFuel}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Day</span>
          </button>
        </div>
      </div>

      {/* Main Trackers Grid: Protein & Water */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Protein Target Card */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-white">
                    Daily Protein Target
                  </h2>
                  <span className="text-[10px] font-mono text-slate-500">
                    Myofibrillar Hypertrophy Standard (~1.6-2g/kg)
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono text-orange-400 font-bold bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-500/30">
                {proteinPct}%
              </span>
            </div>

            {/* Protein Progress Gauge */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-3xl font-black text-white">
                  {proteinCurrent}g
                </span>
                <span className="text-xs text-slate-400">
                  Goal: <span className="text-orange-400 font-bold">{proteinGoal}g</span>
                </span>
              </div>

              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(255,102,0,0.7)] transition-all duration-500"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">
                Quick Log Protein Source:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => addProtein(25)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 hover:text-slate-950 border border-white/5 text-slate-300 text-xs font-mono font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer"
                >
                  <span className="text-sm font-black">+25g</span>
                  <span className="text-[9px] opacity-75">Whey / Shake</span>
                </button>

                <button
                  type="button"
                  onClick={() => addProtein(35)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 hover:text-slate-950 border border-white/5 text-slate-300 text-xs font-mono font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer"
                >
                  <span className="text-sm font-black">+35g</span>
                  <span className="text-[9px] opacity-75">Meat / Tofu Meal</span>
                </button>

                <button
                  type="button"
                  onClick={() => addProtein(15)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 hover:text-slate-950 border border-white/5 text-slate-300 text-xs font-mono font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer"
                >
                  <span className="text-sm font-black">+15g</span>
                  <span className="text-[9px] opacity-75">Eggs / Yogurt</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Hydration Card */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
                  <Droplet className="w-4 h-4 fill-sky-400" />
                </div>
                <div>
                  <h2 className="text-base font-display font-bold text-white">
                    Hydration &amp; Cellular Pump
                  </h2>
                  <span className="text-[10px] font-mono text-slate-500">
                    Target: 8 Glasses (~2.5 Liters) for joint fluid &amp; bloodflow
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono text-sky-400 font-bold bg-sky-950/40 px-2 py-0.5 rounded-lg border border-sky-500/30">
                {waterGlasses} / 8 Glasses
              </span>
            </div>

            {/* Interactive Glasses Bar */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-4 rounded-2xl bg-black/60 border border-white/5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
                const isFull = idx < waterGlasses;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleWaterGlass(idx)}
                    className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isFull
                        ? 'bg-sky-600/30 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.4)] scale-105'
                        : 'bg-slate-900 border-white/5 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <Droplet className={`w-4 h-4 ${isFull ? 'fill-sky-400 text-sky-400' : ''}`} />
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Muscles are ~75% water. Dehydration by even 2% reduces strength output and makes calisthenics levers significantly harder.
            </p>
          </div>
        </div>

      </div>

      {/* 4 Pillars of Hypertrophy Meal Timing */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span>4 Daily Muscle Growth Pillars</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Morning */}
          <div
            onClick={() => togglePillar('morning')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              pillarsChecked.morning
                ? 'bg-orange-950/30 border-orange-500/50 text-white'
                : 'forge-card border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-amber-400" />
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                pillarsChecked.morning ? 'bg-orange-600 border-orange-400 text-slate-950' : 'border-slate-700'
              }`}>
                {pillarsChecked.morning && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">Morning Ignition</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Eggs, oats, peanut butter, or shake to stop overnight catabolism and ignite protein synthesis.
              </p>
            </div>
          </div>

          {/* Pillar 2: Pre-Workout */}
          <div
            onClick={() => togglePillar('pre')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              pillarsChecked.pre
                ? 'bg-orange-950/30 border-orange-500/50 text-white'
                : 'forge-card border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Coffee className="w-5 h-5 text-orange-400" />
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                pillarsChecked.pre ? 'bg-orange-600 border-orange-400 text-slate-950' : 'border-slate-700'
              }`}>
                {pillarsChecked.pre && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">Pre-Workout Charge</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Easy-digesting carbs (banana, honey, toast) + water 60-90m before workout for raw muscle pump.
              </p>
            </div>
          </div>

          {/* Pillar 3: Post-Workout */}
          <div
            onClick={() => togglePillar('post')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              pillarsChecked.post
                ? 'bg-orange-950/30 border-orange-500/50 text-white'
                : 'forge-card border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Dumbbell className="w-5 h-5 text-red-400" />
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                pillarsChecked.post ? 'bg-orange-600 border-orange-400 text-slate-950' : 'border-slate-700'
              }`}>
                {pillarsChecked.post && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">Post-Workout Anvil</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Substantial meal with 30-40g protein + complex carbohydrates to replenish depleted muscle glycogen.
              </p>
            </div>
          </div>

          {/* Pillar 4: Night Recovery */}
          <div
            onClick={() => togglePillar('night')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              pillarsChecked.night
                ? 'bg-orange-950/30 border-orange-500/50 text-white'
                : 'forge-card border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                pillarsChecked.night ? 'bg-orange-600 border-orange-400 text-slate-950' : 'border-slate-700'
              }`}>
                {pillarsChecked.night && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-white">Night Restoration</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Slow-digesting protein (casein/yogurt/cottage cheese) + magnesium to fuel growth hormone during sleep.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs font-mono text-slate-400 leading-relaxed">
          <strong className="text-slate-200">The Forge Fueling Ethos:</strong> To build dense, visible muscle at home, your body requires surplus energy and ample amino acids. Never starve your workouts. Feed the iron furnace consistently.
        </p>
      </div>

    </div>
  );
};
