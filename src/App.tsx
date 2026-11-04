import React, { useState, useEffect } from 'react';
import { useKataStore } from './store/useKataStore';
import { useForgeStore } from './store/useForgeStore';
import { getTodayStr } from './utils/dates';
import { soundEngine } from './utils/sound';
import { Header } from './components/layout/Header';
import { Navigation, TabKey } from './components/layout/Navigation';
import { SakuraEffect } from './components/layout/SakuraEffect';
import { ToastContainer } from './components/layout/ToastContainer';
import { LevelUpModal } from './components/layout/LevelUpModal';
import { DailyQuoteModal } from './components/dashboard/DailyQuoteModal';
import { DailyQuoteBanner } from './components/dashboard/DailyQuoteBanner';
import { performInitialCloudSync, setSyncStatus } from './utils/cloudSync';

// Kata Views
import { HeroCard } from './components/dashboard/HeroCard';
import { MomentumRings } from './components/dashboard/MomentumRings';
import { CompletionsChart } from './components/dashboard/CompletionsChart';
import { DailyQuestsCard } from './components/dashboard/DailyQuestsCard';
import { TodayTasksCard } from './components/dashboard/TodayTasksCard';
import { RemindersCard } from './components/dashboard/RemindersCard';
import { TodayHabitsList } from './components/dashboard/TodayHabitsList';
import { MonthlyGrid } from './components/tracker/MonthlyGrid';
import { WeeklyTimetable } from './components/planner/WeeklyTimetable';
import { VoltronSprintModal } from './components/planner/VoltronSprintModal';
import { InsightsView } from './components/insights/InsightsView';
import { BadgesGrid } from './components/badges/BadgesGrid';
import { JournalExpenseSection } from './components/journal/JournalExpenseSection';
import { SettingsModal } from './components/settings/SettingsModal';
import { ResetPasswordModal } from './components/auth/ResetPasswordModal';
import { HabitManagerModal } from './components/manager/HabitManagerModal';
import { HabitFormModal } from './components/manager/HabitFormModal';
import { getSupabase } from './utils/supabase';

// Forge Views & Components
import { EmberEffect } from './components/forge/layout/EmberEffect';
import { ForgeNavigation, ForgeHubTab } from './components/forge/layout/ForgeNavigation';
import { WorkoutLoggerView } from './components/forge/logger/WorkoutLoggerView';
import { ForgeWorkoutTrackerView } from './components/forge/tracker/ForgeWorkoutTrackerView';
import { ProgressionHubView } from './components/forge/progression/ProgressionHubView';
import { BodyBiologyHubView } from './components/forge/body/BodyBiologyHubView';
import { ArmoryCommandHubView } from './components/forge/armory/ArmoryCommandHubView';
import { EquipmentOnboardingModal } from './components/forge/onboarding/EquipmentOnboardingModal';

export const App: React.FC = () => {
  // App Mode Switcher: 'kata' | 'forge'
  const [currentMode, setCurrentMode] = useState<'kata' | 'forge'>(() => {
    return (localStorage.getItem('kata_current_mode') as 'kata' | 'forge') || 'kata';
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [forgeTab, setForgeTab] = useState<ForgeHubTab>('workout');
  const [showSettings, setShowSettings] = useState(false);
  const [showHabitManager, setShowHabitManager] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showArmoryModal, setShowArmoryModal] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

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

  const { onboardingCompleted } = useForgeStore();

  const handleModeChange = (mode: 'kata' | 'forge') => {
    setCurrentMode(mode);
    try {
      localStorage.setItem('kata_current_mode', mode);
    } catch (e) {}
    if (mode === 'forge') {
      soundEngine.playAnvilHit();
    } else {
      soundEngine.playCheckmark();
    }
  };

  // Automatically check and pull latest cloud data on startup + listen for OAuth & recovery events
  useEffect(() => {
    performInitialCloudSync();

    // Check if user arrived via recovery link in URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      if (window.location.hash.includes('type=recovery')) {
        setShowResetPassword(true);
      }
    }

    // Subscribe to Supabase auth events (OAuth returns, Password recovery)
    const sb = getSupabase();
    if (sb) {
      const { data: authListener } = sb.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setShowResetPassword(true);
        } else if (event === 'SIGNED_IN' && session?.user?.email) {
          localStorage.setItem('kata_auth_email', session.user.email);
          localStorage.setItem('kata_auth_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            lastLogin: new Date().toISOString()
          }));
          // If returning from OAuth with tokens in hash, clean up browser address bar
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          await performInitialCloudSync();
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('kata_auth_email');
          localStorage.removeItem('kata_auth_user');
          setSyncStatus('idle');
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  // Sync document root class with selected theme (Forge is strictly locked to dark mode)
  useEffect(() => {
    if (currentMode === 'forge' || settings.theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [settings.theme, currentMode]);

  // Auto-trigger daily motivation quote when opening the app on a new day in Kata mode
  useEffect(() => {
    if (currentMode === 'kata') {
      const today = getTodayStr();
      if (lastSeenQuoteDate !== today) {
        openDailyQuoteModal();
      }
    }
  }, [lastSeenQuoteDate, openDailyQuoteModal, currentMode]);

  // Handle keyboard shortcuts
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
        setShowArmoryModal(false);
        return;
      }

      // Shift+F or F toggles between Kata and Forge mode
      if ((e.key === 'F' && e.shiftKey) || (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey)) {
        e.preventDefault();
        handleModeChange(currentMode === 'kata' ? 'forge' : 'kata');
        return;
      }

      if (currentMode === 'kata') {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [habits, selectedDate, toggleHabit, sprintTimer, resumeSprintTimer, pauseSprintTimer, activeTab, currentMode]);

  return (
    <div
      className={`min-h-screen relative flex flex-col transition-colors duration-300 ${
        settings.theme === 'light' && currentMode !== 'forge'
          ? 'light bg-[#f4f6fb] text-slate-800'
          : 'dark bg-[#0f1219] text-slate-200'
      } ${currentMode === 'forge' ? 'forge-theme !bg-[#111318] !text-slate-200' : ''}`}
    >
      
      {/* Dynamic Ambient Background Effect */}
      {currentMode === 'kata' ? (
        <>
          <div className="ambient-glow" />
          <SakuraEffect />
        </>
      ) : (
        <>
          <div className="forge-ambient-glow" />
          <EmberEffect />
        </>
      )}

      {/* Top Header with Mode Switcher */}
      <Header
        currentMode={currentMode}
        onModeChange={handleModeChange}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHabitManager={() => setShowHabitManager(true)}
        onLaunchSprint={() => {
          if (!sprintTimer.active) {
            startSprintTimer('voltron-mon', 120);
          }
          setShowSprintModal(true);
        }}
        onOpenArmory={() => setShowArmoryModal(true)}
      />

      {/* Navigation Bar */}
      {currentMode === 'kata' ? (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <ForgeNavigation activeTab={forgeTab} onTabChange={setForgeTab} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 pb-24 md:pb-12">
        
        {/* ================================================================= */}
        {/* KATA MODE SCREENS                                                 */}
        {/* ================================================================= */}
        {currentMode === 'kata' && (
          <>
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

                {/* Daily Tasks & Active Reminders Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <TodayTasksCard />
                  <RemindersCard />
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
          </>
        )}

        {/* ================================================================= */}
        {/* FORGE MODE SCREENS                                                */}
        {/* ================================================================= */}
        {currentMode === 'forge' && (
          <>
            {forgeTab === 'workout' && (
              <WorkoutLoggerView
                onOpenArmory={() => setShowArmoryModal(true)}
                onNavigateToTracker={() => setForgeTab('tracker')}
              />
            )}

            {forgeTab === 'tracker' && (
              <ForgeWorkoutTrackerView />
            )}

            {forgeTab === 'progression' && (
              <ProgressionHubView />
            )}

            {forgeTab === 'body' && (
              <BodyBiologyHubView />
            )}

            {forgeTab === 'armory' && (
              <ArmoryCommandHubView onOpenOnboarding={() => setShowArmoryModal(true)} />
            )}
          </>
        )}

      </main>

      {/* Global Footer Copyright */}
      <footer className="relative z-10 py-6 pb-28 md:pb-8 text-center text-xs font-mono tracking-wider select-none text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1.5">
          <span>&copy;</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">jvbstudios</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-400">All Rights Reserved</span>
        </p>
      </footer>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Celebratory Level-Up Anime Modal (Kata) */}
      <LevelUpModal />

      {/* Daily Heavy Motivation Mandate Modal (Kata) */}
      <DailyQuoteModal />

      {/* Equipment Onboarding Modal (Forge) */}
      <EquipmentOnboardingModal
        isOpen={showArmoryModal || (currentMode === 'forge' && !onboardingCompleted)}
        onClose={() => setShowArmoryModal(false)}
      />

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
        <SettingsModal onClose={() => setShowSettings(false)} currentMode={currentMode} />
      )}

      {/* Password Recovery Modal */}
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
      />

      {/* Minimal Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 font-mono relative z-10 border-t border-white/5">
        <span>
          {currentMode === 'kata'
            ? 'Kata • 習慣 | Anime Disciplinary Command Center'
            : 'Forge • 鍛錬 | Industrial Home Muscle & Calisthenics Laboratory'}
        </span>
        <span className="mx-2">•</span>
        <span>Local-First &amp; PWA Enabled</span>
      </footer>

    </div>
  );
};
export default App;

