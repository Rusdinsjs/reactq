// Prayer Flow Store - Manage prayer flow state machine

import { create } from 'zustand';
import type { PrayerFlowStatus, PrayerFlowConfig } from '../types/prayerFlow.types';
import type { PrayerTimes } from '../types/prayer.types';
import { DEFAULT_PRAYER_FLOW_CONFIG } from '../types/prayerFlow.types';
import { createPrayerFlowService, PrayerFlowService } from '../services/prayerFlowService';

interface PrayerFlowStoreState {
    // Current status
    status: PrayerFlowStatus;

    // Configuration
    config: PrayerFlowConfig;

    // Service instance
    service: PrayerFlowService | null;

    // Audio triggers
    shouldPlayTartil: boolean;
    shouldPlayTarhim: boolean;
    shouldPlayAdhan: boolean;

    // Actions
    initialize: (config?: Partial<PrayerFlowConfig>) => void;
    updateConfig: (config: Partial<PrayerFlowConfig>) => void;
    updateStatus: (currentTime: Date, prayerTimes: PrayerTimes) => void;
    reset: () => void;

    // Manual overrides
    skipToNextState: () => void;
    forceNormalState: () => void;
}

const DEFAULT_STATUS: PrayerFlowStatus = {
    state: 'normal',
    currentPrayer: null,
    stateStartTime: null,
    stateEndTime: null,
    remainingTime: 0,
    nextState: null,
};

export const usePrayerFlowStore = create<PrayerFlowStoreState>((set, get) => ({
    // Initial state
    status: DEFAULT_STATUS,
    config: DEFAULT_PRAYER_FLOW_CONFIG,
    service: null,
    shouldPlayTartil: false,
    shouldPlayTarhim: false,
    shouldPlayAdhan: false,

    // Initialize the prayer flow service
    initialize: (config) => {
        const mergedConfig = { ...DEFAULT_PRAYER_FLOW_CONFIG, ...config };
        const service = createPrayerFlowService(mergedConfig);

        // Listen for state changes
        service.addEventListener((event) => {
            if (event.type === 'state_change') {
                set({
                    shouldPlayTartil: event.state === 'pre-prayer',
                    shouldPlayTarhim: event.state === 'tarhim',
                    shouldPlayAdhan: event.state === 'adhan',
                });
            }
        });

        set({ service, config: mergedConfig });
    },

    // Update configuration
    updateConfig: (config) => {
        const { service } = get();
        const newConfig = { ...get().config, ...config };

        set({ config: newConfig });
        service?.updateConfig(newConfig);
    },

    // Update status based on current time
    updateStatus: (currentTime, prayerTimes) => {
        const { service } = get();
        if (!service) return;

        const status = service.calculateFlowStatus(currentTime, prayerTimes);

        set({
            status,
            shouldPlayTartil: status.state === 'pre-prayer',
            shouldPlayTarhim: status.state === 'tarhim',
            shouldPlayAdhan: status.state === 'adhan',
        });
    },

    // Reset to initial state
    reset: () => {
        const { service } = get();
        service?.reset();

        set({
            status: DEFAULT_STATUS,
            shouldPlayTartil: false,
            shouldPlayTarhim: false,
            shouldPlayAdhan: false,
        });
    },

    // Skip to next state (for testing/emergency)
    skipToNextState: () => {
        const { status } = get();
        // This would need implementation based on your needs
        console.log('Skip to next state from:', status.state);
    },

    // Force normal state
    forceNormalState: () => {
        set({
            status: DEFAULT_STATUS,
            shouldPlayTartil: false,
            shouldPlayTarhim: false,
            shouldPlayAdhan: false,
        });
    },
}));
