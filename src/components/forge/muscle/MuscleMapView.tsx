import React, { useState } from 'react';
import { useForgeStore } from '../../../store/useForgeStore';
import { ALL_FORGE_EXERCISES } from '../../../utils/forgeExercises';
import { MuscleGroup } from '../../../types/forge';
import { Activity, Flame, Info, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Dumbbell } from 'lucide-react';

interface MuscleData {
  id: MuscleGroup;
  name: string;
  kanji: string;
  category: 'upper_push' | 'upper_pull' | 'arms' | 'core' | 'lower';
  view: 'both' | 'front' | 'back';
}

const MUSCLE_DEFINITIONS: MuscleData[] = [
  { id: 'chest', name: 'Chest (Pectorals)', kanji: '大胸筋', category: 'upper_push', view: 'front' },
  { id: 'shoulders', name: 'Shoulders (Deltoids)', kanji: '三角筋', category: 'upper_push', view: 'both' },
  { id: 'triceps', name: 'Triceps', kanji: '上腕三頭筋', category: 'upper_push', view: 'both' },
  { id: 'back', name: 'Back & Lats', kanji: '広背筋・僧帽筋', category: 'upper_pull', view: 'back' },
  { id: 'biceps', name: 'Biceps', kanji: '上腕二頭筋', category: 'upper_pull', view: 'front' },
  { id: 'forearms', name: 'Forearms & Grip', kanji: '前腕筋群', category: 'arms', view: 'both' },
  { id: 'abs', name: 'Abs & Core', kanji: '腹直筋・体幹', category: 'core', view: 'front' },
  { id: 'quads', name: 'Quads (Quadriceps)', kanji: '大腿四頭筋', category: 'lower', view: 'front' },
  { id: 'hamstrings', name: 'Hamstrings', kanji: 'ハムストリング', category: 'lower', view: 'back' },
  { id: 'glutes', name: 'Glutes', kanji: '大臀筋', category: 'lower', view: 'back' },
  { id: 'calves', name: 'Calves', kanji: '下腿三頭筋', category: 'lower', view: 'both' }
];

export const MuscleMapView: React.FC = () => {
  const { workouts, startWorkout } = useForgeStore();
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('chest');

  // Compute sets performed in the last 7 days per muscle group
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const muscleSetsMap: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    shoulders: 0,
    biceps: 0,
    triceps: 0,
    forearms: 0,
    abs: 0,
    quads: 0,
    hamstrings: 0,
    glutes: 0,
    calves: 0
  };

  workouts.forEach(workout => {
    const wDate = new Date(workout.startedAt);
    if (wDate >= sevenDaysAgo) {
      workout.exercises.forEach(loggedEx => {
        const completedSetsCount = loggedEx.sets.filter(s => s.completed).length;
        if (completedSetsCount === 0) return;

        // Find exercise definition to get targeted muscle groups
        const def = ALL_FORGE_EXERCISES.find(e => e.id === loggedEx.exerciseId || e.name === loggedEx.name);
        if (def) {
          def.primaryMuscles.forEach(m => {
            if (muscleSetsMap[m] !== undefined) {
              muscleSetsMap[m] += completedSetsCount;
            }
          });
          def.secondaryMuscles.forEach(m => {
            if (muscleSetsMap[m] !== undefined) {
              muscleSetsMap[m] += Math.round(completedSetsCount * 0.5);
            }
          });
        } else {
          // Fallback guess from exercise name
          const n = loggedEx.name.toLowerCase();
          if (n.includes('push-up') || n.includes('press') || n.includes('dip')) {
            muscleSetsMap.chest += completedSetsCount;
            muscleSetsMap.triceps += completedSetsCount;
            muscleSetsMap.shoulders += Math.round(completedSetsCount * 0.5);
          } else if (n.includes('pull-up') || n.includes('row') || n.includes('chin-up')) {
            muscleSetsMap.back += completedSetsCount;
            muscleSetsMap.biceps += completedSetsCount;
          } else if (n.includes('squat') || n.includes('lunge')) {
            muscleSetsMap.quads += completedSetsCount;
            muscleSetsMap.glutes += completedSetsCount;
          } else if (n.includes('plank') || n.includes('hollow') || n.includes('sit') || n.includes('crunch')) {
            muscleSetsMap.abs += completedSetsCount;
          }
        }
      });
    }
  });

  // Calculate zone color & status for a given set count
  // 0-4: Neglected / Cold Blue-Grey
  // 5-9: Warming / Amber
  // 10-20: Optimal Hypertrophy / Molten Ember
  // 20+: High Volume / Crimson
  const getIntensityInfo = (sets: number) => {
    if (sets === 0) {
      return {
        label: 'Neglected',
        color: '#334155',
        textColor: 'text-slate-400',
        bgColor: 'bg-slate-800/80',
        borderColor: 'border-slate-700/50',
        glow: 'none'
      };
    }
    if (sets < 5) {
      return {
        label: 'Low Stimulus',
        color: '#38bdf8',
        textColor: 'text-sky-400',
        bgColor: 'bg-sky-950/40',
        borderColor: 'border-sky-500/30',
        glow: 'none'
      };
    }
    if (sets < 10) {
      return {
        label: 'Warming Up',
        color: '#f59e0b',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-950/40',
        borderColor: 'border-amber-500/30',
        glow: '0 0 10px rgba(245, 158, 11, 0.4)'
      };
    }
    if (sets <= 20) {
      return {
        label: 'Optimal Hypertrophy',
        color: '#ff6600',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-950/60',
        borderColor: 'border-orange-500/50',
        glow: '0 0 16px rgba(255, 102, 0, 0.7)'
      };
    }
    return {
      label: 'Ultra High Volume',
      color: '#ef4444',
      textColor: 'text-red-400',
      bgColor: 'bg-red-950/60',
      borderColor: 'border-red-500/50',
      glow: '0 0 18px rgba(239, 68, 68, 0.7)'
    };
  };

  const selectedDef = MUSCLE_DEFINITIONS.find(m => m.id === selectedMuscle) || MUSCLE_DEFINITIONS[0];
  const selectedSets = muscleSetsMap[selectedMuscle];
  const selectedIntensity = getIntensityInfo(selectedSets);

  // Recommended exercises for selected muscle
  const targetExercises = ALL_FORGE_EXERCISES.filter(
    e => e.primaryMuscles.includes(selectedMuscle) || e.secondaryMuscles.includes(selectedMuscle)
  ).slice(0, 6);

  // Generate smart coaching recommendations
  const getSuggestions = () => {
    const tips: { text: string; type: 'alert' | 'success' | 'info' }[] = [];

    // Check chest
    if (muscleSetsMap.chest >= 10 && muscleSetsMap.chest <= 20) {
      tips.push({
        text: `Chest is dialed into optimal hypertrophy (${muscleSetsMap.chest} hard sets this week). Keep hammering form.`,
        type: 'success'
      });
    }

    // Check lagging back or arms
    if (muscleSetsMap.biceps < 6 && muscleSetsMap.back >= 6) {
      tips.push({
        text: `Biceps are lagging behind (${muscleSetsMap.biceps} sets). Add chin-ups or backpack curls to round out arm thickness.`,
        type: 'alert'
      });
    }

    if (muscleSetsMap.back < 8) {
      tips.push({
        text: `Back & Lats need more volume (${muscleSetsMap.back} sets). Prioritize horizontal door-rows or pull-up bar work.`,
        type: 'alert'
      });
    }

    if (muscleSetsMap.quads < 6 || muscleSetsMap.hamstrings < 6) {
      tips.push({
        text: `Lower body stimulus is low (${muscleSetsMap.quads + muscleSetsMap.hamstrings} total leg sets). Don't skip unilateral leg power like Bulgarian split squats.`,
        type: 'info'
      });
    }

    if (muscleSetsMap.abs >= 8) {
      tips.push({
        text: `Core integrity is strong (${muscleSetsMap.abs} sets). Hollow body and L-sit progressions are building functional stability.`,
        type: 'success'
      });
    }

    if (tips.length === 0) {
      tips.push({
        text: 'Hit between 10-20 hard sets per muscle group per week to stimulate usable, visible muscular growth.',
        type: 'info'
      });
    }

    return tips;
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
            HYPERTROPHY RADAR • 筋肉負荷地図
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-black text-white">
              Anatomical Muscle Map &amp; Weekly Volume
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Science-backed hypertrophy targets: 10–20 hard sets per muscle group weekly. Molten orange indicates optimal growth stimulus.
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="text-slate-400">0 (Cold)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span className="text-sky-400">1-4</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-amber-400">5-9</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6600]" />
              <span className="text-orange-400 font-bold">10-20 (Optimal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-red-400">20+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Coaching Advice Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.slice(0, 2).map((sug, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              sug.type === 'alert'
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                : sug.type === 'success'
                ? 'bg-orange-950/20 border-orange-500/30 text-orange-200'
                : 'bg-slate-900/40 border-white/10 text-slate-300'
            }`}
          >
            {sug.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {sug.type === 'success' && <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />}
            {sug.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
            <p className="text-xs font-mono leading-relaxed">{sug.text}</p>
          </div>
        ))}
      </div>

      {/* Main Interactive Silhouette & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Anatomical Silhouette Card (7 cols) */}
        <div className="lg:col-span-7 forge-card p-6 rounded-3xl border border-white/10 space-y-6 flex flex-col items-center justify-between">
          
          {/* View Switcher: Front vs Back */}
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {activeView === 'front' ? 'Anterior Silhouette (Front)' : 'Posterior Silhouette (Back)'}
            </span>
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveView('front')}
                className={`px-4 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                  activeView === 'front'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Front View
              </button>
              <button
                type="button"
                onClick={() => setActiveView('back')}
                className={`px-4 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
                  activeView === 'back'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Back View
              </button>
            </div>
          </div>

          {/* Silhouette Interactive SVG Stage */}
          <div className="relative w-full max-w-sm h-96 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 240 380"
              className="w-full h-full filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            >
              {/* Head / Base Figure Skeleton */}
              <circle cx="120" cy="38" r="22" fill="#181b24" stroke="#2d3345" strokeWidth="2" />
              <path d="M 115 60 L 115 72 L 125 72 L 125 60 Z" fill="#181b24" />

              {activeView === 'front' ? (
                <>
                  {/* FRONT VIEW */}
                  {/* Shoulders Left & Right */}
                  <path
                    d="M 68 76 C 55 82 50 102 58 116 C 66 116 75 100 80 88 Z"
                    fill={getIntensityInfo(muscleSetsMap.shoulders).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('shoulders')}
                    style={{ filter: muscleSetsMap.shoulders >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />
                  <path
                    d="M 172 76 C 185 82 190 102 182 116 C 174 116 165 100 160 88 Z"
                    fill={getIntensityInfo(muscleSetsMap.shoulders).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('shoulders')}
                    style={{ filter: muscleSetsMap.shoulders >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Chest Left & Right */}
                  <path
                    d="M 82 76 C 115 76 117 84 117 116 C 85 116 75 96 82 76 Z"
                    fill={getIntensityInfo(muscleSetsMap.chest).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('chest')}
                    style={{ filter: muscleSetsMap.chest >= 10 ? 'drop-shadow(0 0 10px rgba(255,102,0,0.8))' : 'none' }}
                  />
                  <path
                    d="M 158 76 C 125 76 123 84 123 116 C 155 116 165 96 158 76 Z"
                    fill={getIntensityInfo(muscleSetsMap.chest).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('chest')}
                    style={{ filter: muscleSetsMap.chest >= 10 ? 'drop-shadow(0 0 10px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Biceps */}
                  <path
                    d="M 56 120 C 50 134 50 152 58 162 C 64 160 68 142 66 120 Z"
                    fill={getIntensityInfo(muscleSetsMap.biceps).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('biceps')}
                    style={{ filter: muscleSetsMap.biceps >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />
                  <path
                    d="M 184 120 C 190 134 190 152 182 162 C 176 160 172 142 174 120 Z"
                    fill={getIntensityInfo(muscleSetsMap.biceps).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('biceps')}
                    style={{ filter: muscleSetsMap.biceps >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Forearms */}
                  <path
                    d="M 56 168 C 48 184 46 208 52 222 C 58 220 62 200 64 168 Z"
                    fill={getIntensityInfo(muscleSetsMap.forearms).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('forearms')}
                  />
                  <path
                    d="M 184 168 C 192 184 194 208 188 222 C 182 220 178 200 176 168 Z"
                    fill={getIntensityInfo(muscleSetsMap.forearms).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('forearms')}
                  />

                  {/* Abs / Core */}
                  <path
                    d="M 90 122 L 150 122 L 144 192 L 96 192 Z"
                    fill={getIntensityInfo(muscleSetsMap.abs).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('abs')}
                    style={{ filter: muscleSetsMap.abs >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Quads Left & Right */}
                  <path
                    d="M 90 200 C 82 230 80 270 94 290 C 108 290 114 260 116 200 Z"
                    fill={getIntensityInfo(muscleSetsMap.quads).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('quads')}
                    style={{ filter: muscleSetsMap.quads >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />
                  <path
                    d="M 150 200 C 158 230 160 270 146 290 C 132 290 126 260 124 200 Z"
                    fill={getIntensityInfo(muscleSetsMap.quads).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('quads')}
                    style={{ filter: muscleSetsMap.quads >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Calves Front */}
                  <path
                    d="M 94 300 C 90 320 90 348 98 360 C 104 360 108 340 108 300 Z"
                    fill={getIntensityInfo(muscleSetsMap.calves).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('calves')}
                  />
                  <path
                    d="M 146 300 C 150 320 150 348 142 360 C 136 360 132 340 132 300 Z"
                    fill={getIntensityInfo(muscleSetsMap.calves).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('calves')}
                  />
                </>
              ) : (
                <>
                  {/* BACK VIEW */}
                  {/* Traps & Upper Back */}
                  <path
                    d="M 100 68 L 140 68 L 160 90 L 120 112 L 80 90 Z"
                    fill={getIntensityInfo(muscleSetsMap.back).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('back')}
                    style={{ filter: muscleSetsMap.back >= 10 ? 'drop-shadow(0 0 10px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Lats */}
                  <path
                    d="M 76 96 C 85 140 100 170 115 174 L 125 174 C 140 170 155 140 164 96 C 145 116 95 116 76 96 Z"
                    fill={getIntensityInfo(muscleSetsMap.back).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('back')}
                    style={{ filter: muscleSetsMap.back >= 10 ? 'drop-shadow(0 0 10px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Triceps */}
                  <path
                    d="M 56 116 C 50 134 50 156 58 164 C 64 162 68 142 66 116 Z"
                    fill={getIntensityInfo(muscleSetsMap.triceps).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('triceps')}
                    style={{ filter: muscleSetsMap.triceps >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />
                  <path
                    d="M 184 116 C 190 134 190 156 182 164 C 176 162 172 142 174 116 Z"
                    fill={getIntensityInfo(muscleSetsMap.triceps).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('triceps')}
                    style={{ filter: muscleSetsMap.triceps >= 10 ? 'drop-shadow(0 0 8px rgba(255,102,0,0.8))' : 'none' }}
                  />

                  {/* Glutes */}
                  <path
                    d="M 88 186 C 84 210 100 230 118 230 L 118 186 Z"
                    fill={getIntensityInfo(muscleSetsMap.glutes).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('glutes')}
                  />
                  <path
                    d="M 152 186 C 156 210 140 230 122 230 L 122 186 Z"
                    fill={getIntensityInfo(muscleSetsMap.glutes).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('glutes')}
                  />

                  {/* Hamstrings */}
                  <path
                    d="M 88 234 C 82 260 84 285 96 295 C 108 295 114 265 116 234 Z"
                    fill={getIntensityInfo(muscleSetsMap.hamstrings).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('hamstrings')}
                  />
                  <path
                    d="M 152 234 C 158 260 156 285 144 295 C 132 295 126 265 124 234 Z"
                    fill={getIntensityInfo(muscleSetsMap.hamstrings).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('hamstrings')}
                  />

                  {/* Calves Back */}
                  <path
                    d="M 94 300 C 88 322 88 348 98 360 C 106 360 110 340 110 300 Z"
                    fill={getIntensityInfo(muscleSetsMap.calves).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('calves')}
                  />
                  <path
                    d="M 146 300 C 152 322 152 348 142 360 C 134 360 130 340 130 300 Z"
                    fill={getIntensityInfo(muscleSetsMap.calves).color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80"
                    onClick={() => setSelectedMuscle('calves')}
                  />
                </>
              )}
            </svg>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Click any muscle group on the silhouette or the selector pills below
          </span>
        </div>

        {/* Selected Muscle Deep-Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-5">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">
                  SELECTED MUSCLE GROUP
                </span>
                <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                  <span>{selectedDef.name}</span>
                  <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-lg border border-orange-500/20">
                    {selectedDef.kanji}
                  </span>
                </h2>
              </div>

              {/* Status Badge */}
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${selectedIntensity.bgColor} ${selectedIntensity.borderColor} ${selectedIntensity.textColor}`}
              >
                {selectedIntensity.label}
              </div>
            </div>

            {/* Weekly Volume Gauge */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Weekly Hard Sets Logged:</span>
                <span className="text-lg font-bold text-white">
                  <span className={selectedIntensity.textColor}>{selectedSets}</span>
                  <span className="text-slate-500 text-xs font-normal"> / 10-20 target</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (selectedSets / 20) * 100)}%`,
                    backgroundColor: selectedIntensity.color
                  }}
                />
              </div>
            </div>

            {/* Top Recommended Home Exercises */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-orange-400" />
                <span>Prime Home Exercises for {selectedDef.name}</span>
              </h3>

              <div className="space-y-2">
                {targetExercises.map(ex => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-orange-500/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-display font-bold text-slate-200">{ex.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 capitalize">
                        {ex.difficulty} • {ex.category}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => startWorkout(undefined, `Focus: ${ex.name}`)}
                      className="px-2.5 py-1 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-slate-950 text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Train</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Muscle Group Quick Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MUSCLE_DEFINITIONS.map(m => {
          const sets = muscleSetsMap[m.id];
          const isSelected = selectedMuscle === m.id;
          const info = getIntensityInfo(sets);

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedMuscle(m.id);
                if (m.view !== 'both') setActiveView(m.view);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-slate-950 border-orange-400 shadow-md scale-105'
                  : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span>{m.name.split(' ')[0]}</span>
              <span className="opacity-75">({sets})</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
