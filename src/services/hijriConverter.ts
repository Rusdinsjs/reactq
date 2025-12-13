// Hijri Date Converter Service

import { HIJRI_MONTHS } from '../utils/constants';
import type { HijriDate, Language } from '../types/global.types';

/**
 * Convert Gregorian date to Hijri date
 * Using the Umm al-Qura calendar algorithm
 */
export function toHijri(date: Date): HijriDate {
    // Julian Day calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let jd = intPart((1461 * (year + 4800 + intPart((month - 14) / 12))) / 4) +
        intPart((367 * (month - 2 - 12 * intPart((month - 14) / 12))) / 12) -
        intPart((3 * intPart((year + 4900 + intPart((month - 14) / 12)) / 100)) / 4) +
        day - 32075;

    // Convert Julian Day to Hijri
    const l = jd - 1948440 + 10632;
    const n = intPart((l - 1) / 10631);
    const remainder = l - 10631 * n + 354;
    const j = intPart((10985 - remainder) / 5316) * intPart((50 * remainder) / 17719) +
        intPart(remainder / 5670) * intPart((43 * remainder) / 15238);
    const adjustedRemainder = remainder - intPart((30 - j) / 15) * intPart((17719 * j) / 50) -
        intPart(j / 16) * intPart((15238 * j) / 43) + 29;

    const hijriMonth = intPart((24 * adjustedRemainder) / 709);
    const hijriDay = adjustedRemainder - intPart((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    return {
        day: hijriDay,
        month: hijriMonth,
        year: hijriYear,
        monthName: HIJRI_MONTHS.en[hijriMonth - 1] || '',
        monthNameAr: HIJRI_MONTHS.ar[hijriMonth - 1] || '',
    };
}

/**
 * Convert Hijri date to Gregorian date
 */
export function toGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
    const jd = intPart((11 * hijriYear + 3) / 30) +
        354 * hijriYear +
        30 * hijriMonth -
        intPart((hijriMonth - 1) / 2) +
        hijriDay + 1948440 - 385;

    // Convert Julian Day to Gregorian
    const l = jd + 68569;
    const n = intPart((4 * l) / 146097);
    const adjustedL = l - intPart((146097 * n + 3) / 4);
    const i = intPart((4000 * (adjustedL + 1)) / 1461001);
    const finalL = adjustedL - intPart((1461 * i) / 4) + 31;
    const j = intPart((80 * finalL) / 2447);

    const day = finalL - intPart((2447 * j) / 80);
    const lMonthCalc = intPart(j / 11);
    const month = j + 2 - 12 * lMonthCalc;
    const year = 100 * (n - 49) + i + lMonthCalc;

    return new Date(year, month - 1, day);
}

/**
 * Integer part of a number
 */
function intPart(num: number): number {
    return Math.floor(num);
}

/**
 * Get Hijri month name by number (1-12)
 */
export function getHijriMonthName(month: number, lang: Language = 'id'): string {
    const index = month - 1;
    if (index < 0 || index >= 12) return '';

    if (lang === 'ar') {
        return HIJRI_MONTHS.ar[index];
    } else if (lang === 'id') {
        return HIJRI_MONTHS.id[index];
    }
    return HIJRI_MONTHS.en[index];
}

/**
 * Format Hijri date for display
 */
export function formatHijriDate(hijri: HijriDate, lang: Language = 'id'): string {
    const monthName = getHijriMonthName(hijri.month, lang);

    if (lang === 'ar') {
        return `${hijri.day} ${monthName} ${hijri.year} هـ`;
    }

    return `${hijri.day} ${monthName} ${hijri.year} H`;
}

/**
 * Get current Hijri date
 */
export function getCurrentHijriDate(): HijriDate {
    return toHijri(new Date());
}

/**
 * Check if current month is Ramadan
 */
export function isRamadan(date: Date = new Date()): boolean {
    const hijri = toHijri(date);
    return hijri.month === 9;
}

/**
 * Get days remaining in current Hijri month
 */
export function getDaysRemainingInMonth(date: Date = new Date()): number {
    const hijri = toHijri(date);
    // Approximate - Hijri months are 29 or 30 days
    const daysInMonth = hijri.month % 2 === 1 ? 30 : 29;
    return daysInMonth - hijri.day;
}

/**
 * Adjust Hijri date by offset (for local moon sighting variations)
 */
export function adjustHijriDate(hijri: HijriDate, dayOffset: number): HijriDate {
    // Convert to Gregorian, add offset, convert back
    const gregorian = toGregorian(hijri.year, hijri.month, hijri.day);
    gregorian.setDate(gregorian.getDate() + dayOffset);
    return toHijri(gregorian);
}
