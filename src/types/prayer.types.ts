// Prayer Time Types

export type PrayerName =
    | 'imsak'
    | 'fajr'      // Subuh
    | 'sunrise'   // Syuruk
    | 'dhuha'
    | 'dhuhr'     // Dzuhur
    | 'asr'
    | 'maghrib'
    | 'isha';

// 5 main prayer times that have audio sequences
export type MainPrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
    name: PrayerName;
    time: Date;
    displayName: string;
    displayNameAr: string;
}

export interface PrayerTimes {
    imsak: Date;
    fajr: Date;
    sunrise: Date;
    dhuha: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    date: Date;
}

export interface PrayerTimeCorrection {
    imsak: number;
    fajr: number;
    sunrise: number;
    dhuha: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
}

export type CalculationMethod =
    | 'MWL'           // Muslim World League
    | 'ISNA'          // Islamic Society of North America
    | 'Egypt'         // Egyptian General Authority of Survey
    | 'Makkah'        // Umm al-Qura University, Makkah
    | 'Karachi'       // University of Islamic Sciences, Karachi
    | 'Tehran'        // Institute of Geophysics, Tehran
    | 'Jafari'        // Shia Ithna Ashari
    | 'Singapore'     // MUIS Singapore
    | 'JAKIM'         // Malaysia (JAKIM)
    | 'Kemenag'       // Indonesia (Kementerian Agama)
    | 'Custom';       // Custom angles

export interface CalculationMethodParams {
    name: string;
    fajrAngle: number;
    ishaAngle: number;
    ishaMinutes?: number;
    maghribAngle?: number;
    maghribMinutes?: number;
    midnight?: 'Standard' | 'Jafari';
}

export type AsrJuristic = 'Standard' | 'Hanafi';

export type HighLatitudeRule =
    | 'NightMiddle'
    | 'OneSeventh'
    | 'AngleBased'
    | 'None';

export interface Location {
    latitude: number;
    longitude: number;
    timezone: number;
    city: string;
    country: string;
}

export interface PrayerCalculationConfig {
    method: CalculationMethod;
    asrJuristic: AsrJuristic;
    highLatitudeRule: HighLatitudeRule;
    location: Location;
    corrections: PrayerTimeCorrection;
}

export const PRAYER_DISPLAY_NAMES: Record<PrayerName, { id: string; ar: string }> = {
    imsak: { id: 'Imsak', ar: 'إمساك' },
    fajr: { id: 'Subuh', ar: 'الفجر' },
    sunrise: { id: 'Syuruk', ar: 'الشروق' },
    dhuha: { id: 'Dhuha', ar: 'الضحى' },
    dhuhr: { id: 'Dzuhur', ar: 'الظهر' },
    asr: { id: 'Ashar', ar: 'العصر' },
    maghrib: { id: 'Maghrib', ar: 'المغرب' },
    isha: { id: 'Isya', ar: 'العشاء' },
};

export const MAIN_PRAYERS: MainPrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const ALL_PRAYERS: PrayerName[] = [
    'imsak', 'fajr', 'sunrise', 'dhuha', 'dhuhr', 'asr', 'maghrib', 'isha'
];
