import React, { useState } from 'react';
import { CALISTHENICS_TREES, ProgressionTree, ProgressionNode } from '../../../utils/forgeProgressionTrees';
import { useForgeStore } from '../../../store/useForgeStore';
import { ALL_FORGE_EXERCISES } from '../../../utils/forgeExercises';
import { soundEngine } from '../../../utils/sound';
import {
  Flame,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Shield,
  Activity,
  Maximize2,
  AlignJustify,
  Grid
} from 'lucide-react';

export const ProgressionTreesView: React.FC = () => {
  const { startWorkout } = useForgeStore();
  const [selectedTreeId, setSelectedTreeId] = useState<string>('pushup');
  
  // Track unlocked node IDs in local storage
  const [unlockedNodes, setUnlockedNodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('forge_unlocked_nodes');
      return saved ? JSON.parse(saved) : ['pu-1', 'pu-2', 'pull-1', 'pull-2', 'dip-1', 'sq-1', 'hs-1', 'lsit-1'];
    } catch (e) {
      return ['pu-1', 'pu-2', 'pull-1', 'dip-1', 'sq-1'];
    }
  });

  const activeTree = CALISTHENICS_TREES.find(t => t.id === selectedTreeId) || CALISTHENICS_TREES[0];

  const toggleNodeMastery = (nodeId: string) => {
    soundEngine.playAnvilHit();
    const next = unlockedNodes.includes(nodeId)
      ? unlockedNodes.filter(id => id !== nodeId)
      : [...unlockedNodes, nodeId];
    setUnlockedNodes(next);
    try {
      localStorage.setItem('forge_unlocked_nodes', JSON.stringify(next));
    } catch (e) {}
  };

  const handleLaunchExercise = (exId: string, nodeName: string) => {
    const exDef = ALL_FORGE_EXERCISES.find(e => e.id === exId);
    if (exDef) {
      startWorkout(undefined, `Skill Focus: ${nodeName}`);
    }
  };

  const getTreeIcon = (id: string) => {
    switch (id) {
      case 'pushup':
        return <Activity className="w-4 h-4" />;
      case 'pullup':
        return <Maximize2 className="w-4 h-4" />;
      case 'dip':
        return <AlignJustify className="w-4 h-4" />;
      case 'squat':
        return <Flame className="w-4 h-4" />;
      case 'handstand':
        return <Shield className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
            SKILL LADDER • 技の系統樹
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Calisthenics Progression Trees
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          At home, progressive overload isn’t just adding 5kg; it’s mastering leverage, tempo, and unilateral control. Fulfill the unlock criteria to advance to each higher tier.
        </p>
      </div>

      {/* Tree Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CALISTHENICS_TREES.map(tree => {
          const isSelected = tree.id === selectedTreeId;
          const totalNodes = tree.nodes.length;
          const masteredCount = tree.nodes.filter(n => unlockedNodes.includes(n.id)).length;

          return (
            <button
              key={tree.id}
              type="button"
              onClick={() => setSelectedTreeId(tree.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-display font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/25 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {getTreeIcon(tree.id)}
              <span>{tree.name}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? 'bg-black/40 text-white' : 'bg-white/5 text-slate-400'}`}>
                {masteredCount}/{totalNodes}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tree Ladder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-display font-black text-white">
              {activeTree.name}
            </h2>
            <span className="text-xs font-mono text-orange-400">
              Focus: {activeTree.focus}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {activeTree.nodes.length} Tiers
          </span>
        </div>

        {/* Nodes Timeline */}
        <div className="space-y-3 relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange-500 via-amber-500/40 to-slate-800 pointer-events-none hidden sm:block" />

          {activeTree.nodes.map((node, index) => {
            const isMastered = unlockedNodes.includes(node.id);
            const prevMastered = index === 0 || unlockedNodes.includes(activeTree.nodes[index - 1].id);

            return (
              <div
                key={node.id}
                className={`p-5 rounded-2xl border transition-all sm:ml-12 relative ${
                  isMastered
                    ? 'bg-orange-950/20 border-orange-500/40 shadow-[0_0_20px_rgba(255,102,0,0.12)]'
                    : prevMastered
                    ? 'bg-black/40 border-white/10 hover:border-orange-500/30'
                    : 'bg-black/60 border-white/5 opacity-60'
                }`}
              >
                {/* Node Step Pin (visible on sm screens) */}
                <div
                  className={`hidden sm:flex absolute -left-12 top-6 w-6 h-6 rounded-full border-2 items-center justify-center -translate-x-1/2 text-[10px] font-mono font-bold transition ${
                    isMastered
                      ? 'bg-orange-500 border-orange-400 text-slate-950'
                      : 'bg-[#0e1017] border-slate-700 text-slate-400'
                  }`}
                >
                  {node.level}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold">
                        Tier {node.level} • {node.badgeKanji}
                      </span>
                      <h3 className="text-lg font-display font-black text-white">
                        {node.name}
                      </h3>
                      {isMastered && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>MASTERED</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {node.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs font-mono text-amber-300/90 flex items-center gap-2">
                      <span className="text-orange-400 font-bold uppercase text-[10px]">Unlock Target:</span>
                      <span>{node.unlockCriteria}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleLaunchExercise(node.exerciseId, node.name)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-slate-950 text-slate-200 text-xs font-mono font-semibold transition border border-white/5 flex items-center gap-1.5 cursor-pointer"
                      title="Launch session with this movement"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Train</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleNodeMastery(node.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isMastered
                          ? 'bg-orange-500 text-slate-950 shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isMastered ? 'Mastered' : 'Mark Achieved'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
