// Date Utilities

import { DAY_NAMES, DAY_NAMES_SHORT, MONTH_NAMES } from './constants';
import type { Language, DateDisplay } from '../types/global.types';

/**
 * Get today's date at midnight
 */
export function getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Get day name from date
 */
export function getDayName(date: Date, lang: Language = 'id'): string {
    const dayIndex = date.getDay();
    return DAY_NAMES[lang]?.[dayIndex] ?? DAY_NAMES.en[dayIndex];
}

/**
 * Get short day name from date
 */
export function getDayNameShort(date: Date, lang: Language = 'id'): string {
    const dayIndex = date.getDay();
    return DAY_NAMES_SHORT[lang]?.[dayIndex] ?? DAY_NAMES_SHORT.en[dayIndex];
}

/**
 * Get month name from date
 */
export function getMonthName(date: Date, lang: Language = 'id'): string {
    const monthIndex = date.getMonth();
    return MONTH_NAMES[lang]?.[monthIndex] ?? MONTH_NAMES.en[monthIndex];
}

/**
 * Format date for display
 */
export function formatDate(date: Date, lang: Language = 'id'): DateDisplay {
    return {
        dayName: getDayName(date, lang),
        dayNameShort: getDayNameShort(date, lang),
        date: date.getDate(),
        month: date.getMonth() + 1,
        monthName: getMonthName(date, lang),
        year: date.getFullYear(),
        formatted: `${getDayName(date, lang)}, ${date.getDate()} ${getMonthName(date, lang)} ${date.getFullYear()}`,
    };
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

/**
 * Add seconds to a date
 */
export function addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
}

/**
 * Get difference in seconds between two dates
 */
export function diffInSeconds(date1: Date, date2: Date): number {
    return Math.floor((date1.getTime() - date2.getTime()) / 1000);
}

/**
 * Get difference in minutes between two dates
 */
export function diffInMinutes(date1: Date, date2: Date): number {
    return Math.floor((date1.getTime() - date2.getTime()) / 60000);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if time1 is before time2 (same day)
 */
export function isBefore(time1: Date, time2: Date): boolean {
    return time1.getTime() < time2.getTime();
}

/**
 * Check if time1 is after time2 (same day)
 */
export function isAfter(time1: Date, time2: Date): boolean {
    return time1.getTime() > time2.getTime();
}

/**
 * Check if current time is between two times
 */
export function isBetween(current: Date, start: Date, end: Date): boolean {
    return current.getTime() >= start.getTime() && current.getTime() < end.getTime();
}

/**
 * Create a date from hours (decimal) on a specific date
 */
export function hoursToDate(hours: number, baseDate: Date): Date {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);

    const result = new Date(baseDate);
    result.setHours(h, m, s, 0);
    return result;
}

/**
 * Get current time as decimal hours
 */
export function getCurrentTimeAsHours(): number {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}
