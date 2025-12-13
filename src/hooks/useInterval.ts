// useInterval Hook - Declarative interval hook

import { useEffect, useRef, useState } from 'react';

/**
 * A declarative interval hook.
 * @param callback - Function to call on each interval
 * @param delay - Interval in milliseconds, or null to pause
 */
export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef<() => void>(callback);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        function tick() {
            savedCallback.current?.();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

/**
 * A hook that calls the callback every second
 */
export function useSecondInterval(callback: () => void, enabled: boolean = true): void {
    useInterval(callback, enabled ? 1000 : null);
}

/**
 * A hook for countdown timer
 */
export function useCountdown(
    targetTime: Date | null,
    onComplete?: () => void
): { seconds: number; isComplete: boolean } {
    const savedOnComplete = useRef(onComplete);

    useEffect(() => {
        savedOnComplete.current = onComplete;
    }, [onComplete]);

    const calculateRemaining = () => {
        if (!targetTime) return 0;
        const now = new Date();
        const diff = Math.floor((targetTime.getTime() - now.getTime()) / 1000);
        return Math.max(0, diff);
    };

    const [seconds, setSeconds] = useState(() => calculateRemaining());
    const [isComplete, setIsComplete] = useState(false);

    useInterval(() => {
        const remaining = calculateRemaining();
        setSeconds(remaining);

        if (remaining === 0 && !isComplete) {
            setIsComplete(true);
            savedOnComplete.current?.();
        }
    }, targetTime && !isComplete ? 1000 : null);

    return { seconds, isComplete };
}
