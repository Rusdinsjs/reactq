// Audio Configuration
import type { AudioConfig } from '../types/audio.types';

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
    defaultVolume: 0.8,
    fadeInDuration: 2000,
    fadeOutDuration: 2000,
    crossfadeDuration: 1000,
};

// Default audio file paths for each prayer
export const DEFAULT_AUDIO_PATHS = {
    fajr: {
        tartil: 'subuh_tartil.mp3',
        tarhim: 'subuh_tarhim.mp3',
        adhan: 'subuh_adhan.mp3',
    },
    dhuhr: {
        tartil: 'dzuhur_tartil.mp3',
        tarhim: 'dzuhur_tarhim.mp3',
        adhan: 'dzuhur_adhan.mp3',
    },
    asr: {
        tartil: 'ashar_tartil.mp3',
        tarhim: 'ashar_tarhim.mp3',
        adhan: 'ashar_adhan.mp3',
    },
    maghrib: {
        tartil: 'maghrib_tartil.mp3',
        tarhim: 'maghrib_tarhim.mp3',
        adhan: 'maghrib_adhan.mp3',
    },
    isha: {
        tartil: 'isya_tartil.mp3',
        tarhim: 'isya_tarhim.mp3',
        adhan: 'isya_adhan.mp3',
    },
};
