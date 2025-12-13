// Media Controller Component

import { useState } from 'react';
import { ImageCarousel } from './ImageCarousel';
import { usePrayerFlow } from '../../hooks/usePrayerFlow';
import './Media.css';

interface MediaControllerProps {
    className?: string;
}

export function MediaController({ className = '' }: MediaControllerProps) {
    const [isLoading] = useState(false);
    const { isInPrayerFlow } = usePrayerFlow();

    // Don't show media during prayer flow
    if (isInPrayerFlow) {
        return null;
    }

    return (
        <div className={`media-controller ${className}`}>
            {isLoading && (
                <div className="media-controller__loading">
                    <div className="media-controller__spinner" />
                </div>
            )}

            <ImageCarousel
                autoPlay={!isInPrayerFlow}
                showIndicators={true}
                showNavigation={false}
            />
        </div>
    );
}

export default MediaController;
