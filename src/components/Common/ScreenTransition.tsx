// Common Components - Screen Transition
import { type ReactNode } from 'react';
import './Common.css';

interface ScreenTransitionProps {
    children: ReactNode;
    type?: 'fade' | 'slide' | 'zoom';
    isActive?: boolean;
    className?: string;
}

export function ScreenTransition({
    children,
    type = 'fade',
    isActive = true,
    className = '',
}: ScreenTransitionProps) {
    return (
        <div
            className={`screen-transition screen-transition--${type} ${isActive ? 'screen-transition--active' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}

export default ScreenTransition;
