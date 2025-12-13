// Iqamah Wait Screen - Waiting for Iqamah

import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import { PRAYER_DISPLAY_NAMES } from '../../types/prayer.types';
import './PrayerFlow.css';

interface IqamahWaitScreenProps {
    className?: string;
}

export function IqamahWaitScreen({ className = '' }: IqamahWaitScreenProps) {
    const { currentPrayer, getFormattedRemainingTime } = usePrayerFlow();

    if (!currentPrayer) return null;

    const names = PRAYER_DISPLAY_NAMES[currentPrayer];

    return (
        <div className={`prayer-flow-screen iqamah-wait-screen ${className}`}>
            <div className="prayer-flow-screen__content">
                <div className="iqamah-wait-screen__title">Menunggu Iqamah</div>
                <div className="iqamah-wait-screen__subtitle">
                    Sholat {names.id} - {names.ar}
                </div>

                <div className="iqamah-wait-screen__countdown">
                    {getFormattedRemainingTime()}
                </div>

                <div className="iqamah-wait-screen__label">
                    Menuju Iqamah
                </div>
            </div>
        </div>
    );
}

export default IqamahWaitScreen;
