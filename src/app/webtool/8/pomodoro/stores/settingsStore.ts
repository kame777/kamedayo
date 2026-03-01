import { create } from 'zustand';
import { UserSettings, DEFAULT_SETTINGS } from '../types';
import { saveSettingsLocal, loadSettingsLocal } from '../utils/storage';

interface SettingsStore {
    settings: UserSettings;
    isLoaded: boolean;
    loadSettings: () => void;
    updateSettings: (partial: Partial<UserSettings>) => void;
    setSettings: (settings: UserSettings) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: DEFAULT_SETTINGS,
    isLoaded: false,

    loadSettings: () => {
        const loaded = loadSettingsLocal();
        set({ settings: loaded, isLoaded: true });
    },

    updateSettings: (partial) => {
        const current = get().settings;
        const updated = { ...current, ...partial };
        set({ settings: updated });
        saveSettingsLocal(updated);
    },

    setSettings: (settings) => {
        set({ settings });
        saveSettingsLocal(settings);
    },
}));
