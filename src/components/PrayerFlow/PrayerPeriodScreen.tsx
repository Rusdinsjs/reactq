// Prayer Period Screen - During prayer time

import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { PRAYER_DISPLAY_NAMES } from '../../types/prayer.types';
import './PrayerFlow.css';

interface PrayerPeriodScreenProps {
    className?: string;
}

export function PrayerPeriodScreen({ className = '' }: PrayerPeriodScreenProps) {
    const { currentPrayer, getFormattedRemainingTime } = usePrayerFlow();

    if (!currentPrayer) return null;

    const names = PRAYER_DISPLAY_NAMES[currentPrayer];

    return (
        <div className={`prayer-flow-screen prayer-period-screen ${className}`}>
            <div className="prayer-flow-screen__content">
                <div className="prayer-period-screen__title">Waktu Sholat</div>
                <div className="prayer-period-screen__prayer-name">{names.id}</div>
                <div className="prayer-period-screen__arabic">{names.ar}</div>

                <div className="prayer-period-screen__message">
                    Luruskan dan rapatkan shaf. Matikan ponsel Anda.
                </div>

                <div className="prayer-period-screen__countdown">
                    {getFormattedRemainingTime()}
                </div>
            </div>
        </div>
    );
}

export default PrayerPeriodScreen;
