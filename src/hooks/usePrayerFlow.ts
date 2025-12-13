// usePrayerFlow Hook - Access prayer flow state

import { useEffect } from 'react';
import { usePrayerFlowStore } from '../stores/prayerFlowStore';
import { usePrayerStore } from '../stores/prayerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { PRAYER_DISPLAY_NAMES } from '../types/prayer.types';

export function usePrayerFlow() {
    const {
        status,
        config,
        shouldPlayTartil,
        shouldPlayTarhim,
        shouldPlayAdhan,
        initialize,
        updateConfig,
        updateStatus,
        reset,
        forceNormalState,
    } = usePrayerFlowStore();

    const { todayPrayerTimes } = usePrayerStore();
    const { audio } = useSettingsStore();

    // Initialize on mount
    useEffect(() => {
        initialize({
            prePrayerDuration: audio.globalTartilDuration,
            adhanDuration: 5, // Default, will be overridden by file duration
            iqamahWaitDuration: audio.globalIqamahWaitDuration,
            prayerDuration: audio.globalPrayerDuration,
        });
    }, [initialize, audio]);

    // Update status every second
    useEffect(() => {
        if (!todayPrayerTimes) return;

        const interval = setInterval(() => {
            updateStatus(new Date(), todayPrayerTimes);
        }, 1000);

        return () => clearInterval(interval);
    }, [todayPrayerTimes, updateStatus]);

    // Get current prayer display name
    const getCurrentPrayerName = (lang: 'id' | 'ar' = 'id') => {
        if (!status.currentPrayer) return '';
        const names = PRAYER_DISPLAY_NAMES[status.currentPrayer];
        return lang === 'ar' ? names.ar : names.id;
    };

    // Get state display name
    const getStateDisplayName = (lang: 'id' | 'en' = 'id') => {
        const stateNames: Record<string, { id: string; en: string }> = {
            normal: { id: 'Normal', en: 'Normal' },
            'pre-prayer': { id: 'Tartil Al-Quran', en: 'Quran Recitation' },
            tarhim: { id: 'Tarhim', en: 'Tarhim' },
            arrived: { id: 'Waktu Sholat Tiba', en: 'Prayer Time Arrived' },
            adhan: { id: 'Adzan', en: 'Adhan' },
            'iqamah-wait': { id: 'Menunggu Iqamah', en: 'Waiting for Iqamah' },
            prayer: { id: 'Waktu Sholat', en: 'Prayer Time' },
        };

        return stateNames[status.state]?.[lang] ?? status.state;
    };

    // Check if we're in a prayer flow state
    const isInPrayerFlow = status.state !== 'normal';

    // Get remaining time formatted
    const getFormattedRemainingTime = () => {
        const { remainingTime } = status;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
        // Status
        status,
        state: status.state,
        currentPrayer: status.currentPrayer,
        remainingTime: status.remainingTime,

        // Audio triggers
        shouldPlayTartil,
        shouldPlayTarhim,
        shouldPlayAdhan,

        // Configuration
        config,
        updateConfig,

        // Helpers
        isInPrayerFlow,
        getCurrentPrayerName,
        getStateDisplayName,
        getFormattedRemainingTime,

        // Actions
        reset,
        forceNormalState,
    };
}
