// Screen Manager Utilities

import type { ScreenName, ScreenState } from '../types/prayerFlow.types';

/**
 * Default screen state
 */
export const DEFAULT_SCREEN_STATE: ScreenState = {
    current: 'splash',
    previous: null,
    isTransitioning: false,
    transitionType: null,
};

/**
 * Get transition type based on screen change
 */
export function getTransitionType(
    from: ScreenName,
    to: ScreenName
): 'fade' | 'slide' | 'zoom' {
    // Prayer flow screens use fade
    const prayerScreens: ScreenName[] = ['prayer-arrived', 'adhan', 'iqamah-wait', 'prayer-time'];

    if (prayerScreens.includes(from) || prayerScreens.includes(to)) {
        return 'fade';
    }

    // Settings uses slide
    if (from === 'settings' || to === 'settings') {
        return 'slide';
    }

    // Screensaver uses zoom
    if (from === 'screensaver' || to === 'screensaver') {
        return 'zoom';
    }

    return 'fade';
}

/**
 * Check if screen is a prayer flow screen
 */
export function isPrayerFlowScreen(screen: ScreenName): boolean {
    return ['prayer-arrived', 'adhan', 'iqamah-wait', 'prayer-time'].includes(screen);
}

/**
 * Check if screen should hide header/footer
 */
export function isFullscreenScreen(screen: ScreenName): boolean {
    return ['screensaver', 'prayer-arrived', 'adhan', 'iqamah-wait', 'prayer-time'].includes(screen);
}

/**
 * Get screen display name
 */
export function getScreenDisplayName(screen: ScreenName, lang: 'id' | 'en' = 'id'): string {
    const names: Record<ScreenName, { id: string; en: string }> = {
        splash: { id: 'Memuat...', en: 'Loading...' },
        dashboard: { id: 'Beranda', en: 'Dashboard' },
        settings: { id: 'Pengaturan', en: 'Settings' },
        screensaver: { id: 'Screensaver', en: 'Screensaver' },
        'prayer-arrived': { id: 'Waktu Sholat Tiba', en: 'Prayer Time Arrived' },
        adhan: { id: 'Adzan', en: 'Adhan' },
        'iqamah-wait': { id: 'Menunggu Iqamah', en: 'Waiting for Iqamah' },
        'prayer-time': { id: 'Waktu Sholat', en: 'Prayer Time' },
    };

    return names[screen]?.[lang] ?? screen;
}

/**
 * Calculate screensaver activation
 */
export function shouldActivateScreensaver(
    lastActivityTime: Date,
    timeoutMinutes: number
): boolean {
    const now = new Date();
    const diffMs = now.getTime() - lastActivityTime.getTime();
    const diffMinutes = diffMs / 60000;
    return diffMinutes >= timeoutMinutes;
}

/**
 * Request fullscreen mode
 */
export async function enterFullscreen(): Promise<void> {
    try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
    } catch (error) {
        console.warn('Failed to enter fullscreen:', error);
    }
}

/**
 * Exit fullscreen mode
 */
export async function exitFullscreen(): Promise<void> {
    try {
        if (document.exitFullscreen && document.fullscreenElement) {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.warn('Failed to exit fullscreen:', error);
    }
}

/**
 * Toggle fullscreen mode
 */
export async function toggleFullscreen(): Promise<boolean> {
    if (document.fullscreenElement) {
        await exitFullscreen();
        return false;
    } else {
        await enterFullscreen();
        return true;
    }
}

/**
 * Check if currently in fullscreen
 */
export function isFullscreen(): boolean {
    return !!document.fullscreenElement;
}
