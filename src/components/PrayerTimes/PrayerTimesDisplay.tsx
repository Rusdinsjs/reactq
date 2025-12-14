// Prayer Times Display Component with Carousel/Slide Animation

import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { formatTimeShort } from '../../utils/formatters';
import './PrayerTimes.css';

export type PrayerLayoutPosition = 'left' | 'right' | 'top' | 'bottom';
export type PrayerLayoutOrientation = 'horizontal' | 'vertical';

interface PrayerTimesDisplayProps {
    className?: string;
    layout?: PrayerLayoutOrientation;
    position?: PrayerLayoutPosition; // left/right for vertical, top/bottom for horizontal
    showActiveIndicator?: boolean;
    carousel?: boolean; // Enable auto-scrolling carousel
    carouselSpeed?: number; // Speed in seconds per item
}

export function PrayerTimesDisplay({
    className = '',
    layout = 'horizontal',
    position = 'bottom',
    showActiveIndicator = true,
    carousel = true,
    carouselSpeed = 3,
}: PrayerTimesDisplayProps) {
    const { getPrayerList, isLoading } = usePrayerTimes();
    const prayers = getPrayerList();

    if (isLoading) {
        return (
            <div className={`prayer-times prayer-times--loading ${className}`}>
                <div className="prayer-times__loader">Loading...</div>
            </div>
        );
    }

    // For carousel, duplicate items for seamless loop
    const carouselItems = carousel ? [...prayers, ...prayers] : prayers;
    const animationDuration = prayers.length * carouselSpeed;

    const layoutClass = `prayer-times--${layout}`;
    const positionClass = `prayer-times--${position}`;
    const carouselClass = carousel ? 'prayer-times--carousel' : '';

    return (
        <div
            className={`prayer-times ${layoutClass} ${positionClass} ${carouselClass} ${className}`}
            style={carousel ? { '--carousel-duration': `${animationDuration}s` } as React.CSSProperties : undefined}
        >
            <div className="prayer-times__track">
                {carouselItems.map((prayer, index) => (
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
