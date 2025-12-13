// Audio Manager Component - Central audio control

import { useEffect } from 'react';
import { useAudioStore } from '../../stores/audioStore';
import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { useAudioControl } from '../../hooks/useAudioControl';
import type { MainPrayerName } from '../../types/prayer.types';
import './Audio.css';

interface AudioManagerProps {
    className?: string;
}

export function AudioManager({ className = '' }: AudioManagerProps) {
    const { initialize } = useAudioStore();
    const { playPrayerAudio, stop, isPlaying } = useAudioControl();
    const {
        shouldPlayTartil,
        shouldPlayTarhim,
        shouldPlayAdhan,
        currentPrayer
    } = usePrayerFlow();

    // Initialize audio store on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Handle audio based on prayer flow state
    useEffect(() => {
        if (!currentPrayer) return;

        const prayer = currentPrayer as MainPrayerName;

        const playAppropriateAudio = async () => {
            if (shouldPlayTartil) {
                await playPrayerAudio(prayer, 'tartil');
            } else if (shouldPlayTarhim) {
                await playPrayerAudio(prayer, 'tarhim');
            } else if (shouldPlayAdhan) {
                await playPrayerAudio(prayer, 'adhan');
            } else if (isPlaying) {
                await stop();
            }
        };

        playAppropriateAudio();
    }, [shouldPlayTartil, shouldPlayTarhim, shouldPlayAdhan, currentPrayer, playPrayerAudio, stop, isPlaying]);

    // This component is invisible - it just manages audio
    return <div className={`audio-manager ${className}`} aria-hidden="true" />;
}

export default AudioManager;
