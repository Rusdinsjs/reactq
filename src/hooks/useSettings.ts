// useSettings Hook - Access and modify settings

import { useSettingsStore } from '../stores/settingsStore';
import { useEffect } from 'react';

export function useSettings() {
    const store = useSettingsStore();

    // Load settings on mount
    useEffect(() => {
        if (!store.isLoaded) {
            store.loadSettings();
        }
    }, [store.isLoaded, store.loadSettings]);

    return {
        // State
        isLoaded: store.isLoaded,

        // Theme
        theme: store.theme,
        customTheme: store.customTheme,
        setTheme: store.setTheme,
        setCustomTheme: store.setCustomTheme,

        // Prayer
        calculationMethod: store.calculationMethod,
        asrJuristic: store.asrJuristic,
        highLatitudeRule: store.highLatitudeRule,
        location: store.location,
        corrections: store.corrections,
        setCalculationMethod: store.setCalculationMethod,
        setAsrJuristic: store.setAsrJuristic,
        setHighLatitudeRule: store.setHighLatitudeRule,
        setLocation: store.setLocation,
        setCorrections: store.setCorrections,

        // Audio
        audio: store.audio,
        setAudioSettings: store.setAudioSettings,
        setVolume: store.setVolume,

        // Display
        display: store.display,
        setDisplaySettings: store.setDisplaySettings,

        // Media
        slides: store.slides,
        runningText: store.runningText,
        setSlideSettings: store.setSlideSettings,
        setRunningTextSettings: store.setRunningTextSettings,

        // Mosque
        mosque: store.mosque,
        setMosqueInfo: store.setMosqueInfo,

        // Language
        language: store.language,
        setLanguage: store.setLanguage,

        // Utilities
        resetToDefaults: store.resetToDefaults,
        saveSettings: store.saveSettings,
    };
}
