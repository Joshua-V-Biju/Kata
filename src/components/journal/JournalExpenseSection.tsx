import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getTodayStr, getDaysInMonth, formatDateDisplay } from '../../utils/dates';
import { PiggyBank, DollarSign, PenTool, Smile, Flame, Moon, Sparkles, Send, Check } from 'lucide-react';
import { DayLog } from '../../types';

export const JournalExpenseSection: React.FC = () => {
  const { dayLogs, selectedDate, setDayMoodAndNote, setDaySpending, settings } = useKataStore();
  const currentLog = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };

  const [spentInput, setSpentInput] = useState<string>(
    currentLog.amountSpent !== undefined ? String(currentLog.amountSpent) : ''
  );
  const [savingsInput, setSavingsInput] = useState<string>(
    currentLog.savingsDeposited !== undefined ? String(currentLog.savingsDeposited) : ''
  );
  const [noteInput, setNoteInput] = useState<string>(currentLog.journalNote || '');
  const [selectedMood, setSelectedMood] = useState<DayLog['mood'] | undefined>(currentLog.mood);

  // Sync state if selectedDate changes
  React.useEffect(() => {
    const log = dayLogs[selectedDate] || { date: selectedDate, completedHabitIds: [] };
    setSpentInput(log.amountSpent !== undefined ? String(log.amountSpent) : '');
    setSavingsInput(log.savingsDeposited !== undefined ? String(log.savingsDeposited) : '');
    setNoteInput(log.journalNote || '');
    setSelectedMood(log.mood);
  }, [selectedDate, dayLogs]);

  const moods: { key: DayLog['mood']; emoji: string; label: string; kanji: string; color: string }[] = [
    { key: 'zen', emoji: '🧘', label: 'Zen', kanji: '禅', color: '#00f2fe' },
    { key: 'energized', emoji: '⚡', label: 'Energized', kanji: '躍動', color: '#ffb300' },
    { key: 'focused', emoji: '🎯', label: 'Focused', kanji: '集中', color: '#a855f7' },
    { key: 'calm', emoji: '🌊', label: 'Calm', kanji: '静寂', color: '#00e5a3' },
    { key: 'inspired', emoji: '🌸', label: 'Inspired', kanji: '霊感', color: '#ff6b8b' },
    { key: 'fatigued', emoji: '🌙', label: 'Fatigued', kanji: '休息', color: '#64748b' },
  ];

  // Calculate monthly financial totals
  const now = new Date();
  const monthDays = getDaysInMonth(now.getFullYear(), now.getMonth());

  const monthlySpent = monthDays.reduce((acc, d) => {
    const l = dayLogs[d];
    return l?.amountSpent ? acc + l.amountSpent : acc;
  }, 0);

  const monthlySaved = monthDays.reduce((acc, d) => {
    const l = dayLogs[d];
    return l?.savingsDeposited ? acc + l.savingsDeposited : acc;
  }, 0);

  const savingsGoal = settings.monthlySavingsGoal || 300;
  const savingsPct = Math.min(100, Math.round((monthlySaved / savingsGoal) * 100));

  const handleSaveFinances = (e: React.FormEvent) => {
    e.preventDefault();
    const spentNum = spentInput !== '' ? parseFloat(spentInput) : undefined;
    const savingsNum = savingsInput !== '' ? parseFloat(savingsInput) : undefined;
    setDaySpending(selectedDate, spentNum, savingsNum);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setDayMoodAndNote(selectedDate, selectedMood, noteInput);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Daily Journal & Mood Section */}
      <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              Daily Reflection • 日々の所感
            </h3>
            <p className="text-xs text-slate-400">
              {formatDateDisplay(selectedDate)} — Capture your mental state & one-line note
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveJournal} className="space-y-4">
          {/* Mood Selector Buttons */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Mental State & Frequency
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {moods.map(m => {
                const isSelected = selectedMood === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => {
                      setSelectedMood(m.key);
                      setDayMoodAndNote(selectedDate, m.key, noteInput);
                    }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 border transition-all duration-200 select-none ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-105'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] font-display font-bold text-white">
                      {m.label}
                    </span>
                    <span className="text-[9px] font-display text-slate-400">
                      {m.kanji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* One-Line Reflection Note */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              One-Line Chronicle
            </label>
            <div className="relative">
              <input
                type="text"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="e.g. Cleared 2 hours on Animation keyframes. Clean mental focus."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 pr-12 transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
                title="Save Note"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Recent timeline entry indicator */}
        {currentLog.journalNote && (
          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-300 italic flex items-center gap-2">
            <span className="text-cyan-400">“</span>
            <span>{currentLog.journalNote}</span>
            <span className="text-cyan-400">”</span>
          </div>
        )}
      </div>

      {/* 2. Expense & Savings Tracker */}
      <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              Expense & Savings Forge • 収支と蓄財
            </h3>
            <p className="text-xs text-slate-400">
              Track daily outflow against budget & build monthly wealth
            </p>
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/80 to-teal-950/30 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-display font-bold text-white">Monthly Savings Target</span>
            </div>
            <span className="font-mono text-emerald-300 text-xs font-bold">
              ${monthlySaved} / ${savingsGoal}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(0,229,163,0.5)] transition-all duration-500"
              style={{ width: `${savingsPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>{savingsPct}% achieved this month</span>
            <span>${Math.max(0, savingsGoal - monthlySaved)} remaining</span>
          </div>
        </div>

        {/* Daily Entry Form */}
        <form onSubmit={handleSaveFinances} className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Spent Today ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={spentInput}
              onChange={e => setSpentInput(e.target.value)}
              placeholder="e.g. 15.50"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Savings Deposited ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={savingsInput}
              onChange={e => setSavingsInput(e.target.value)}
              placeholder="e.g. 10.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-slate-400">
              Month Total Outflow: <strong className="text-white">${monthlySpent.toFixed(2)}</strong>
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Ledger</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
