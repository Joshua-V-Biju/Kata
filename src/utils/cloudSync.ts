import { pushToCloud, pullFromCloud, getSupabase, getCurrentAuthUser } from './supabase';
import { useKataStore } from '../store/useKataStore';
import { useForgeStore } from '../store/useForgeStore';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

type SyncListener = (status: SyncStatus, lastSyncTime?: string) => void;

let currentSyncStatus: SyncStatus = 'synced';
let lastSyncTimestamp: string | null = null;
const listeners = new Set<SyncListener>();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isCurrentlySyncing = false;
let isHydratingFromCloud = false;

export const getSyncStatus = () => currentSyncStatus;
export const getLastSyncTime = () => lastSyncTimestamp;
export const getIsHydrating = () => isHydratingFromCloud;

export const subscribeSyncStatus = (listener: SyncListener) => {
  listeners.add(listener);
  listener(currentSyncStatus, lastSyncTimestamp || undefined);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => fn(currentSyncStatus, lastSyncTimestamp || undefined));
};

export const setSyncStatus = (status: SyncStatus) => {
  currentSyncStatus = status;
  notifyListeners();
};

/**
 * Triggers a debounced background push to Supabase.
 * Call this whenever habits, timetable, tasks, or workouts change.
 */
export const triggerAutoSync = (delayMs = 1800) => {
  if (typeof window === 'undefined') return;
  if (isHydratingFromCloud) return;

  const sb = getSupabase();
  if (!sb) {
    if (currentSyncStatus !== 'offline') setSyncStatus('offline');
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    performBackgroundPush();
  }, delayMs);
};

/**
 * Performs immediate background push to Supabase
 */
export const performBackgroundPush = async (): Promise<boolean> => {
  if (isCurrentlySyncing || isHydratingFromCloud) return false;
  const sb = getSupabase();
  if (!sb) {
    setSyncStatus('offline');
    return false;
  }

  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      setSyncStatus('offline');
      return false;
    }

    isCurrentlySyncing = true;
    setSyncStatus('syncing');

    const kataState = useKataStore.getState();
    const forgeState = useForgeStore.getState();

    const kataData = {
      habits: kataState.habits,
      dayLogs: kataState.dayLogs,
      timetable: kataState.timetable,
      badges: kataState.badges,
      userStats: kataState.userStats,
      settings: kataState.settings,
      reminders: kataState.reminders
    };

    const forgeData = {
      equipment: forgeState.equipment,
      workouts: forgeState.workouts,
      cindySessions: forgeState.cindySessions,
      customExercises: forgeState.customExercises,
      stats: forgeState.stats,
      settings: forgeState.settings
    };

    const res = await pushToCloud(kataData, forgeData);
    isCurrentlySyncing = false;

    if (res.success) {
      const nowIso = new Date().toISOString();
      lastSyncTimestamp = nowIso;
      try {
        localStorage.setItem('kata_last_cloud_sync', nowIso);
      } catch (e) {}
      setSyncStatus('synced');
      return true;
    } else {
      console.warn('Background push to cloud failed:', res.error);
      setSyncStatus('error');
      return false;
    }
  } catch (err) {
    isCurrentlySyncing = false;
    console.warn('Background push error:', err);
    setSyncStatus('error');
    return false;
  }
};

/**
 * Automatically pulls the latest data on app load or when user logs in
 */
export const performInitialCloudSync = async (): Promise<boolean> => {
  if (isCurrentlySyncing) return false;
  const sb = getSupabase();
  if (!sb) {
    setSyncStatus('offline');
    return false;
  }

  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      setSyncStatus('offline');
      return false;
    }

    setSyncStatus('syncing');
    const res = await pullFromCloud();

    if (res.data) {
      const cloudKata = res.data.kata_data;
      const cloudForge = res.data.forge_data;

      isHydratingFromCloud = true;
      try {
        if (cloudKata && Array.isArray(cloudKata.habits) && cloudKata.habits.length > 0) {
          useKataStore.getState().importBackupData(cloudKata, true);
        } else {
          // If cloud is empty but local has habits, push local to seed cloud
          isHydratingFromCloud = false;
          await performBackgroundPush();
          return true;
        }

        if (cloudForge) {
          useForgeStore.setState(cloudForge);
        }
      } finally {
        isHydratingFromCloud = false;
      }

      const nowIso = res.data.updated_at || new Date().toISOString();
      lastSyncTimestamp = nowIso;
      try {
        localStorage.setItem('kata_last_cloud_sync', nowIso);
      } catch (e) {}
      setSyncStatus('synced');
      return true;
    } else {
      // User is logged in but hasn't saved anything to Supabase yet.
      // Auto-push their existing local data so their cloud row is created immediately!
      await performBackgroundPush();
      return true;
    }
  } catch (err) {
    console.warn('Initial cloud sync error:', err);
    setSyncStatus('error');
    return false;
  }
};

// Setup listeners if in browser
if (typeof window !== 'undefined') {
  // Sync on tab focus / visibility
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      performInitialCloudSync();
    }
  });

  // Flush push before closing tab
  window.addEventListener('beforeunload', () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      performBackgroundPush();
    }
  });
}
