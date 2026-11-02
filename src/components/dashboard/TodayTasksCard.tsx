import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getTodayStr, formatDateDisplay } from '../../utils/dates';
import { DailyTask } from '../../types';
import { CheckSquare, Plus, Check, Trash2, Edit2, X, ListFilter, Sparkles } from 'lucide-react';

export const TodayTasksCard: React.FC = () => {
  const { dayLogs, selectedDate, addDailyTask, toggleDailyTask, deleteDailyTask, editDailyTask, clearCompletedDailyTasks } = useKataStore();
  const todayStr = getTodayStr();
  const isToday = selectedDate === todayStr;

  const currentLog = dayLogs[selectedDate];
  const tasks: DailyTask[] = Array.isArray(currentLog?.tasks) ? currentLog.tasks : [];

  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addDailyTask(selectedDate, newTaskText.trim());
    setNewTaskText('');
  };

  const handleStartEdit = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingText.trim()) {
      editDailyTask(selectedDate, taskId, editingText.trim());
    }
    setEditingTaskId(null);
  };

  return (
    <div className="rounded-3xl glass-card p-5 md:p-6 border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-white flex items-center gap-2">
              <span>{isToday ? "Today's Tasks" : `Tasks for ${formatDateDisplay(selectedDate)}`}</span>
              <span className="text-xs font-mono text-cyan-400 font-normal">本日の課題</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isToday ? "Write your daily to-dos and check them off as you conquer them" : `Viewing & managing tasks for ${formatDateDisplay(selectedDate)}`}
            </p>
          </div>
        </div>

        {/* Status & Progress Counter */}
        {totalCount > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-slate-200">
                {completedCount} of {totalCount} Done ({progressPct}%)
              </span>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAddTask} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder={isToday ? "Write a task for today... (e.g. Finish project outline, buy groceries)" : `Write a task for ${formatDateDisplay(selectedDate)}...`}
            className="w-full py-2.5 px-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Filter Chips & Clear Completed (if tasks exist) */}
      {totalCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => clearCompletedDailyTasks(selectedDate)}
              className="text-[11px] font-mono text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2 pt-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`p-3 md:p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                  task.completed
                    ? 'bg-emerald-950/15 border-emerald-500/20'
                    : 'bg-black/30 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Left: Custom Checkbox & Text */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleDailyTask(selectedDate, task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-slate-950 shadow-sm'
                        : 'border-white/20 hover:border-cyan-400 bg-white/5 text-transparent'
                    }`}
                    title={task.completed ? "Mark as pending" : "Mark as done"}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${task.completed ? 'block' : 'opacity-0'}`} />
                  </button>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(task.id);
                          if (e.key === 'Escape') setEditingTaskId(null);
                        }}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-black/60 border border-cyan-400 text-white text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(task.id)}
                        className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTaskId(null)}
                        className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => toggleDailyTask(selectedDate, task.id)}
                      className={`text-sm cursor-pointer select-none truncate flex-1 transition ${
                        task.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-200 font-medium hover:text-white'
                      }`}
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                {/* Right: Actions (Edit & Delete) */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(task)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                      title="Edit task text"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDailyTask(selectedDate, task.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Delete task"
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
            <div className="w-9 h-9 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {totalCount === 0
                ? "No tasks logged for today yet."
                : filter === 'pending'
                ? "All tasks completed! Fantastic focus! 🔥"
                : "No completed tasks yet."}
            </p>
            {totalCount === 0 && (
              <p className="text-[11px] text-slate-500">
                Type what you need to get done above and press Enter to start.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
