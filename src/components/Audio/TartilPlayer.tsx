// Tartil Player Component

import { AudioVisualizer } from './AudioVisualizer';
import { useAudioControl } from '../../hooks/useAudioControl';
import './Audio.css';

interface TartilPlayerProps {
    className?: string;
}

export function TartilPlayer({ className = '' }: TartilPlayerProps) {
    const { isPlaying, currentTrack } = useAudioControl();

    return (
        <div className={`tartil-player ${className}`}>
            <div className="tartil-player__title">Tartil Al-Qur'an</div>
            <div className="tartil-player__subtitle">تلاوة القرآن الكريم</div>

            {isPlaying && currentTrack?.type === 'tartil' && (
                <AudioVisualizer isPlaying={true} />
            )}
        </div>
    );
}

export default TartilPlayer;
