// Prayer Flow Service - Orchestrate prayer time sequences

import type {
    PrayerFlowStatus,
    PrayerFlowConfig,
    PrayerFlowEvent
} from '../types/prayerFlow.types';
import type { MainPrayerName, PrayerTimes } from '../types/prayer.types';
import type { AudioSettings } from '../types/settings.types';
import { MAIN_PRAYERS } from '../types/prayer.types';
import { addMinutes, addSeconds, diffInSeconds, isBetween } from '../utils/dateUtils';

export class PrayerFlowService {
    private config: PrayerFlowConfig;
    private currentStatus: PrayerFlowStatus;
    private eventListeners: ((event: PrayerFlowEvent) => void)[] = [];

    constructor(config: PrayerFlowConfig) {
        this.config = config;
        this.currentStatus = {
            state: 'normal',
            currentPrayer: null,
            stateStartTime: null,
            stateEndTime: null,
            remainingTime: 0,
            nextState: null,
        };
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<PrayerFlowConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Add event listener
     */
    addEventListener(callback: (event: PrayerFlowEvent) => void): () => void {
        this.eventListeners.push(callback);
        return () => {
            this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Emit event
     */
    private emitEvent(event: PrayerFlowEvent): void {
        this.eventListeners.forEach(callback => callback(event));
    }

    /**
     * Get current flow status based on current time and prayer times
     */
    calculateFlowStatus(
        currentTime: Date,
        prayerTimes: PrayerTimes
    ): PrayerFlowStatus {
        // Check each main prayer
        for (const prayer of MAIN_PRAYERS) {
            const prayerTime = prayerTimes[prayer];
            if (!(prayerTime instanceof Date)) continue;

            const status = this.checkPrayerFlow(currentTime, prayerTime, prayer);
            if (status.state !== 'normal') {
                this.updateStatus(status);
                return status;
            }
        }

        // No active prayer flow
        const normalStatus: PrayerFlowStatus = {
            state: 'normal',
            currentPrayer: null,
            stateStartTime: null,
            stateEndTime: null,
            remainingTime: 0,
            nextState: null,
        };

        this.updateStatus(normalStatus);
        return normalStatus;
    }

    /**
     * Check prayer flow state for a specific prayer
     */
    private checkPrayerFlow(
        currentTime: Date,
        prayerTime: Date,
        prayer: MainPrayerName
    ): PrayerFlowStatus {
        const { prePrayerDuration, arrivedDuration, adhanDuration, iqamahWaitDuration, prayerDuration } = this.config;

        // Calculate time boundaries
        const prePrayerStart = addMinutes(prayerTime, -prePrayerDuration);
        const tarhimStart = addMinutes(prayerTime, -5); // Tarhim starts 5 min before
        const arrivedEnd = addSeconds(prayerTime, arrivedDuration);
        const adhanEnd = addMinutes(prayerTime, adhanDuration);
        const iqamahEnd = addMinutes(adhanEnd, iqamahWaitDuration);
        const prayerEnd = addMinutes(iqamahEnd, prayerDuration);

        // Check which state we're in
        if (isBetween(currentTime, prePrayerStart, tarhimStart)) {
            return {
                state: 'pre-prayer',
                currentPrayer: prayer,
                stateStartTime: prePrayerStart,
                stateEndTime: tarhimStart,
                remainingTime: diffInSeconds(tarhimStart, currentTime),
                nextState: 'tarhim',
            };
        }

        if (isBetween(currentTime, tarhimStart, prayerTime)) {
            return {
                state: 'tarhim',
                currentPrayer: prayer,
                stateStartTime: tarhimStart,
                stateEndTime: prayerTime,
                remainingTime: diffInSeconds(prayerTime, currentTime),
                nextState: 'arrived',
            };
        }

        if (isBetween(currentTime, prayerTime, arrivedEnd)) {
            return {
                state: 'arrived',
                currentPrayer: prayer,
                stateStartTime: prayerTime,
                stateEndTime: arrivedEnd,
                remainingTime: diffInSeconds(arrivedEnd, currentTime),
                nextState: 'adhan',
            };
        }

        if (isBetween(currentTime, arrivedEnd, adhanEnd)) {
            return {
                state: 'adhan',
                currentPrayer: prayer,
                stateStartTime: arrivedEnd,
                stateEndTime: adhanEnd,
                remainingTime: diffInSeconds(adhanEnd, currentTime),
                nextState: 'iqamah-wait',
            };
        }

        if (isBetween(currentTime, adhanEnd, iqamahEnd)) {
            return {
                state: 'iqamah-wait',
                currentPrayer: prayer,
                stateStartTime: adhanEnd,
                stateEndTime: iqamahEnd,
                remainingTime: diffInSeconds(iqamahEnd, currentTime),
                nextState: 'prayer',
            };
        }

        if (isBetween(currentTime, iqamahEnd, prayerEnd)) {
            return {
                state: 'prayer',
                currentPrayer: prayer,
                stateStartTime: iqamahEnd,
                stateEndTime: prayerEnd,
                remainingTime: diffInSeconds(prayerEnd, currentTime),
                nextState: 'normal',
            };
        }

        // Not in any active state for this prayer
        return {
            state: 'normal',
            currentPrayer: null,
            stateStartTime: null,
            stateEndTime: null,
            remainingTime: 0,
            nextState: null,
        };
    }

    /**
     * Update status and emit event if changed
     */
    private updateStatus(newStatus: PrayerFlowStatus): void {
        const stateChanged = this.currentStatus.state !== newStatus.state ||
            this.currentStatus.currentPrayer !== newStatus.currentPrayer;

        if (stateChanged) {
            this.emitEvent({
                type: 'state_change',
                state: newStatus.state,
                prayer: newStatus.currentPrayer,
                timestamp: new Date(),
            });
        }

        this.currentStatus = newStatus;
    }

    /**
     * Get current status
     */
    getStatus(): PrayerFlowStatus {
        return { ...this.currentStatus };
    }

    /**
     * Check if we should play Tartil audio
     */
    shouldPlayTartil(): boolean {
        return this.currentStatus.state === 'pre-prayer';
    }

    /**
     * Check if we should play Tarhim audio
     */
    shouldPlayTarhim(): boolean {
        return this.currentStatus.state === 'tarhim';
    }

    /**
     * Check if we should play Adhan audio
     */
    shouldPlayAdhan(): boolean {
        return this.currentStatus.state === 'adhan';
    }

    /**
     * Get audio to play based on current state
     */
    getAudioToPlay(audioSettings: AudioSettings): {
        type: 'tartil' | 'tarhim' | 'adhan';
        file: string;
    } | null {
        const prayer = this.currentStatus.currentPrayer;
        if (!prayer) return null;

        const prayerAudio = audioSettings.prayers[prayer];
        if (!prayerAudio) return null;

        switch (this.currentStatus.state) {
            case 'pre-prayer':
                return { type: 'tartil', file: prayerAudio.tartilFile };
            case 'tarhim':
                return { type: 'tarhim', file: prayerAudio.tarhimFile };
            case 'adhan':
                return { type: 'adhan', file: prayerAudio.adhanFile };
            default:
                return null;
        }
    }

    /**
     * Reset to normal state
     */
    reset(): void {
        this.currentStatus = {
            state: 'normal',
            currentPrayer: null,
            stateStartTime: null,
            stateEndTime: null,
            remainingTime: 0,
            nextState: null,
        };
    }
}

// Factory function
export function createPrayerFlowService(config: PrayerFlowConfig): PrayerFlowService {
    return new PrayerFlowService(config);
}
