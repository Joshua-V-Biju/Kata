import React, { useState, useEffect } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { VoltronBlock } from '../../types';
import { getDayShortName } from '../../utils/dates';
import { VoltronCockpit } from './VoltronCockpit';
import { BlockEditModal } from './BlockEditModal';
import { Zap, Clock, Plus, Edit2, Play, CheckCircle2, LayoutGrid, Radio } from 'lucide-react';

export const WeeklyTimetable: React.FC = () => {
  const { timetable, habits, startSprintTimer, sprintTimer, completeVoltronSprint, dayLogs } = useKataStore();
  
  const [plannerViewMode, setPlannerViewMode] = useState<'cockpit' | 'timetable'>('timetable');

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(() => {
    const today = new Date().getDay();
    return today;
  });

  const [editingBlock, setEditingBlock] = useState<VoltronBlock | null>(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  // Real-time clock for "Current Block" detection
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const days = [
    { idx: 1, name: 'Monday', kanji: '月曜日' },
    { idx: 2, name: 'Tuesday', kanji: '火曜日' },
    { idx: 3, name: 'Wednesday', kanji: '水曜日' },
    { idx: 4, name: 'Thursday', kanji: '木曜日' },
    { idx: 5, name: 'Friday', kanji: '金曜日' },
    { idx: 6, name: 'Saturday', kanji: '土曜日' },
    { idx: 0, name: 'Sunday', kanji: '日曜日' }
  ];

  const currentDayOfWeek = new Date().getDay();

  const isBlockCurrent = (block: VoltronBlock) => {
    if (block.dayOfWeek !== currentDayOfWeek) return false;
    return currentTimeStr >= block.startTime && currentTimeStr <= block.endTime;
  };

  const dayBlocks = timetable
    .filter(b => b.dayOfWeek === selectedDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleLaunchSprint = (block: VoltronBlock) => {
    startSprintTimer(block.id, 120);
    setPlannerViewMode('cockpit');
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-display font-black text-white tracking-tight">
                {plannerViewMode === 'cockpit' ? 'Voltron Tactical Cockpit • 指令室' : 'Weekly Timetable • 週間計画'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {plannerViewMode === 'cockpit'
                ? 'Full 2-Hour Creative Chamber // 5 Lions Protocol // Binaural Focus Drone'
                : 'Live time-block tracking • 16:00–18:00 Voltron Sprint links directly to habits'}
            </p>
          </div>
        </div>

        {/* View mode toggle pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setPlannerViewMode('timetable')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                plannerViewMode === 'timetable'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Timetable</span>
            </button>
            <button
              onClick={() => setPlannerViewMode('cockpit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                plannerViewMode === 'cockpit'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Voltron Cockpit</span>
              {sprintTimer.active && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>
          </div>

          {plannerViewMode === 'timetable' && (
            <button
              onClick={() => setIsAddingBlock(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          )}
        </div>
      </div>

      {/* Conditionally Render Cockpit OR Timetable */}
      {plannerViewMode === 'cockpit' ? (
        <VoltronCockpit />
      ) : (
        <>
          {/* Weekday Selector Tabs */}
          <div className="grid grid-cols-7 gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-white/5 overflow-x-auto">
            {days.map(d => {
              const isSelected = selectedDayOfWeek === d.idx;
              const isToday = currentDayOfWeek === d.idx;
              const sprintInDay = timetable.some(b => b.dayOfWeek === d.idx && b.isVoltronSprint);

              return (
                <button
                  key={d.idx}
                  onClick={() => setSelectedDayOfWeek(d.idx)}
                  className={`py-3 px-2 rounded-xl text-center transition-all duration-200 relative select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/10 border border-purple-500/40 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">
                    {d.name.slice(0, 3)}
                  </span>
                  <span className={`block text-xs font-display font-bold mt-0.5 ${
                    isSelected ? 'text-white' : ''
                  }`}>
                    {d.kanji}
                  </span>

                  <div className="flex items-center justify-center gap-1 mt-1">
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe]" title="Today" />
                    )}
                    {sprintInDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Voltron Sprint" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timetable Blocks List */}
          <div className="space-y-3">
            {dayBlocks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card border border-white/5 space-y-2">
                <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-400 font-medium">No schedule blocks set for this day.</p>
                <button
                  onClick={() => setIsAddingBlock(true)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  + Add a block to this day
                </button>
              </div>
            ) : (
              dayBlocks.map(block => {
                const isLive = isBlockCurrent(block);
                const linkedHabit = habits.find(h => h.id === block.linkedHabitId);

                return (
                  <div
                    key={block.id}
                    className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden ${
                      block.isVoltronSprint
                        ? 'bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-900/40 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.12)]'
                        : 'glass-card border-white/5 hover:border-white/10'
                    } ${isLive ? 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(0,242,254,0.3)] animate-pulse-slow' : ''}`}
                  >
                    {isLive && (
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-cyan-400 to-teal-300" />
                    )}

                    <div className="flex items-start md:items-center gap-4 min-w-0">
                      <div className="shrink-0 p-2.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-center">
                        <span className="text-xs font-bold text-white block">
                          {block.startTime}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {block.endTime}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-display font-bold text-white truncate">
                            {block.title}
                          </h3>

                          {isLive && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-bold tracking-wider uppercase animate-pulse">
                              ● LIVE NOW
                            </span>
                          )}

                          {block.isVoltronSprint && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                              <Zap className="w-3 h-3 text-purple-400" />
                              <span>Voltron Sprint (2h)</span>
                            </span>
                          )}
                        </div>

                        {block.description && (
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {block.description}
                          </p>
                        )}

                        {linkedHabit && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
                            <span className="text-slate-500">Auto-ticks:</span>
                            <span className="font-semibold flex items-center gap-1" style={{ color: linkedHabit.color }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: linkedHabit.color }} />
                              {linkedHabit.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {block.isVoltronSprint ? (
                        <button
                          onClick={() => handleLaunchSprint(block)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Launch Voltron Cockpit</span>
                        </button>
                      ) : block.linkedHabitId ? (
                        <button
                          onClick={() => completeVoltronSprint(block.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => setEditingBlock(block)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                        title="Edit Block"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Add / Edit Block Modal */}
      {(editingBlock || isAddingBlock) && (
        <BlockEditModal
          initialBlock={editingBlock}
          defaultDayOfWeek={selectedDayOfWeek}
          onClose={() => {
            setEditingBlock(null);
            setIsAddingBlock(false);
          }}
        />
      )}
    </div>
  );
};
