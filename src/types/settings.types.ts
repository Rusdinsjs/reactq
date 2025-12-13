// Settings Types
import type { CalculationMethod, AsrJuristic, HighLatitudeRule, Location, PrayerTimeCorrection, MainPrayerName } from './prayer.types';

export type ThemeName =
    | 'light'
    | 'dark'
    | 'green'
    | 'blue'
    | 'gold'
    | 'purple'
    | 'red'
    | 'teal'
    | 'custom';

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
}

export interface CustomTheme extends ThemeColors {
    name: string;
}

// Audio settings for each of the 5 main prayers
export interface PrayerAudioSettings {
    // Audio files
    tartilFile: string;           // Path to tartil audio file
    tarhimFile: string;           // Path to tarhim audio file  
    adhanFile: string;            // Path to adhan audio file

    // Durations (0 = use global default)
    tartilStartBefore: number;    // Minutes before prayer to start Tartil (0 = use global)
    iqamahDuration: number;       // Iqamah wait duration in minutes (0 = use global)
    prayerDuration: number;       // Prayer time duration in minutes (0 = use global)
}

export interface AudioSettings {
    volume: number;
    globalTartilDuration: number;      // Default minutes before prayer to start Tartil
    globalIqamahWaitDuration: number;  // Default Iqamah wait (1-20 min)
    globalPrayerDuration: number;      // Default prayer time duration (5-60 min)
    audioDirectory: string;            // External directory for audio files
    prayers: Record<MainPrayerName, PrayerAudioSettings>;
}

// Legacy support - keep these for backward compatibility
export interface AudioSettingsLegacy {
    tartilDuration: number;
    tarhimDuration: number;
    adhanDuration: number;
    iqamahWaitDuration: number;
    prayerDuration: number;
}

export interface SlideSettings {
    enabled: boolean;
    interval: number;             // Seconds between slides
    slides: SlideItem[];
}

export interface SlideItem {
    id: string;
    type: 'image' | 'video';
    path: string;
    duration?: number;            // For videos, in seconds
    enabled: boolean;
}

export interface RunningTextSettings {
    enabled: boolean;
    speed: number;                // Pixels per second
    texts: string[];
}

export interface MosqueInfo {
    name: string;
    address: string;
    city: string;
    logoPath: string;
}

export type PrayerTimesLayoutOption = 'horizontal' | 'vertical-left' | 'vertical-right';

export interface DisplaySettings {
    fullscreen: boolean;
    showSeconds: boolean;
    show24Hour: boolean;
    showHijriDate: boolean;
    showGregorianDate: boolean;
    clockSize: 'small' | 'medium' | 'large';
    screensaverTimeout: number;   // Minutes of inactivity before screensaver
    prayerTimesLayout: PrayerTimesLayoutOption; // Layout option for prayer times display
    prayerTimesCarouselSpeed: number; // Seconds per prayer item in carousel (1-10)
}

export interface AppSettings {
    // Theme
    theme: ThemeName;
    customTheme: CustomTheme | null;

    // Prayer Calculation
    calculationMethod: CalculationMethod;
    asrJuristic: AsrJuristic;
    highLatitudeRule: HighLatitudeRule;
    location: Location;
    corrections: PrayerTimeCorrection;

    // Audio
    audio: AudioSettings;

    // Display
    display: DisplaySettings;

    // Media
    slides: SlideSettings;
    runningText: RunningTextSettings;

    // Mosque
    mosque: MosqueInfo;

    // Language
    language: 'id' | 'en' | 'ar';
}

export const DEFAULT_CORRECTIONS: PrayerTimeCorrection = {
    imsak: 0,
    fajr: 0,
    sunrise: 0,
    dhuha: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
};

export const DEFAULT_LOCATION: Location = {
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 7,
    city: 'Jakarta',
    country: 'Indonesia',
};
