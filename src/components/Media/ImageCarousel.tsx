// Image Carousel Component

import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../hooks/useSettings';
import type { SlideItem } from '../../types/settings.types';
import './Media.css';

interface ImageCarouselProps {
    slides?: SlideItem[];
    interval?: number;
    showIndicators?: boolean;
    showNavigation?: boolean;
    autoPlay?: boolean;
    className?: string;
}

export function ImageCarousel({
    slides,
    interval,
    showIndicators = true,
    showNavigation = false,
    autoPlay = true,
    className = '',
}: ImageCarouselProps) {
    const { slides: settings } = useSettings();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const displaySlides = (slides ?? settings.slides).filter((s) => s.enabled);
    const displayInterval = (interval ?? settings.interval) * 1000;

    const goToNext = useCallback(() => {
        if (displaySlides.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, [displaySlides.length]);

    const goToPrev = useCallback(() => {
        if (displaySlides.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    }, [displaySlides.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-advance slides
    useEffect(() => {
        if (!autoPlay || !settings.enabled || displaySlides.length <= 1 || isVideoPlaying) {
            return;
        }

        const currentSlide = displaySlides[currentIndex];
        const slideInterval = currentSlide?.type === 'video' && currentSlide.duration
            ? currentSlide.duration * 1000
            : displayInterval;

        const timer = setTimeout(goToNext, slideInterval);

        return () => clearTimeout(timer);
    }, [currentIndex, autoPlay, settings.enabled, displaySlides, displayInterval, goToNext, isVideoPlaying]);

    const handleVideoEnd = () => {
        setIsVideoPlaying(false);
        goToNext();
    };

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    if (!settings.enabled || displaySlides.length === 0) {
        return (
            <div className={`image-carousel image-carousel--empty ${className}`}>
                <div className="image-carousel__placeholder">
                    No slides configured
                </div>
            </div>
        );
    }

    return (
        <div className={`image-carousel ${className}`}>
            {displaySlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`image-carousel__slide ${index === currentIndex ? 'image-carousel__slide--active' : ''
                        }`}
                >
                    {slide.type === 'image' ? (
                        <img
                            src={slide.path}
                            alt=""
                            className="image-carousel__image"
                            loading="lazy"
                        />
                    ) : (
                        <video
                            src={slide.path}
                            className="image-carousel__video"
                            autoPlay={index === currentIndex}
                            muted
                            onEnded={handleVideoEnd}
                            onPlay={handleVideoPlay}
                        />
                    )}
                </div>
            ))}

            {showNavigation && displaySlides.length > 1 && (
                <>
                    <button className="image-carousel__nav image-carousel__nav--prev" onClick={goToPrev}>
                        ‹
                    </button>
                    <button className="image-carousel__nav image-carousel__nav--next" onClick={goToNext}>
                        ›
                    </button>
                </>
            )}

            {showIndicators && displaySlides.length > 1 && (
                <div className="image-carousel__indicators">
                    {displaySlides.map((_, index) => (
                        <button
                            key={index}
                            className={`image-carousel__indicator ${index === currentIndex ? 'image-carousel__indicator--active' : ''
                                }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageCarousel;
