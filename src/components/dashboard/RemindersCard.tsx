import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { KataReminder } from '../../types';
import { Bell, Plus, Check, Trash2, Edit2, X, Pin, Clock, AlertCircle, Sparkles } from 'lucide-react';

export const RemindersCard: React.FC = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder, editReminder, togglePinReminder, clearCompletedReminders } = useKataStore();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('Today');
  const [dueTime, setDueTime] = useState<string>('');
  const [priority, setPriority] = useState<KataReminder['priority']>('normal');
  const [isPinned, setIsPinned] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [filter, setFilter] = useState<'all' | 'active' | 'pinned' | 'completed'>('active');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);
  const pinnedReminders = reminders.filter(r => r.pinned && !r.completed);

  const filteredReminders = reminders
    .filter(r => {
      if (filter === 'active') return !r.completed;
      if (filter === 'pinned') return r.pinned && !r.completed;
      if (filter === 'completed') return r.completed;
      return true;
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // High/Urgent priority first
      const priorityWeight: Record<KataReminder['priority'], number> = {
        urgent: 3,
        high: 2,
        normal: 1,
        low: 0
      };
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      dueDate: dueDate.trim() || undefined,
      dueTime: dueTime.trim() || undefined,
      priority,
      pinned: isPinned,
      category: 'general'
    });

    setTitle('');
    setDueTime('');
    setPriority('normal');
    setIsPinned(false);
    setShowAdvanced(false);
  };

  const handleStartEdit = (reminder: KataReminder) => {
    setEditingId(reminder.id);
    setEditingTitle(reminder.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editingTitle.trim()) {
      editReminder(id, { title: editingTitle.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="rounded-3xl glass-card p-5 md:p-6 border border-white/10 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* Background Japanese Watermark with Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -right-6 -bottom-8 text-9xl font-display font-black text-slate-900/[0.045] dark:text-white/[0.035] select-none leading-none">
          備忘
        </div>
        {/* Ambient subtle light glow behind kanji */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-amber-500/20 dark:bg-amber-400/15 blur-3xl pointer-events-none" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Reminders</span>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-normal">備忘録</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Active alerts, upcoming deadlines & critical notices
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span>{activeReminders.length} Active</span>
          </span>
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a reminder... (e.g. Doctor appointment, pay bill, exam on Friday)"
            className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition font-sans"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2.5 rounded-2xl border transition text-xs font-medium cursor-pointer shrink-0 ${
              showAdvanced || priority !== 'normal' || isPinned || dueTime
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle Due Time & Priority options"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>

        {/* Optional Options Drawer (Due date, time, priority, pin) */}
        {showAdvanced && (
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 animate-fade-in text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-mono">Due:</span>
              {['Today', 'Tomorrow', 'This Week'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDueDate(d)}
                  className={`px-2 py-1 rounded-lg transition font-mono text-[11px] ${
                    dueDate === d
                      ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {d}
                </button>
              ))}

              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="Time (e.g. 6:00 PM)"
                className="py-1 px-2 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] font-mono w-28 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-mono">Priority:</span>
                {(['normal', 'high', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-0.5 rounded-lg uppercase tracking-wider text-[10px] font-bold transition ${
                      priority === p
                        ? p === 'urgent'
                          ? 'bg-rose-500/30 border border-rose-400 text-rose-300'
                          : p === 'high'
                          ? 'bg-amber-500/30 border border-amber-400 text-amber-300'
                          : 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition ${
                  isPinned
                    ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Pin className="w-3 h-3" />
                <span>{isPinned ? 'Pinned to top' : 'Pin to top'}</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Filter Tabs & Clear Done */}
      {reminders.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'active'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active ({activeReminders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pinned')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'pinned'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pinned ({pinnedReminders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'completed'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Done ({completedReminders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({reminders.length})
            </button>
          </div>

          {completedReminders.length > 0 && (
            <button
              type="button"
              onClick={clearCompletedReminders}
              className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
            >
              Clear done ({completedReminders.length})
            </button>
          )}
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-2 pt-1 flex-1">
        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder) => {
            const isEditing = editingId === reminder.id;

            return (
              <div
                key={reminder.id}
                className={`p-3 md:p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                  reminder.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-500/20 opacity-75'
                    : reminder.pinned
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-l-amber-500 border-amber-300/60 dark:border-amber-500/30 shadow-sm'
                    : reminder.priority === 'urgent'
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-500/30'
                    : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                {/* Left: Checkbox & Content */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleReminder(reminder.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      reminder.completed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 shadow-sm'
                        : reminder.priority === 'urgent'
                        ? 'border-rose-400/60 hover:border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-transparent'
                        : 'border-slate-300 dark:border-white/20 hover:border-amber-500 dark:hover:border-amber-400 bg-white dark:bg-white/5 text-transparent'
                    }`}
                    title={reminder.completed ? "Mark as active" : "Mark as completed"}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${reminder.completed ? 'block' : 'opacity-0'}`} />
                  </button>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        autoFocus
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(reminder.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-black/60 border border-amber-500 dark:border-amber-400 text-slate-900 dark:text-white text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(reminder.id)}
                        className="p-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {reminder.pinned && (
                          <span className="p-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0" title="Pinned reminder">
                            <Pin className="w-3 h-3 fill-current" />
                          </span>
                        )}

                        <span
                          onClick={() => toggleReminder(reminder.id)}
                          className={`text-sm cursor-pointer select-none font-medium truncate ${
                            reminder.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-200'
                          }`}
                        >
                          {reminder.title}
                        </span>

                        {/* Priority Badge */}
                        {reminder.priority === 'urgent' && !reminder.completed && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-200 font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-ping" />
                            URGENT
                          </span>
                        )}
                        {reminder.priority === 'high' && !reminder.completed && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 font-mono text-[9px] font-black uppercase tracking-wider shrink-0">
                            HIGH
                          </span>
                        )}
                      </div>

                      {/* Due info */}
                      {(reminder.dueDate || reminder.dueTime) && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{reminder.dueDate || 'Today'}</span>
                          {reminder.dueTime && <span>• {reminder.dueTime}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePinReminder(reminder.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        reminder.pinned
                          ? 'text-amber-400 hover:bg-amber-500/20'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
                      }`}
                      title={reminder.pinned ? "Unpin reminder" : "Pin reminder to top"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(reminder)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-amber-300 transition cursor-pointer"
                      title="Edit reminder"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="py-6 px-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-1.5">
            <div className="w-9 h-9 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {reminders.length === 0
                ? "No reminders set yet."
                : filter === 'active'
                ? "No active reminders. Everything is conquered! ⚡"
                : "No matching reminders found."}
            </p>
            {reminders.length === 0 && (
              <p className="text-[11px] text-slate-500">
                Add anything important you don't want to forget above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
