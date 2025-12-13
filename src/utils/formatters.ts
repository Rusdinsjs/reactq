// Formatters for displaying time, date, and numbers

import type { TimeDisplay } from '../types/global.types';

/**
 * Format time for display (with leading zeros)
 */
export function formatTime(date: Date, _show24Hour: boolean = true): TimeDisplay {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return {
        hours,
        minutes,
        seconds,
        formatted12: `${padZero(hours12)}:${padZero(minutes)}:${padZero(seconds)} ${period}`,
        formatted24: `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`,
        period,
    };
}

/**
 * Format time without seconds
 */
export function formatTimeShort(date: Date, show24Hour: boolean = true): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hours12 = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';

    if (show24Hour) {
        return `${padZero(hours)}:${padZero(minutes)}`;
    }
    return `${padZero(hours12)}:${padZero(minutes)} ${period}`;
}

/**
 * Pad number with leading zero
 */
export function padZero(num: number, length: number = 2): string {
    return String(num).padStart(length, '0');
}

/**
 * Format countdown time (HH:MM:SS or MM:SS)
 */
export function formatCountdown(totalSeconds: number): string {
    if (totalSeconds < 0) return '00:00:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
    return `${padZero(minutes)}:${padZero(seconds)}`;
}

/**
 * Format countdown with labels
 */
export function formatCountdownWithLabels(totalSeconds: number): {
    hours: string;
    minutes: string;
    seconds: string;
    hasHours: boolean;
} {
    if (totalSeconds < 0) {
        return { hours: '00', minutes: '00', seconds: '00', hasHours: false };
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours: padZero(hours),
        minutes: padZero(minutes),
        seconds: padZero(seconds),
        hasHours: hours > 0,
    };
}

/**
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes: number, lang: 'id' | 'en' = 'id'): string {
    if (minutes < 60) {
        return lang === 'id' ? `${minutes} menit` : `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return lang === 'id' ? `${hours} jam` : `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    return lang === 'id'
        ? `${hours} jam ${mins} menit`
        : `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
}

/**
 * Format decimal hours to HH:MM
 */
export function formatDecimalHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${padZero(h)}:${padZero(m)}`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}
