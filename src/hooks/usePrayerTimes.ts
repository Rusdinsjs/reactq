// usePrayerTimes Hook - Access prayer times from store

import { useEffect } from 'react';
import { usePrayerStore } from '../stores/prayerStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { PrayerName } from '../types/prayer.types';
import { PRAYER_DISPLAY_NAMES } from '../types/prayer.types';

export function usePrayerTimes() {
    const {
        todayPrayerTimes,
        tomorrowPrayerTimes,
        currentPrayer,
        nextPrayer,
        secondsUntilNextPrayer,
        isLoading,
        error,
        calculatePrayerTimes,
        updateCurrentTime,
        updateConfig,
    } = usePrayerStore();

    const { location, calculationMethod, asrJuristic, highLatitudeRule, corrections } = useSettingsStore();

    // Sync config with settings
    useEffect(() => {
        updateConfig({
            location,
            method: calculationMethod,
            asrJuristic,
            highLatitudeRule,
            corrections,
        });
    }, [location, calculationMethod, asrJuristic, highLatitudeRule, corrections, updateConfig]);

    // Calculate prayer times on mount and when config changes
    useEffect(() => {
        calculatePrayerTimes();
    }, [calculatePrayerTimes]);

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            updateCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [updateCurrentTime]);

    // Get display name for a prayer
    const getDisplayName = (prayer: PrayerName, lang: 'id' | 'ar' = 'id') => {
        const names = PRAYER_DISPLAY_NAMES[prayer];
        return lang === 'ar' ? names.ar : names.id;
    };

    // Get all prayer times as array for display
    const getPrayerList = () => {
        if (!todayPrayerTimes) return [];

        const prayers: PrayerName[] = ['imsak', 'fajr', 'sunrise', 'dhuha', 'dhuhr', 'asr', 'maghrib', 'isha'];

        return prayers.map((prayer) => ({
            name: prayer,
            displayName: getDisplayName(prayer),
            displayNameAr: getDisplayName(prayer, 'ar'),
            time: todayPrayerTimes[prayer] as Date,
            isActive: currentPrayer === prayer,
            isNext: nextPrayer?.name === prayer,
        }));
    };

    return {
        todayPrayerTimes,
        tomorrowPrayerTimes,
        currentPrayer,
        nextPrayer,
        secondsUntilNextPrayer,
        isLoading,
        error,
        getDisplayName,
        getPrayerList,
        recalculate: calculatePrayerTimes,
    };
}
