// Settings Store - Manage application settings

import { create } from 'zustand';
import type {
    AppSettings,
    ThemeName,
    CustomTheme,
    AudioSettings,
    DisplaySettings,
    SlideSettings,
    RunningTextSettings,
    MosqueInfo
} from '../types/settings.types';
import type {
    CalculationMethod,
    AsrJuristic,
    HighLatitudeRule,
    Location,
    PrayerTimeCorrection
} from '../types/prayer.types';
import { saveSettings, loadSettings } from '../services/storageService';
import { DEFAULT_LOCATION, DEFAULT_CORRECTIONS } from '../types/settings.types';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    customTheme: null,
    calculationMethod: 'Kemenag',
    asrJuristic: 'Standard',
    highLatitudeRule: 'NightMiddle',
    location: DEFAULT_LOCATION,
    corrections: DEFAULT_CORRECTIONS,
    audio: {
        volume: 0.8,
        globalTartilDuration: 20,
        globalIqamahWaitDuration: 10,
        globalPrayerDuration: 15,
        audioDirectory: '',
        prayers: {
            fajr: { tartilFile: '', tarhimFile: '', adhanFile: '', tartilStartBefore: 0, iqamahDuration: 0, prayerDuration: 0 },
            dhuhr: { tartilFile: '', tarhimFile: '', adhanFile: '', tartilStartBefore: 0, iqamahDuration: 0, prayerDuration: 0 },
            asr: { tartilFile: '', tarhimFile: '', adhanFile: '', tartilStartBefore: 0, iqamahDuration: 0, prayerDuration: 0 },
            maghrib: { tartilFile: '', tarhimFile: '', adhanFile: '', tartilStartBefore: 0, iqamahDuration: 0, prayerDuration: 0 },
            isha: { tartilFile: '', tarhimFile: '', adhanFile: '', tartilStartBefore: 0, iqamahDuration: 0, prayerDuration: 0 },
        },
    },
    display: {
        fullscreen: false,
        showSeconds: true,
        show24Hour: true,
        showHijriDate: true,
        showGregorianDate: true,
        clockSize: 'large',
        screensaverTimeout: 30,
        prayerTimesLayout: 'horizontal',
        prayerTimesCarouselSpeed: 4,
    },
    slides: {
        enabled: true,
        interval: 10,
        slides: [],
    },
    runningText: {
        enabled: true,
        speed: 100,
        texts: [
            'Selamat datang di Masjid',
            'Mari ramaikan masjid dengan sholat berjamaah',
        ],
    },
    mosque: {
        name: 'Masjid',
        address: '',
        city: '',
        logoPath: '',
    },
    language: 'id',
};

interface SettingsState extends AppSettings {
    // Loading state
    isLoaded: boolean;

    // Actions
    loadSettings: () => void;
    saveSettings: () => void;

    // Theme
    setTheme: (theme: ThemeName) => void;
    setCustomTheme: (theme: CustomTheme) => void;

    // Prayer calculation
    setCalculationMethod: (method: CalculationMethod) => void;
    setAsrJuristic: (juristic: AsrJuristic) => void;
    setHighLatitudeRule: (rule: HighLatitudeRule) => void;
    setLocation: (location: Location) => void;
    setCorrections: (corrections: PrayerTimeCorrection) => void;

    // Audio
    setAudioSettings: (audio: Partial<AudioSettings>) => void;
    setVolume: (volume: number) => void;

    // Display
    setDisplaySettings: (display: Partial<DisplaySettings>) => void;

    // Media
    setSlideSettings: (slides: Partial<SlideSettings>) => void;
    setRunningTextSettings: (text: Partial<RunningTextSettings>) => void;

    // Mosque
    setMosqueInfo: (mosque: Partial<MosqueInfo>) => void;

    // Language
    setLanguage: (lang: 'id' | 'en' | 'ar') => void;

    // Reset
    resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    // Initial state from defaults
    ...DEFAULT_SETTINGS,
    isLoaded: false,

    // Load settings from storage
    loadSettings: () => {
        const saved = loadSettings();
        if (saved) {
            set({ ...saved, isLoaded: true });
        } else {
            set({ isLoaded: true });
        }
    },

    // Save current settings to storage
    saveSettings: () => {
        const state = get();
        const settings: AppSettings = {
            theme: state.theme,
            customTheme: state.customTheme,
            calculationMethod: state.calculationMethod,
            asrJuristic: state.asrJuristic,
            highLatitudeRule: state.highLatitudeRule,
            location: state.location,
            corrections: state.corrections,
            audio: state.audio,
            display: state.display,
            slides: state.slides,
            runningText: state.runningText,
            mosque: state.mosque,
            language: state.language,
        };
        saveSettings(settings);
    },

    // Theme actions
    setTheme: (theme) => {
        set({ theme });
        get().saveSettings();
    },

    setCustomTheme: (customTheme) => {
        set({ customTheme, theme: 'custom' });
        get().saveSettings();
    },

    // Prayer calculation actions
    setCalculationMethod: (calculationMethod) => {
        set({ calculationMethod });
        get().saveSettings();
    },

    setAsrJuristic: (asrJuristic) => {
        set({ asrJuristic });
        get().saveSettings();
    },

    setHighLatitudeRule: (highLatitudeRule) => {
        set({ highLatitudeRule });
        get().saveSettings();
    },

    setLocation: (location) => {
        set({ location });
        get().saveSettings();
    },

    setCorrections: (corrections) => {
        set({ corrections });
        get().saveSettings();
    },

    // Audio actions
    setAudioSettings: (audio) => {
        set((state) => ({
            audio: { ...state.audio, ...audio },
        }));
        get().saveSettings();
    },

    setVolume: (volume) => {
        set((state) => ({
            audio: { ...state.audio, volume },
        }));
        get().saveSettings();
    },

    // Display actions
    setDisplaySettings: (display) => {
        set((state) => ({
            display: { ...state.display, ...display },
        }));
        get().saveSettings();
    },

    // Media actions
    setSlideSettings: (slides) => {
        set((state) => ({
            slides: { ...state.slides, ...slides },
        }));
        get().saveSettings();
    },

    setRunningTextSettings: (runningText) => {
        set((state) => ({
            runningText: { ...state.runningText, ...runningText },
        }));
        get().saveSettings();
    },

    // Mosque actions
    setMosqueInfo: (mosque) => {
        set((state) => ({
            mosque: { ...state.mosque, ...mosque },
        }));
        get().saveSettings();
    },

    // Language action
    setLanguage: (language) => {
        set({ language });
        get().saveSettings();
    },

    // Reset to defaults
    resetToDefaults: () => {
        set({ ...DEFAULT_SETTINGS, isLoaded: true });
        get().saveSettings();
    },
}));
