// Application Constants

import type { CalculationMethodParams, CalculationMethod } from '../types/prayer.types';

// Prayer Calculation Methods with their parameters
export const CALCULATION_METHODS: Record<CalculationMethod, CalculationMethodParams> = {
    MWL: {
        name: 'Muslim World League',
        fajrAngle: 18,
        ishaAngle: 17,
    },
    ISNA: {
        name: 'Islamic Society of North America',
        fajrAngle: 15,
        ishaAngle: 15,
    },
    Egypt: {
        name: 'Egyptian General Authority of Survey',
        fajrAngle: 19.5,
        ishaAngle: 17.5,
    },
    Makkah: {
        name: 'Umm al-Qura University, Makkah',
        fajrAngle: 18.5,
        ishaAngle: 0,
        ishaMinutes: 90,
    },
    Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        fajrAngle: 18,
        ishaAngle: 18,
    },
    Tehran: {
        name: 'Institute of Geophysics, Tehran',
        fajrAngle: 17.7,
        ishaAngle: 14,
        maghribAngle: 4.5,
        midnight: 'Jafari',
    },
    Jafari: {
        name: 'Shia Ithna Ashari, Leva Institute, Qum',
        fajrAngle: 16,
        ishaAngle: 14,
        maghribAngle: 4,
        midnight: 'Jafari',
    },
    Singapore: {
        name: 'MUIS Singapore',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    JAKIM: {
        name: 'JAKIM Malaysia',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    Kemenag: {
        name: 'Kementerian Agama Indonesia',
        fajrAngle: 20,
        ishaAngle: 18,
    },
    Custom: {
        name: 'Custom',
        fajrAngle: 18,
        ishaAngle: 17,
    },
};

// Hijri Month Names
export const HIJRI_MONTHS = {
    en: [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
        'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah',
    ],
    ar: [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
        'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
    ],
    id: [
        'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
        'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
        'Ramadan', 'Syawal', 'Dzulqaidah', 'Dzulhijjah',
    ],
};

// Day Names
export const DAY_NAMES = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

export const DAY_NAMES_SHORT = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    ar: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
};

// Month Names
export const MONTH_NAMES: Record<string, string[]> = {
    en: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ],
    id: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ],
    ar: [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ],
};

// Default durations (in minutes unless specified)
export const DEFAULT_DURATIONS = {
    prePrayer: 20,           // Tartil starts 20 min before prayer
    arrivedScreen: 0.5,      // 30 seconds
    adhan: 5,                // 5 minutes
    iqamahWait: 10,          // 10 minutes (1-20 range)
    prayerTime: 15,          // 15 minutes (5-60 range)
    slideInterval: 10,       // 10 seconds per slide
    screensaverTimeout: 30,  // 30 minutes
};

// Audio paths
export const AUDIO_PATHS = {
    tartil: '/audios/tartil/',
    tarhim: '/audios/tarhim/',
    adhan: '/audios/adhan/',
};

// Image paths
export const IMAGE_PATHS = {
    mosque: '/images/mosque/',
    slides: '/images/slides/',
};

// App metadata
export const APP_INFO = {
    name: 'Jadwal Waktu Sholat',
    version: '1.0.0',
    author: 'Your Name',
};

// Local storage keys
export const STORAGE_KEYS = {
    settings: 'jws_settings',
    lastLocation: 'jws_last_location',
    customTheme: 'jws_custom_theme',
};
