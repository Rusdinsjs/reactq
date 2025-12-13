// Global Types

export interface HijriDate {
    day: number;
    month: number;
    year: number;
    monthName: string;
    monthNameAr: string;
}

export interface TimeDisplay {
    hours: number;
    minutes: number;
    seconds: number;
    formatted12: string;
    formatted24: string;
    period: 'AM' | 'PM';
}

export interface DateDisplay {
    dayName: string;
    dayNameShort: string;
    date: number;
    month: number;
    monthName: string;
    year: number;
    formatted: string;
}

export interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    duration?: number;
    persistent?: boolean;
    timestamp: Date;
}

export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    path: string;
    name: string;
    duration?: number;
}

export type Language = 'id' | 'en' | 'ar';

export interface Translation {
    [key: string]: string;
}

// Re-export all types
export * from './prayer.types';
export * from './settings.types';
export * from './audio.types';
export * from './prayerFlow.types';
