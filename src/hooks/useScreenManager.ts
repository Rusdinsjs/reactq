// useScreenManager Hook - Screen and fullscreen management

import { useCallback, useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useSettingsStore } from '../stores/settingsStore';
import { shouldActivateScreensaver, isPrayerFlowScreen } from '../utils/screenManager';

export function useScreenManager() {
    const {
        screen,
        isFullscreen,
        lastActivityTime,
        navigateTo,
        goBack,
        setFullscreen,
        toggleFullscreen,
        updateActivity,
    } = useUIStore();

    const { display } = useSettingsStore();

    // Track user activity
    useEffect(() => {
        const handleActivity = () => {
            updateActivity();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [updateActivity]);

    // Check for screensaver activation
    useEffect(() => {
        if (screen.current === 'screensaver' || isPrayerFlowScreen(screen.current)) {
            return; // Don't activate screensaver during prayer flow
        }

        const checkScreensaver = () => {
            if (shouldActivateScreensaver(lastActivityTime, display.screensaverTimeout)) {
                navigateTo('screensaver');
            }
        };

        const interval = setInterval(checkScreensaver, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [lastActivityTime, display.screensaverTimeout, screen.current, navigateTo]);

    // Wake from screensaver on activity
    useEffect(() => {
        if (screen.current !== 'screensaver') return;

        const handleWake = () => {
            navigateTo('dashboard');
        };

        window.addEventListener('mousemove', handleWake, { once: true });
        window.addEventListener('keydown', handleWake, { once: true });
        window.addEventListener('click', handleWake, { once: true });
        window.addEventListener('touchstart', handleWake, { once: true });

        return () => {
            window.removeEventListener('mousemove', handleWake);
            window.removeEventListener('keydown', handleWake);
            window.removeEventListener('click', handleWake);
            window.removeEventListener('touchstart', handleWake);
        };
    }, [screen.current, navigateTo]);

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFs = !!document.fullscreenElement;
            if (isFs !== isFullscreen) {
                setFullscreen(isFs);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [isFullscreen, setFullscreen]);

    // Navigate to prayer flow screen
    const showPrayerScreen = useCallback(
        (screenName: 'prayer-arrived' | 'adhan' | 'iqamah-wait' | 'prayer-time') => {
            navigateTo(screenName);
        },
        [navigateTo]
    );

    // Return to dashboard
    const returnToDashboard = useCallback(() => {
        navigateTo('dashboard');
    }, [navigateTo]);

    return {
        // State
        currentScreen: screen.current,
        previousScreen: screen.previous,
        isTransitioning: screen.isTransitioning,
        transitionType: screen.transitionType,
        isFullscreen,

        // Navigation
        navigateTo,
        goBack,
        showPrayerScreen,
        returnToDashboard,

        // Fullscreen
        setFullscreen,
        toggleFullscreen,

        // Helpers
        isPrayerFlowActive: isPrayerFlowScreen(screen.current),
        isScreensaver: screen.current === 'screensaver',
        isSettings: screen.current === 'settings',
        isDashboard: screen.current === 'dashboard',
    };
}
