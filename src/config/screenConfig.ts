// Screen Configuration
import type { PrayerFlowConfig } from '../types/prayerFlow.types';

export const DEFAULT_SCREEN_CONFIG = {
    screensaverTimeout: 30, // minutes
    transitionDuration: 300, // ms
    splashDuration: 2000, // ms
};

export const DEFAULT_PRAYER_FLOW_CONFIG: PrayerFlowConfig = {
    prePrayerDuration: 20, // Tartil starts 20 min before
    arrivedDuration: 30, // 30 seconds "prayer time arrived"
    adhanDuration: 5, // 5 minutes adhan
    iqamahWaitDuration: 10, // 10 minutes wait
    prayerDuration: 15, // 15 minutes prayer
};

export const SCREEN_NAMES = {
    splash: 'Splash',
    dashboard: 'Dashboard',
    settings: 'Pengaturan',
    screensaver: 'Screensaver',
    'prayer-arrived': 'Waktu Sholat Tiba',
    adhan: 'Adzan',
    'iqamah-wait': 'Menunggu Iqamah',
    'prayer-time': 'Waktu Sholat',
};
