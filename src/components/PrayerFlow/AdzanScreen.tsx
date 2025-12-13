// Adzan Screen - Shown during adhan

import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { AudioVisualizer } from '../Audio/AudioVisualizer';
import { useAudioControl } from '../../hooks/useAudioControl';
import { PRAYER_DISPLAY_NAMES } from '../../types/prayer.types';
import './PrayerFlow.css';

interface AdzanScreenProps {
    className?: string;
}

export function AdzanScreen({ className = '' }: AdzanScreenProps) {
    const { currentPrayer, getFormattedRemainingTime } = usePrayerFlow();
    const { isPlaying } = useAudioControl();

    if (!currentPrayer) return null;

    const names = PRAYER_DISPLAY_NAMES[currentPrayer];

    return (
        <div className={`prayer-flow-screen adzan-screen ${className}`}>
            <div className="prayer-flow-screen__content">
                <div className="adzan-screen__title">ADZAN</div>
                <div className="adzan-screen__prayer-name">{names.id}</div>

                <div className="adzan-screen__arabic">
                    الله أكبر الله أكبر
                    <br />
                    أشهد أن لا إله إلا الله
                    <br />
                    أشهد أن محمداً رسول الله
                </div>

                <div className="adzan-screen__visualizer">
                    <AudioVisualizer isPlaying={isPlaying} barCount={12} />
                </div>

                <div className="adzan-screen__countdown">
                    {getFormattedRemainingTime()}
                </div>
            </div>
        </div>
    );
}

export default AdzanScreen;
