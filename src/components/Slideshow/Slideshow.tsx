import { useState, useEffect, useRef } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { convertFileSrc } from '@tauri-apps/api/core';
import type { SlideItem } from '../../types/settings.types';
import './Slideshow.css';

export function Slideshow() {
    const { slides } = useSettingsStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const activeSlides = slides.slides.filter(s => s.enabled);

    // Helper to get display source
    const getFileSrc = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('blob:')) return path;
        try {
            return convertFileSrc(path);
        } catch {
            return path;
        }
    };

    useEffect(() => {
        if (activeSlides.length === 0 || !slides.enabled) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const currentSlide = activeSlides[currentIndex];
        let duration = slides.interval * 1000; // Default interval in ms

        if (currentSlide.type === 'video') {
            // For video, we wait for 'ended' event or use specified duration
            if (currentSlide.duration) {
                duration = currentSlide.duration * 1000;
            } else {
                // If no specific duration, play full video (handled by onEnded)
                // But we set a failsafe duration if video fails to load or play
                duration = 30000;
            }

            // If we have a video ref, play it
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
            }
        }

        // Set timeout for next slide
        // Exception: If it's a video without fixed duration, we rely on onEnded
        // But if it HAS a duration, we force next slide after duration
        if (currentSlide.type === 'image' || (currentSlide.type === 'video' && currentSlide.duration)) {
            timeoutRef.current = window.setTimeout(() => {
                nextSlide();
            }, duration);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, slides.enabled, slides.interval, activeSlides.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    };

    const handleVideoEnded = () => {
        // Only trigger next if we don't have a fixed duration set
        // (If fixed duration is set, the timeout handles it)
        const currentSlide = activeSlides[currentIndex];
        if (currentSlide && !currentSlide.duration) {
            nextSlide();
        }
    };

    if (!slides.enabled || activeSlides.length === 0) {
        return null;
    }

    const currentSlide = activeSlides[currentIndex];

    // Safety check just in case index is out of bounds after changes
    if (!currentSlide) {
        setCurrentIndex(0);
        return null;
    }

    return (
        <div className="slideshow-container">
            {currentSlide.type === 'image' ? (
                <img
                    src={getFileSrc(currentSlide.path)}
                    alt="Slide"
                    className="slideshow-image fade-in"
                />
            ) : (
                <video
                    ref={videoRef}
                    src={getFileSrc(currentSlide.path)}
                    className="slideshow-video fade-in"
                    muted // Autoplay usually requires muted unless user interacted
                    autoPlay
                    playsInline
                    onEnded={handleVideoEnded}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </div>
    );
}
