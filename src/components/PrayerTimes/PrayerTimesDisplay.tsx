// Prayer Times Display Component with CSS Animation Carousel

import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { formatTimeShort } from '../../utils/formatters';
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
                        <div className="prayer-times__icon">🕌</div>
                        <div className="prayer-times__content">
                            <div className="prayer-times__name">
                                <span className="prayer-times__name-id">{prayer.displayName}</span>
                                <span className="prayer-times__name-ar">{prayer.displayNameAr}</span>
                            </div>
                            <div className="prayer-times__time">
                                {formatTimeShort(prayer.time, true)}
                            </div>
                        </div>
                        {prayer.isNext && (
                            <div className="prayer-times__next-badge">Berikutnya</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrayerTimesDisplay;
