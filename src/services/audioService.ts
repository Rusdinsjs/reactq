// Audio Service - Manage audio playback

import type { AudioTrack, AudioState, AudioConfig } from '../types/audio.types';
import { createFadeAnimation, preloadAudio } from '../utils/audioUtils';
import { DEFAULT_AUDIO_CONFIG } from '../types/audio.types';

export class AudioService {
    private audioElement: HTMLAudioElement | null = null;
    private config: AudioConfig;
    private preloadedTracks: Map<string, HTMLAudioElement> = new Map();
    private onStateChange: ((state: AudioState) => void) | null = null;
    private onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;

    constructor(config: Partial<AudioConfig> = {}) {
        this.config = { ...DEFAULT_AUDIO_CONFIG, ...config };
    }

    /**
     * Set state change callback
     */
    setOnStateChange(callback: (state: AudioState) => void): void {
        this.onStateChange = callback;
    }

    /**
     * Set time update callback
     */
    setOnTimeUpdate(callback: (currentTime: number, duration: number) => void): void {
        this.onTimeUpdate = callback;
    }

    /**
     * Play an audio track
     */
    async play(track: AudioTrack, fadeIn: boolean = true): Promise<void> {
        try {
            this.notifyStateChange('loading');

            // Stop current track if playing
            if (this.audioElement) {
                await this.stop(false);
            }

            // Check if preloaded
            let audio = this.preloadedTracks.get(track.path);
            if (!audio) {
                audio = new Audio(track.path);
            }

            this.audioElement = audio;
            this.setupEventListeners();

            if (fadeIn) {
                audio.volume = 0;
                await audio.play();
                await createFadeAnimation(audio, 0, this.config.defaultVolume, this.config.fadeInDuration);
            } else {
                audio.volume = this.config.defaultVolume;
                await audio.play();
            }

            this.notifyStateChange('playing');
        } catch (error) {
            console.error('Failed to play audio:', error);
            this.notifyStateChange('error');
            throw error;
        }
    }

    /**
     * Pause current audio
     */
    pause(): void {
        if (this.audioElement && !this.audioElement.paused) {
            this.audioElement.pause();
            this.notifyStateChange('paused');
        }
    }

    /**
     * Resume paused audio
     */
    async resume(): Promise<void> {
        if (this.audioElement && this.audioElement.paused) {
            await this.audioElement.play();
            this.notifyStateChange('playing');
        }
    }

    /**
     * Stop audio playback
     */
    async stop(fadeOut: boolean = true): Promise<void> {
        if (!this.audioElement) return;

        try {
            if (fadeOut && !this.audioElement.paused) {
                await createFadeAnimation(
                    this.audioElement,
                    this.audioElement.volume,
                    0,
                    this.config.fadeOutDuration
                );
            }

            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.removeEventListeners();
            this.audioElement = null;
            this.notifyStateChange('stopped');
        } catch (error) {
            console.error('Failed to stop audio:', error);
        }
    }

    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void {
        if (this.audioElement) {
            this.audioElement.volume = Math.max(0, Math.min(1, volume));
        }
        this.config.defaultVolume = volume;
    }

    /**
     * Get current volume
     */
    getVolume(): number {
        return this.audioElement?.volume ?? this.config.defaultVolume;
    }

    /**
     * Seek to position (seconds)
     */
    seek(time: number): void {
        if (this.audioElement) {
            this.audioElement.currentTime = Math.max(0, Math.min(time, this.audioElement.duration));
        }
    }

    /**
     * Preload audio tracks
     */
    async preload(tracks: AudioTrack[]): Promise<void> {
        const loadPromises = tracks.map(async (track) => {
            try {
                const audio = await preloadAudio(track.path);
                this.preloadedTracks.set(track.path, audio);
            } catch (error) {
                console.warn(`Failed to preload: ${track.path}`);
            }
        });

        await Promise.allSettled(loadPromises);
    }

    /**
     * Clear preloaded tracks
     */
    clearPreloaded(): void {
        this.preloadedTracks.clear();
    }

    /**
     * Get current playback state
     */
    getState(): AudioState {
        if (!this.audioElement) return 'idle';
        if (this.audioElement.paused) return 'paused';
        return 'playing';
    }

    /**
     * Get current time in seconds
     */
    getCurrentTime(): number {
        return this.audioElement?.currentTime ?? 0;
    }

    /**
     * Get duration in seconds
     */
    getDuration(): number {
        return this.audioElement?.duration ?? 0;
    }

    /**
     * Check if audio is playing
     */
    isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.paused : false;
    }

    /**
     * Crossfade to another track
     */
    async crossfadeTo(track: AudioTrack): Promise<void> {
        if (!this.audioElement || this.audioElement.paused) {
            await this.play(track);
            return;
        }

        const currentAudio = this.audioElement;
        const currentVolume = currentAudio.volume;

        // Prepare new audio
        let newAudio = this.preloadedTracks.get(track.path);
        if (!newAudio) {
            newAudio = new Audio(track.path);
        }
        newAudio.volume = 0;

        try {
            await newAudio.play();

            // Crossfade
            const duration = this.config.crossfadeDuration;
            const steps = 20;
            const stepDuration = duration / steps;

            for (let i = 1; i <= steps; i++) {
                await new Promise((resolve) => setTimeout(resolve, stepDuration));
                currentAudio.volume = currentVolume * (1 - i / steps);
                newAudio.volume = currentVolume * (i / steps);
            }

            currentAudio.pause();
            currentAudio.currentTime = 0;

            this.audioElement = newAudio;
            this.setupEventListeners();
            this.notifyStateChange('playing');
        } catch (error) {
            console.error('Crossfade failed:', error);
            await this.stop(false);
            await this.play(track);
        }
    }

    private setupEventListeners(): void {
        if (!this.audioElement) return;

        this.audioElement.addEventListener('ended', this.handleEnded);
        this.audioElement.addEventListener('error', this.handleError);
        this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate);
    }

    private removeEventListeners(): void {
        if (!this.audioElement) return;

        this.audioElement.removeEventListener('ended', this.handleEnded);
        this.audioElement.removeEventListener('error', this.handleError);
        this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
    }

    private handleEnded = (): void => {
        this.notifyStateChange('stopped');
        this.audioElement = null;
    };

    private handleError = (): void => {
        this.notifyStateChange('error');
    };

    private handleTimeUpdate = (): void => {
        if (this.audioElement && this.onTimeUpdate) {
            this.onTimeUpdate(this.audioElement.currentTime, this.audioElement.duration);
        }
    };

    private notifyStateChange(state: AudioState): void {
        if (this.onStateChange) {
            this.onStateChange(state);
        }
    }

    /**
     * Destroy service and clean up
     */
    destroy(): void {
        this.stop(false);
        this.clearPreloaded();
        this.onStateChange = null;
        this.onTimeUpdate = null;
    }
}

// Singleton instance
let audioServiceInstance: AudioService | null = null;

export function getAudioService(): AudioService {
    if (!audioServiceInstance) {
        audioServiceInstance = new AudioService();
    }
    return audioServiceInstance;
}
