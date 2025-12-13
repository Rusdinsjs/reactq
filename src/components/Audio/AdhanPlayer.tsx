// Adhan Player Component

import { AudioVisualizer } from './AudioVisualizer';
import { useAudioControl } from '../../hooks/useAudioControl';
import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import './Audio.css';

interface AdhanPlayerProps {
    className?: string;
}

export function AdhanPlayer({ className = '' }: AdhanPlayerProps) {
    const { isPlaying, currentTrack } = useAudioControl();
    const { getCurrentPrayerName } = usePrayerFlow();

    return (
        <div className={`adhan-player ${className}`}>
            <div className="adhan-player__title">ADZAN {getCurrentPrayerName().toUpperCase()}</div>
            <div className="adhan-player__arabic">الله أكبر</div>

            {isPlaying && currentTrack?.type === 'adhan' && (
                <div className="adhan-player__visualizer">
                    <AudioVisualizer isPlaying={true} barCount={12} />
                </div>
            )}
        </div>
    );
}

export default AdhanPlayer;
