import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { formatTimeShort } from '../../utils/formatters';
import {
    Moon,
    CloudSun,
    Sunrise,
    Sun,
    Sunset,
    MoonStar,
    Coffee
} from 'lucide-react';
import './PrayerTimes.css';

export type PrayerLayoutPosition = 'left' | 'right' | 'top' | 'bottom';
export type PrayerLayoutOrientation = 'horizontal' | 'vertical';

interface PrayerTimesDisplayProps {
    className?: string;
    layout?: PrayerLayoutOrientation;
    position?: PrayerLayoutPosition;
    showActiveIndicator?: boolean;
    carousel?: boolean;
    carouselSpeed?: number; // 0-100 range
}

const getIconForPrayer = (prayerName: string) => {
    switch (prayerName.toLowerCase()) {
        case 'imsak':
            return <Coffee size={28} strokeWidth={1.5} />;
        case 'fajr':
            return <CloudSun size={28} strokeWidth={1.5} />;
        case 'sunrise':
            return <Sunrise size={28} strokeWidth={1.5} />;
        case 'dhuha':
            return <Sun size={28} strokeWidth={1.5} />;
        case 'dhuhr':
            return <Sun size={28} strokeWidth={2} />; // Bolder
        case 'asr':
            return <CloudSun size={28} strokeWidth={1.5} />;
        case 'maghrib':
            return <Sunset size={28} strokeWidth={1.5} />;
        case 'isha':
            return <MoonStar size={28} strokeWidth={1.5} />;
        default:
            return <Moon size={28} strokeWidth={1.5} />;
    }
};

export function PrayerTimesDisplay({
    className = '',
    layout = 'horizontal',
    position = 'bottom',
    showActiveIndicator = true,
    carousel = true,
    carouselSpeed = 50,
}: PrayerTimesDisplayProps) {
    const { getPrayerList, isLoading } = usePrayerTimes();
    const prayers = getPrayerList();

    // Convert 0-100 to animation duration (100 = fast/10s, 0 = slow/60s)
    const animationDuration = Math.max(10, Math.round(60 - (carouselSpeed / 100) * 50));

    if (isLoading) {
        return (
            <div className={`prayer-times prayer-times--loading ${className}`}>
                <div className="prayer-times__loader">Loading...</div>
            </div>
        );
    }

    // Duplicate items for seamless loop
    const displayItems = carousel ? [...prayers, ...prayers] : prayers;

    const layoutClass = `prayer-times--${layout}`;
    const positionClass = `prayer-times--${position}`;
    const carouselClass = carousel ? 'prayer-times--carousel' : '';

    return (
        <div className={`prayer-times ${layoutClass} ${positionClass} ${carouselClass} ${className}`}>
            <div
                className="prayer-times__track"
                style={{
                    animationDuration: `${animationDuration}s`,
                } as React.CSSProperties}
            >
                {displayItems.map((prayer, index) => (
                    <div
                        key={`${prayer.name}-${index}`}
                        className={`prayer-times__item ${prayer.isActive && showActiveIndicator ? 'prayer-times__item--active' : ''
                            } ${prayer.isNext ? 'prayer-times__item--next' : ''}`}
                    >
                        <div className="prayer-times__header-row">
                            <div className="prayer-times__icon">
                                {getIconForPrayer(prayer.name)}
                            </div>
                            <div className="prayer-times__name">
                                <span className="prayer-times__name-id">{prayer.displayName}</span>
                            </div>
                        </div>
                        <div className="prayer-times__time">
                            {formatTimeShort(prayer.time, true)}
                        </div>
                        {prayer.isNext && (
                            <div className="prayer-times__next-badge">Next</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrayerTimesDisplay;
