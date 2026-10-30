import React, { useState, useEffect } from 'react';
import { useKataStore } from './store/useKataStore';
import { getTodayStr } from './utils/dates';
import { Header } from './components/layout/Header';
import { Navigation, TabKey } from './components/layout/Navigation';
import { SakuraEffect } from './components/layout/SakuraEffect';
import { ToastContainer } from './components/layout/ToastContainer';
import { LevelUpModal } from './components/layout/LevelUpModal';
import { DailyQuoteModal } from './components/dashboard/DailyQuoteModal';
import { DailyQuoteBanner } from './components/dashboard/DailyQuoteBanner';

import { HeroCard } from './components/dashboard/HeroCard';
import { MomentumRings } from './components/dashboard/MomentumRings';
import { CompletionsChart } from './components/dashboard/CompletionsChart';
import { DailyQuestsCard } from './components/dashboard/DailyQuestsCard';
import { TodayHabitsList } from './components/dashboard/TodayHabitsList';

import { MonthlyGrid } from './components/tracker/MonthlyGrid';
import { WeeklyTimetable } from './components/planner/WeeklyTimetable';
import { VoltronSprintModal } from './components/planner/VoltronSprintModal';
import { InsightsView } from './components/insights/InsightsView';
import { BadgesGrid } from './components/badges/BadgesGrid';
import { JournalExpenseSection } from './components/journal/JournalExpenseSection';

import { SettingsModal } from './components/settings/SettingsModal';
import { HabitManagerModal } from './components/manager/HabitManagerModal';
import { HabitFormModal } from './components/manager/HabitFormModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showHabitManager, setShowHabitManager] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const {
    habits,
    selectedDate,
    toggleHabit,
    startSprintTimer,
    sprintTimer,
    pauseSprintTimer,
    resumeSprintTimer,
    settings,
    lastSeenQuoteDate,
    openDailyQuoteModal
  } = useKataStore();

  // Auto-trigger daily motivation quote when opening the app on a new day
  useEffect(() => {
    const today = getTodayStr();
    if (lastSeenQuoteDate !== today) {
      openDailyQuoteModal();
    }
  }, [lastSeenQuoteDate, openDailyQuoteModal]);

  // Handle keyboard shortcuts (1-9 toggles habit, Space toggles sprint timer, Esc closes modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowHabitManager(false);
        setShowHabitForm(false);
        setShowSprintModal(false);
        return;
      }

      // Numbers 1-9 to toggle corresponding habit
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const activeHabits = habits.filter(h => !h.archived);
        if (activeHabits[num - 1]) {
          toggleHabit(activeHabits[num - 1].id, selectedDate);
        }
      }

      // Space to launch / toggle sprint timer
      if (e.code === 'Space' && activeTab === 'planner') {
        e.preventDefault();
        if (sprintTimer.active) {
          if (sprintTimer.isPaused) resumeSprintTimer();
          else pauseSprintTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [habits, selectedDate, toggleHabit, sprintTimer, resumeSprintTimer, pauseSprintTimer, activeTab]);

  return (
    <div className={`min-h-screen relative flex flex-col ${settings.theme === 'light' ? 'light' : 'dark'}`}>
      
      {/* Anime Ambient Background Glow */}
      <div className="ambient-glow" />

      {/* Floating Sakura Petals Atmosphere */}
      <SakuraEffect />

      {/* Top Header */}
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onOpenHabitManager={() => setShowHabitManager(true)}
        onLaunchSprint={() => {
          if (!sprintTimer.active) {
            startSprintTimer('voltron-mon', 120);
          }
          setShowSprintModal(true);
        }}
      />

      {/* Navigation Pills */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Daily Heavy Motivation Mandate Banner */}
            <DailyQuoteBanner />

            {/* Hero Card */}
            <HeroCard />

            {/* Three Progress Rings */}
            <MomentumRings />

            {/* Glowing Line Chart & Daily Trials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CompletionsChart />
              </div>
              <div className="lg:col-span-1">
                <DailyQuestsCard />
              </div>
            </div>

            {/* Today's Habits Large Tappable Cards */}
            <TodayHabitsList
              onOpenHabitManager={() => setShowHabitManager(true)}
              onOpenHabitForm={() => setShowHabitForm(true)}
            />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="animate-fade-in">
            <MonthlyGrid />
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="animate-fade-in">
            <WeeklyTimetable />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="animate-fade-in">
            <InsightsView />
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="animate-fade-in">
            <BadgesGrid />
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-6 animate-fade-in">
            <JournalExpenseSection />
          </div>
        )}
      </main>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Celebratory Level-Up Anime Modal */}
      <LevelUpModal />

      {/* Daily Heavy Motivation Mandate Modal */}
      <DailyQuoteModal />

      {/* Voltron Sprint 2-Hour Focus Timer Modal */}
      {showSprintModal && (
        <VoltronSprintModal onClose={() => setShowSprintModal(false)} />
      )}

      {/* Habit Manager Modal */}
      {showHabitManager && (
        <HabitManagerModal onClose={() => setShowHabitManager(false)} />
      )}

      {/* New Habit Form Modal */}
      {showHabitForm && (
        <HabitFormModal onClose={() => setShowHabitForm(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Minimal Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 font-mono relative z-10 border-t border-white/5">
        <span>Kata • 習慣 | Anime Disciplinary Command Center</span>
        <span className="mx-2">•</span>
        <span>Local-First & PWA Enabled</span>
      </footer>

    </div>
  );
};
export default App;
