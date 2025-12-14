// Tarhim Player Component

import { AudioVisualizer } from './AudioVisualizer';
import { useAudioControl } from '../../hooks/useAudioControl';
import './Audio.css';

interface TarhimPlayerProps {
    className?: string;
}

export function TarhimPlayer({ className = '' }: TarhimPlayerProps) {
    const { isPlaying, currentTrack } = useAudioControl();

    return (
        <div className={`tartil-player ${className}`}>
            <div className="tartil-player__title">Tarhim</div>
            <div className="tartil-player__subtitle">الترحيم</div>

            {/* Row 3: Playback Icon */}
            <div className="playback-icon">
                <div className="playback-icon__circle"></div>
                <div className="playback-icon__circle"></div>
                <div className="playback-icon__wave">
                    <div className="playback-icon__bar"></div>
                    <div className="playback-icon__bar"></div>
                    <div className="playback-icon__bar"></div>
                    <div className="playback-icon__bar"></div>
                    <div className="playback-icon__bar"></div>
                </div>
            </div>

            {isPlaying && currentTrack?.type === 'tarhim' && (
                <AudioVisualizer isPlaying={true} />
            )}
        </div>
    );
}

export default TarhimPlayer;
