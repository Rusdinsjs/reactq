// useAudioControl Hook - Audio playback control

import { useCallback } from 'react';
import { useAudioStore } from '../stores/audioStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { AudioTrack, AudioType } from '../types/audio.types';
import type { MainPrayerName } from '../types/prayer.types';
import { getAudioPath } from '../utils/audioUtils';

export function useAudioControl() {
    const {
        currentTrack,
        state,
        volume,
        currentTime,
        duration,
        isMuted,
        error,
        play,
        pause,
        resume,
        stop,
        seek,
        setVolume,
        toggleMute,
    } = useAudioStore();

    const { audio: audioSettings } = useSettingsStore();

    // Create track from prayer audio settings
    const createPrayerTrack = useCallback(
        (prayer: MainPrayerName, type: AudioType): AudioTrack | null => {
            const prayerAudio = audioSettings.prayers[prayer];
            if (!prayerAudio) return null;

            let file: string;
            switch (type) {
                case 'tartil':
                    file = prayerAudio.tartilFile;
                    break;
                case 'tarhim':
                    file = prayerAudio.tarhimFile;
                    break;
                case 'adhan':
                    file = prayerAudio.adhanFile;
                    break;
            }

            if (!file) return null;

            return {
                id: `${prayer}-${type}-${Date.now()}`,
                type,
                path: getAudioPath(type, file),
                name: `${prayer} ${type}`,
            };
        },
        [audioSettings.prayers]
    );

    // Play prayer audio
    const playPrayerAudio = useCallback(
        async (prayer: MainPrayerName, type: AudioType) => {
            const track = createPrayerTrack(prayer, type);
            if (track) {
                await play(track);
            }
        },
        [createPrayerTrack, play]
    );

    // Play custom audio file
    const playCustom = useCallback(
        async (path: string, name: string, type: AudioType = 'tartil') => {
            const track: AudioTrack = {
                id: `custom-${Date.now()}`,
                type,
                path,
                name,
            };
            await play(track);
        },
        [play]
    );

    // Get progress percentage
    const getProgress = useCallback(() => {
        if (!duration || duration === 0) return 0;
        return (currentTime / duration) * 100;
    }, [currentTime, duration]);

    // Format time for display
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        // State
        currentTrack,
        state,
        volume,
        currentTime,
        duration,
        isMuted,
        error,
        isPlaying: state === 'playing',
        isPaused: state === 'paused',
        isLoading: state === 'loading',

        // Actions
        play,
        pause,
        resume,
        stop,
        seek,
        setVolume,
        toggleMute,

        // Prayer-specific
        playPrayerAudio,
        playCustom,

        // Utilities
        getProgress,
        formatTime,
    };
}
