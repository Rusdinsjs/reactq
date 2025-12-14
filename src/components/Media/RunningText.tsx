// Running Text Component - Marquee style

import { useRef, useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import './Media.css';

interface RunningTextProps {
    texts?: string[];
    speed?: number;
    className?: string;
}

export function RunningText({ texts, speed, className = '' }: RunningTextProps) {
    const { runningText: settings } = useSettings();
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [animationDuration, setAnimationDuration] = useState(20);

    const displayTexts = texts ?? settings.texts;
    const displaySpeed = speed ?? settings.speed;

    const combinedText = displayTexts.join('   •   ');

    useEffect(() => {
        if (!textRef.current || !containerRef.current) return;

        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const totalDistance = textWidth + containerWidth;

        // Speed is pixels per second
        const duration = totalDistance / displaySpeed;
        setAnimationDuration(duration);
    }, [combinedText, displaySpeed]);

    if (!settings.enabled || displayTexts.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className={`running-text ${className}`}>
            <div
                ref={textRef}
                className="running-text__content"
                style={{ animationDuration: `${animationDuration}s` }}
            >
                <span>{combinedText}</span>
                <span className="running-text__spacer">{'   •   '}</span>
                <span>{combinedText}</span>
            </div>
        </div>
    );
}

export default RunningText;
