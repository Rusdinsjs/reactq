// Prayer Flow Types - State machine for prayer time sequences

import type { MainPrayerName } from './prayer.types';

/**
 * Prayer Flow States:
 * 1. normal      - Regular display (clock, carousel, etc.)
 * 2. pre-prayer  - Tartil Al-Quran playing (starts 20 min before, configurable)
 * 3. tarhim      - Tarhim playing (ends exactly at prayer time)
 * 4. arrived     - "Prayer Time Has Arrived" screen (0.5 min)
 * 5. adhan       - Adhan playing/display (5 min default)
 * 6. iqamah-wait - Waiting for Iqamah (1-20 min, configurable)
 * 7. prayer      - Prayer in progress (5-60 min, configurable)
 */
export type PrayerFlowState =
    | 'normal'
    | 'pre-prayer'
    | 'tarhim'
    | 'arrived'
    | 'adhan'
    | 'iqamah-wait'
    | 'prayer';

export interface PrayerFlowStatus {
    state: PrayerFlowState;
    currentPrayer: MainPrayerName | null;
    stateStartTime: Date | null;
    stateEndTime: Date | null;
    remainingTime: number;          // Seconds remaining in current state
    nextState: PrayerFlowState | null;
}

export interface PrayerFlowConfig {
    prePrayerDuration: number;      // Minutes (default 20)
    arrivedDuration: number;        // Seconds (default 30)
    adhanDuration: number;          // Minutes (default 5)
    iqamahWaitDuration: number;     // Minutes (1-20)
    prayerDuration: number;         // Minutes (5-60)
}

export interface PrayerFlowEvent {
    type: 'state_change' | 'audio_start' | 'audio_end' | 'timer_tick';
    state: PrayerFlowState;
    prayer: MainPrayerName | null;
    timestamp: Date;
}

// Screen states for display management
export type ScreenName =
    | 'splash'
    | 'dashboard'
    | 'settings'
    | 'screensaver'
    | 'prayer-arrived'
    | 'adhan'
    | 'iqamah-wait'
    | 'prayer-time';

export interface ScreenState {
    current: ScreenName;
    previous: ScreenName | null;
    isTransitioning: boolean;
    transitionType: 'fade' | 'slide' | 'zoom' | null;
}

export const DEFAULT_PRAYER_FLOW_CONFIG: PrayerFlowConfig = {
    prePrayerDuration: 20,
    arrivedDuration: 30,
    adhanDuration: 5,
    iqamahWaitDuration: 10,
    prayerDuration: 15,
};

export const PRAYER_FLOW_STATE_ORDER: PrayerFlowState[] = [
    'normal',
    'pre-prayer',
    'tarhim',
    'arrived',
    'adhan',
    'iqamah-wait',
    'prayer',
];
