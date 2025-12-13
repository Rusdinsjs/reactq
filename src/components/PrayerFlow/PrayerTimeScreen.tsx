// Prayer Time Screen - Shown when prayer time arrives (0.5 min)

import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { PRAYER_DISPLAY_NAMES } from '../../types/prayer.types';
import './PrayerFlow.css';

interface PrayerTimeScreenProps {
    className?: string;
}

export function PrayerTimeScreen({ className = '' }: PrayerTimeScreenProps) {
    const { currentPrayer, getFormattedRemainingTime } = usePrayerFlow();

    if (!currentPrayer) return null;

    const names = PRAYER_DISPLAY_NAMES[currentPrayer];

    return (
        <div className={`prayer-flow-screen prayer-time-screen ${className}`}>
            <div className="prayer-flow-screen__content">
                <div className="prayer-time-screen__label">Waktu Sholat Telah Tiba</div>
                <div className="prayer-time-screen__prayer-name">{names.id}</div>
                <div className="prayer-time-screen__arabic">{names.ar}</div>
                <div className="prayer-time-screen__countdown">
                    {getFormattedRemainingTime()}
                </div>
            </div>
        </div>
    );
}

export default PrayerTimeScreen;
