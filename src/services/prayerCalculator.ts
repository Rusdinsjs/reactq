// Prayer Time Calculator Service

import type {
    PrayerTimes,
    PrayerName,
    Location,
    AsrJuristic,
    HighLatitudeRule,
    PrayerTimeCorrection,
    PrayerCalculationConfig
} from '../types/prayer.types';
import { CALCULATION_METHODS } from '../utils/constants';
import {
    julianDay,
    midDay,
    sunAngleTime,
    asrTime,
} from '../utils/prayerMath';
import { hoursToDate } from '../utils/dateUtils';

/**
 * Calculate prayer times for a given date and location
 */
export function calculatePrayerTimes(
    date: Date,
    config: PrayerCalculationConfig
): PrayerTimes {
    const { location, method, asrJuristic, highLatitudeRule, corrections } = config;
    const { latitude, longitude, timezone } = location;

    // Get method parameters
    const methodParams = CALCULATION_METHODS[method];

    // Calculate Julian Day
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const jd = julianDay(year, month, day) - longitude / (15 * 24);

    // Calculate prayer times in decimal hours
    let times = computePrayerTimes(jd, latitude, methodParams, asrJuristic);

    // Adjust for timezone
    times = adjustTimesForTimezone(times, longitude, timezone);

    // Apply high latitude adjustment if needed
    if (Math.abs(latitude) > 48) {
        times = adjustHighLatitude(times, highLatitudeRule, latitude, jd);
    }

    // Apply corrections
    times = applyCorrections(times, corrections);

    // Convert decimal hours to Date objects
    return {
        imsak: hoursToDate(times.imsak, date),
        fajr: hoursToDate(times.fajr, date),
        sunrise: hoursToDate(times.sunrise, date),
        dhuha: hoursToDate(times.dhuha, date),
        dhuhr: hoursToDate(times.dhuhr, date),
        asr: hoursToDate(times.asr, date),
        maghrib: hoursToDate(times.maghrib, date),
        isha: hoursToDate(times.isha, date),
        date,
    };
}

interface DecimalTimes {
    imsak: number;
    fajr: number;
    sunrise: number;
    dhuha: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
}

/**
 * Compute raw prayer times in decimal hours
 */
function computePrayerTimes(
    jd: number,
    latitude: number,
    method: { fajrAngle: number; ishaAngle: number; ishaMinutes?: number; maghribAngle?: number },
    asrJuristic: AsrJuristic
): DecimalTimes {
    const noon = midDay(jd, 0);

    // Fajr (before sunrise)
    const fajr = sunAngleTime(jd, method.fajrAngle, latitude, 'ccw');

    // Sunrise (sun at horizon)
    const sunrise = sunAngleTime(jd, 0.833, latitude, 'ccw');

    // Dhuha (sun at 15 degrees)
    const dhuha = sunAngleTime(jd, -15, latitude, 'ccw');

    // Dhuhr (midday)
    const dhuhr = noon;

    // Asr (shadow length)
    const asrFactor = asrJuristic === 'Hanafi' ? 2 : 1;
    const asr = asrTime(jd, latitude, asrFactor);

    // Maghrib (sunset)
    const maghrib = sunAngleTime(jd, 0.833, latitude, 'cw');

    // Isha
    let isha: number;
    if (method.ishaMinutes) {
        isha = maghrib + method.ishaMinutes / 60;
    } else {
        isha = sunAngleTime(jd, method.ishaAngle, latitude, 'cw');
    }

    // Imsak (10 minutes before Fajr)
    const imsak = fajr - 10 / 60;

    return {
        imsak,
        fajr,
        sunrise,
        dhuha,
        dhuhr,
        asr,
        maghrib,
        isha,
    };
}

/**
 * Adjust times for timezone
 */
function adjustTimesForTimezone(
    times: DecimalTimes,
    longitude: number,
    timezone: number
): DecimalTimes {
    const adjustment = timezone - longitude / 15;

    return {
        imsak: times.imsak + adjustment,
        fajr: times.fajr + adjustment,
        sunrise: times.sunrise + adjustment,
        dhuha: times.dhuha + adjustment,
        dhuhr: times.dhuhr + adjustment,
        asr: times.asr + adjustment,
        maghrib: times.maghrib + adjustment,
        isha: times.isha + adjustment,
    };
}

/**
 * Adjust for high latitudes
 */
function adjustHighLatitude(
    times: DecimalTimes,
    rule: HighLatitudeRule,
    _latitude: number,
    _jd: number
): DecimalTimes {
    if (rule === 'None') return times;

    const nightTime = times.sunrise - times.maghrib + 24;

    // Adjust Fajr
    const fajrDiff = nightTime / 2; // NightMiddle
    if (isNaN(times.fajr) || times.fajr > times.sunrise) {
        times.fajr = times.sunrise - fajrDiff;
    }

    // Adjust Isha
    const ishaDiff = nightTime / 2;
    if (isNaN(times.isha) || times.isha < times.maghrib) {
        times.isha = times.maghrib + ishaDiff;
    }

    return times;
}

/**
 * Apply user corrections
 */
function applyCorrections(
    times: DecimalTimes,
    corrections: PrayerTimeCorrection
): DecimalTimes {
    return {
        imsak: times.imsak + corrections.imsak / 60,
        fajr: times.fajr + corrections.fajr / 60,
        sunrise: times.sunrise + corrections.sunrise / 60,
        dhuha: times.dhuha + corrections.dhuha / 60,
        dhuhr: times.dhuhr + corrections.dhuhr / 60,
        asr: times.asr + corrections.asr / 60,
        maghrib: times.maghrib + corrections.maghrib / 60,
        isha: times.isha + corrections.isha / 60,
    };
}

/**
 * Get next prayer from current time
 */
export function getNextPrayer(
    prayerTimes: PrayerTimes,
    currentTime: Date
): { name: keyof PrayerTimes; time: Date } | null {
    const prayers: (keyof PrayerTimes)[] = [
        'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'
    ];

    for (const prayer of prayers) {
        const time = prayerTimes[prayer];
        if (time instanceof Date && time > currentTime) {
            return { name: prayer, time };
        }
    }

    // If all prayers have passed, return next day's Fajr
    return null;
}

/**
 * Get current prayer period
 */
export function getCurrentPrayer(
    prayerTimes: PrayerTimes,
    currentTime: Date
): PrayerName | null {
    const prayers: PrayerName[] = [
        'isha', 'maghrib', 'asr', 'dhuhr', 'sunrise', 'fajr', 'imsak'
    ];

    for (const prayer of prayers) {
        const time = prayerTimes[prayer];
        if (time instanceof Date && currentTime >= time) {
            return prayer;
        }
    }

    return null;
}

/**
 * Calculate time remaining until next prayer in seconds
 */
export function getTimeUntilNextPrayer(
    nextPrayerTime: Date,
    currentTime: Date
): number {
    return Math.max(0, Math.floor((nextPrayerTime.getTime() - currentTime.getTime()) / 1000));
}

/**
 * Create default prayer calculation config
 */
export function createDefaultConfig(location: Location): PrayerCalculationConfig {
    return {
        method: 'Kemenag',
        asrJuristic: 'Standard',
        highLatitudeRule: 'NightMiddle',
        location,
        corrections: {
            imsak: 0,
            fajr: 0,
            sunrise: 0,
            dhuha: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0,
        },
    };
}
