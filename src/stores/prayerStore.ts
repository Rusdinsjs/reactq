// Prayer Store - Manage prayer times state

import { create } from 'zustand';
import type { PrayerTimes, PrayerName, Location, PrayerCalculationConfig } from '../types/prayer.types';
import { calculatePrayerTimes, getNextPrayer, getCurrentPrayer, getTimeUntilNextPrayer, createDefaultConfig } from '../services/prayerCalculator';
import { DEFAULT_LOCATION } from '../types/settings.types';
import { getToday, addDays } from '../utils/dateUtils';

interface PrayerState {
    // Current prayer times
    todayPrayerTimes: PrayerTimes | null;
    tomorrowPrayerTimes: PrayerTimes | null;

    // Current state
    currentPrayer: PrayerName | null;
    nextPrayer: { name: PrayerName; time: Date } | null;
    secondsUntilNextPrayer: number;

    // Configuration
    config: PrayerCalculationConfig;

    // Loading state
    isLoading: boolean;
    error: string | null;

    // Actions
    calculatePrayerTimes: (date?: Date) => void;
    updateLocation: (location: Location) => void;
    updateConfig: (config: Partial<PrayerCalculationConfig>) => void;
    updateCurrentTime: (currentTime: Date) => void;
    reset: () => void;
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
    // Initial state
    todayPrayerTimes: null,
    tomorrowPrayerTimes: null,
    currentPrayer: null,
    nextPrayer: null,
    secondsUntilNextPrayer: 0,
    config: createDefaultConfig(DEFAULT_LOCATION),
    isLoading: false,
    error: null,

    // Calculate prayer times for today and tomorrow
    calculatePrayerTimes: (date?: Date) => {
        const { config } = get();
        const today = date ?? getToday();
        const tomorrow = addDays(today, 1);

        try {
            set({ isLoading: true, error: null });

            const todayTimes = calculatePrayerTimes(today, config);
            const tomorrowTimes = calculatePrayerTimes(tomorrow, config);

            // Determine current and next prayer
            const now = new Date();
            const current: PrayerName | null = getCurrentPrayer(todayTimes, now);
            let next = getNextPrayer(todayTimes, now);

            // If no next prayer today, get tomorrow's Fajr
            if (!next) {
                next = { name: 'fajr' as PrayerName, time: tomorrowTimes.fajr };
            }

            const seconds = next ? getTimeUntilNextPrayer(next.time, now) : 0;

            set({
                todayPrayerTimes: todayTimes,
                tomorrowPrayerTimes: tomorrowTimes,
                currentPrayer: current,
                nextPrayer: next as { name: PrayerName; time: Date } | null,
                secondsUntilNextPrayer: seconds,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to calculate prayer times',
            });
        }
    },

    // Update location and recalculate
    updateLocation: (location: Location) => {
        const { config, calculatePrayerTimes } = get();
        set({
            config: { ...config, location },
        });
        calculatePrayerTimes();
    },

    // Update configuration
    updateConfig: (newConfig: Partial<PrayerCalculationConfig>) => {
        const { config, calculatePrayerTimes } = get();
        set({
            config: { ...config, ...newConfig },
        });
        calculatePrayerTimes();
    },

    // Update current time (called every second)
    updateCurrentTime: (currentTime: Date) => {
        const { todayPrayerTimes, tomorrowPrayerTimes } = get();
        if (!todayPrayerTimes) return;

        const current: PrayerName | null = getCurrentPrayer(todayPrayerTimes, currentTime);
        let next = getNextPrayer(todayPrayerTimes, currentTime);

        // If no next prayer today, get tomorrow's Fajr
        if (!next && tomorrowPrayerTimes) {
            next = { name: 'fajr' as PrayerName, time: tomorrowPrayerTimes.fajr };
        }

        const seconds = next ? getTimeUntilNextPrayer(next.time, currentTime) : 0;

        set({
            currentPrayer: current,
            nextPrayer: next as { name: PrayerName; time: Date } | null,
            secondsUntilNextPrayer: seconds,
        });
    },

    // Reset store
    reset: () => {
        set({
            todayPrayerTimes: null,
            tomorrowPrayerTimes: null,
            currentPrayer: null,
            nextPrayer: null,
            secondsUntilNextPrayer: 0,
            config: createDefaultConfig(DEFAULT_LOCATION),
            isLoading: false,
            error: null,
        });
    },
}));
