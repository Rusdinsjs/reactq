// Audio Store - Manage audio playback state

import { create } from 'zustand';
import type { AudioTrack, AudioState } from '../types/audio.types';
import { getAudioService } from '../services/audioService';

interface AudioStoreState {
    // Current state
    currentTrack: AudioTrack | null;
    state: AudioState;
    volume: number;
    currentTime: number;
    duration: number;
    error: string | null;

    // Queue
    queue: AudioTrack[];

    // Playback mode
    isMuted: boolean;
    isLooping: boolean;

    // Actions
    play: (track: AudioTrack) => Promise<void>;
    pause: () => void;
    resume: () => Promise<void>;
    stop: () => Promise<void>;
    seek: (time: number) => void;

    // Volume
    setVolume: (volume: number) => void;
    mute: () => void;
    unmute: () => void;
    toggleMute: () => void;

    // Queue
    addToQueue: (track: AudioTrack) => void;
    removeFromQueue: (trackId: string) => void;
    clearQueue: () => void;
    playNext: () => Promise<void>;

    // State updates (called by service)
    updateState: (state: AudioState) => void;
    updateTime: (currentTime: number, duration: number) => void;

    // Initialize
    initialize: () => void;
}

export const useAudioStore = create<AudioStoreState>((set, get) => {
    // Get audio service
    const audioService = getAudioService();

    return {
        // Initial state
        currentTrack: null,
        state: 'idle',
        volume: 0.8,
        currentTime: 0,
        duration: 0,
        error: null,
        queue: [],
        isMuted: false,
        isLooping: false,

        // Play a track
        play: async (track) => {
            try {
                set({ currentTrack: track, error: null, state: 'loading' });
                await audioService.play(track);
                set({ state: 'playing' });
            } catch (error) {
                set({
                    error: error instanceof Error ? error.message : 'Failed to play',
                    state: 'error'
                });
            }
        },

        // Pause playback
        pause: () => {
            audioService.pause();
            set({ state: 'paused' });
        },

        // Resume playback
        resume: async () => {
            try {
                await audioService.resume();
                set({ state: 'playing' });
            } catch (error) {
                set({ error: 'Failed to resume' });
            }
        },

        // Stop playback
        stop: async () => {
            await audioService.stop();
            set({
                currentTrack: null,
                state: 'stopped',
                currentTime: 0,
                duration: 0
            });
        },

        // Seek to position
        seek: (time) => {
            audioService.seek(time);
            set({ currentTime: time });
        },

        // Set volume
        setVolume: (volume) => {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            audioService.setVolume(clampedVolume);
            set({ volume: clampedVolume, isMuted: false });
        },

        // Mute
        mute: () => {
            audioService.setVolume(0);
            set({ isMuted: true });
        },

        // Unmute
        unmute: () => {
            const { volume } = get();
            audioService.setVolume(volume);
            set({ isMuted: false });
        },

        // Toggle mute
        toggleMute: () => {
            const { isMuted } = get();
            if (isMuted) {
                get().unmute();
            } else {
                get().mute();
            }
        },

        // Add track to queue
        addToQueue: (track) => {
            set((state) => ({
                queue: [...state.queue, track],
            }));
        },

        // Remove from queue
        removeFromQueue: (trackId) => {
            set((state) => ({
                queue: state.queue.filter((t) => t.id !== trackId),
            }));
        },

        // Clear queue
        clearQueue: () => {
            set({ queue: [] });
        },

        // Play next in queue
        playNext: async () => {
            const { queue, play } = get();
            if (queue.length === 0) {
                await get().stop();
                return;
            }

            const [nextTrack, ...remainingQueue] = queue;
            set({ queue: remainingQueue });
            await play(nextTrack);
        },

        // Update state (called by service callbacks)
        updateState: (state) => {
            set({ state });

            // Auto-play next if track ended
            if (state === 'stopped') {
                const { queue, isLooping, currentTrack } = get();
                if (isLooping && currentTrack) {
                    get().play(currentTrack);
                } else if (queue.length > 0) {
                    get().playNext();
                }
            }
        },

        // Update time (called by service callbacks)
        updateTime: (currentTime, duration) => {
            set({ currentTime, duration });
        },

        // Initialize store and connect to service
        initialize: () => {
            audioService.setOnStateChange((state) => {
                get().updateState(state);
            });

            audioService.setOnTimeUpdate((currentTime, duration) => {
                get().updateTime(currentTime, duration);
            });
        },
    };
});
