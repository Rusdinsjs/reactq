// Running Text Component - Using react-fast-marquee

import Marquee from 'react-fast-marquee';
import { useSettings } from '../../hooks/useSettings';
import './Media.css';

interface RunningTextProps {
    texts?: string[];
    speed?: number;
    className?: string;
}

export function RunningText({ texts, speed, className = '' }: RunningTextProps) {
    const { runningText: settings } = useSettings();

    const displayTexts = texts ?? settings.texts;
    // Convert 0-100 range to actual speed (10-200 pixels per second)
    const displaySpeed = speed ?? Math.max(10, Math.round((settings.speed / 100) * 200));

    if (!settings.enabled || displayTexts.length === 0) {
        return null;
    }

    const combinedText = displayTexts.join('   •   ');

    return (
        <div className={`running-text ${className}`}>
            <Marquee
                speed={displaySpeed}
                gradient={true}
                gradientColor="var(--color-primary)"
                gradientWidth={50}
                pauseOnHover={true}
                className="running-text__marquee"
            >
                <span className="running-text__content">
                    {combinedText}
                    <span className="running-text__spacer">   •   </span>
                </span>
            </Marquee>
        </div>
    );
}

export default RunningText;
