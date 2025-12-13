// Time Scheduler Service - Schedule events based on time

import type { PrayerTimes, MainPrayerName } from '../types/prayer.types';
import type { PrayerFlowConfig } from '../types/prayerFlow.types';
import { addMinutes } from '../utils/dateUtils';

export interface ScheduledEvent {
    id: string;
    type: 'tartil_start' | 'tarhim_start' | 'prayer_time' | 'adhan_end' | 'iqamah_end' | 'prayer_end';
    prayer: MainPrayerName;
    scheduledTime: Date;
    executed: boolean;
}

export class TimeScheduler {
    private events: ScheduledEvent[] = [];
    private intervalId: number | null = null;
    private onEvent: ((event: ScheduledEvent) => void) | null = null;
    private checkIntervalMs: number = 1000;

    /**
     * Set event callback
     */
    setOnEvent(callback: (event: ScheduledEvent) => void): void {
        this.onEvent = callback;
    }

    /**
     * Schedule events for a day based on prayer times
     */
    scheduleDay(
        prayerTimes: PrayerTimes,
        config: PrayerFlowConfig,
        mainPrayers: MainPrayerName[]
    ): void {
        this.clearEvents();

        for (const prayer of mainPrayers) {
            const prayerTime = prayerTimes[prayer];
            if (!(prayerTime instanceof Date)) continue;

            const events = this.createEventsForPrayer(prayer, prayerTime, config);
            this.events.push(...events);
        }

        // Sort by time
        this.events.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
    }

    /**
     * Create scheduled events for a single prayer
     */
    private createEventsForPrayer(
        prayer: MainPrayerName,
        prayerTime: Date,
        config: PrayerFlowConfig
    ): ScheduledEvent[] {
        const events: ScheduledEvent[] = [];
        let eventId = 0;

        const makeId = (type: string) => `${prayer}-${type}-${eventId++}`;

        // Tartil starts X minutes before prayer
        const tartilStart = addMinutes(prayerTime, -config.prePrayerDuration);
        events.push({
            id: makeId('tartil'),
            type: 'tartil_start',
            prayer,
            scheduledTime: tartilStart,
            executed: false,
        });

        // Tarhim starts 5 minutes before prayer
        const tarhimStart = addMinutes(prayerTime, -5);
        events.push({
            id: makeId('tarhim'),
            type: 'tarhim_start',
            prayer,
            scheduledTime: tarhimStart,
            executed: false,
        });

        // Prayer time
        events.push({
            id: makeId('prayer'),
            type: 'prayer_time',
            prayer,
            scheduledTime: prayerTime,
            executed: false,
        });

        // Adhan ends
        const adhanEnd = addMinutes(prayerTime, config.adhanDuration);
        events.push({
            id: makeId('adhan_end'),
            type: 'adhan_end',
            prayer,
            scheduledTime: adhanEnd,
            executed: false,
        });

        // Iqamah wait ends
        const iqamahEnd = addMinutes(adhanEnd, config.iqamahWaitDuration);
        events.push({
            id: makeId('iqamah_end'),
            type: 'iqamah_end',
            prayer,
            scheduledTime: iqamahEnd,
            executed: false,
        });

        // Prayer period ends
        const prayerEnd = addMinutes(iqamahEnd, config.prayerDuration);
        events.push({
            id: makeId('prayer_end'),
            type: 'prayer_end',
            prayer,
            scheduledTime: prayerEnd,
            executed: false,
        });

        return events;
    }

    /**
     * Start the scheduler
     */
    start(): void {
        if (this.intervalId !== null) return;

        this.intervalId = window.setInterval(() => {
            this.checkEvents();
        }, this.checkIntervalMs);
    }

    /**
     * Stop the scheduler
     */
    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Check for events to execute
     */
    private checkEvents(): void {
        const now = new Date();

        for (const event of this.events) {
            if (!event.executed && event.scheduledTime <= now) {
                event.executed = true;
                this.onEvent?.(event);
            }
        }
    }

    /**
     * Get all scheduled events
     */
    getEvents(): ScheduledEvent[] {
        return [...this.events];
    }

    /**
     * Get next scheduled event
     */
    getNextEvent(): ScheduledEvent | null {
        const now = new Date();
        return this.events.find(e => !e.executed && e.scheduledTime > now) ?? null;
    }

    /**
     * Clear all events
     */
    clearEvents(): void {
        this.events = [];
    }

    /**
     * Check if scheduler is running
     */
    isRunning(): boolean {
        return this.intervalId !== null;
    }

    /**
     * Reset executed status for all events
     */
    resetExecuted(): void {
        this.events.forEach(e => e.executed = false);
    }

    /**
     * Destroy scheduler
     */
    destroy(): void {
        this.stop();
        this.clearEvents();
        this.onEvent = null;
    }
}

// Singleton instance
let schedulerInstance: TimeScheduler | null = null;

export function getScheduler(): TimeScheduler {
    if (!schedulerInstance) {
        schedulerInstance = new TimeScheduler();
    }
    return schedulerInstance;
}
