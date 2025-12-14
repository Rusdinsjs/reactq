// Media Controller Component

import { useState } from 'react';
import { Slideshow } from '../Slideshow/Slideshow';
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

            <Slideshow />
        </div>
    );
}

export default MediaController;
