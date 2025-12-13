// Audio Types

export type AudioType = 'tartil' | 'tarhim' | 'adhan';

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error';

export interface AudioTrack {
    id: string;
    type: AudioType;
    path: string;
    name: string;
    duration?: number;
}

export interface AudioPlayerState {
    currentTrack: AudioTrack | null;
    state: AudioState;
    volume: number;
    currentTime: number;
    duration: number;
    error: string | null;
}

export interface AudioQueueItem {
    track: AudioTrack;
    startTime?: Date;
    priority: number;
}

export interface AudioSchedule {
    prayerName: string;
    tartilStartTime: Date;
    tarhimStartTime: Date;
    adhanTime: Date;
}

export interface AudioConfig {
    defaultVolume: number;
    fadeInDuration: number;       // ms
    fadeOutDuration: number;      // ms
    crossfadeDuration: number;    // ms for transitions
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
    defaultVolume: 0.8,
    fadeInDuration: 2000,
    fadeOutDuration: 2000,
    crossfadeDuration: 1000,
};
