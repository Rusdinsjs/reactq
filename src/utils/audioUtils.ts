// Audio Utilities

import type { AudioType } from '../types/audio.types';
import { AUDIO_PATHS } from './constants';

/**
 * Get audio file path based on type and filename
 */
import { convertFileSrc } from '@tauri-apps/api/core';

/**
 * Get audio file path based on type and filename
 */
export function getAudioPath(type: AudioType, filename: string): string {
    if (!filename) return '';

    // Check if filename is an absolute path (external file)
    if (filename.startsWith('/') || filename.match(/^[a-zA-Z]:\\/)) {
        return convertFileSrc(filename);
    }

    // Default to assets folder
    const basePath = AUDIO_PATHS[type];
    return `${basePath}${filename}`;
}

/**
 * Get audio file extension
 */
export function getAudioExtension(path: string): string {
    const parts = path.split('.');
    return parts[parts.length - 1].toLowerCase();
}

/**
 * Check if file is a valid audio format
 */
export function isValidAudioFile(path: string): boolean {
    const validExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm'];
    const ext = getAudioExtension(path);
    return validExtensions.includes(ext);
}

/**
 * Get MIME type for audio file
 */
export function getAudioMimeType(path: string): string {
    const ext = getAudioExtension(path);
    const mimeTypes: Record<string, string> = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        ogg: 'audio/ogg',
        m4a: 'audio/mp4',
        aac: 'audio/aac',
        webm: 'audio/webm',
    };
    return mimeTypes[ext] || 'audio/mpeg';
}

/**
 * Calculate when to start audio playback to end at target time
 */
export function calculateAudioStartTime(
    targetEndTime: Date,
    audioDurationSeconds: number
): Date {
    return new Date(targetEndTime.getTime() - audioDurationSeconds * 1000);
}

/**
 * Format audio duration for display
 */
export function formatAudioDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Fade volume in or out
 */
export function createFadeAnimation(
    audio: HTMLAudioElement,
    startVolume: number,
    endVolume: number,
    durationMs: number
): Promise<void> {
    return new Promise((resolve) => {
        const steps = 20;
        const stepDuration = durationMs / steps;
        const volumeStep = (endVolume - startVolume) / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));

            if (currentStep >= steps) {
                clearInterval(interval);
                audio.volume = endVolume;
                resolve();
            }
        }, stepDuration);
    });
}

/**
 * Preload audio file
 */
export function preloadAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
        const audio = new Audio(path);
        audio.preload = 'auto';

        audio.addEventListener('canplaythrough', () => {
            resolve(audio);
        }, { once: true });

        audio.addEventListener('error', () => {
            reject(new Error(`Failed to load audio: ${path}`));
        }, { once: true });

        audio.load();
    });
}
