// Storage Service - Persist settings to localStorage

import type { AppSettings } from '../types/settings.types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
    try {
        const json = JSON.stringify(settings);
        localStorage.setItem(STORAGE_KEYS.settings, json);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings | null {
    try {
        const json = localStorage.getItem(STORAGE_KEYS.settings);
        if (!json) return null;
        return JSON.parse(json) as AppSettings;
    } catch (error) {
        console.error('Failed to load settings:', error);
        return null;
    }
}

/**
 * Clear all saved settings
 */
export function clearSettings(): void {
    try {
        localStorage.removeItem(STORAGE_KEYS.settings);
        localStorage.removeItem(STORAGE_KEYS.lastLocation);
        localStorage.removeItem(STORAGE_KEYS.customTheme);
    } catch (error) {
        console.error('Failed to clear settings:', error);
    }
}

/**
 * Save individual setting
 */
export function saveSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
): void {
    try {
        const settings = loadSettings();
        if (settings) {
            settings[key] = value;
            saveSettings(settings);
        }
    } catch (error) {
        console.error(`Failed to save setting ${key}:`, error);
    }
}

/**
 * Get individual setting
 */
export function getSetting<K extends keyof AppSettings>(
    key: K
): AppSettings[K] | null {
    try {
        const settings = loadSettings();
        return settings?.[key] ?? null;
    } catch (error) {
        console.error(`Failed to get setting ${key}:`, error);
        return null;
    }
}

/**
 * Export settings to JSON file
 */
export function exportSettings(settings: AppSettings): string {
    return JSON.stringify(settings, null, 2);
}

/**
 * Import settings from JSON string
 */
export function importSettings(json: string): AppSettings | null {
    try {
        const settings = JSON.parse(json) as AppSettings;
        // Validate required fields exist
        if (!settings.theme || !settings.location || !settings.audio) {
            throw new Error('Invalid settings format');
        }
        return settings;
    } catch (error) {
        console.error('Failed to import settings:', error);
        return null;
    }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get storage usage
 */
export function getStorageUsage(): { used: number; total: number } | null {
    try {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
            }
        }
        return {
            used: total,
            total: 5 * 1024 * 1024, // 5MB typical limit
        };
    } catch {
        return null;
    }
}
