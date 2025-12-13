// Validation Utilities

import type { Location } from '../types/prayer.types';
import type { ThemeColors } from '../types/settings.types';

/**
 * Validate latitude value
 */
export function isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value
 */
export function isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
}

/**
 * Validate location object
 */
export function isValidLocation(location: Location): boolean {
    return (
        isValidLatitude(location.latitude) &&
        isValidLongitude(location.longitude) &&
        location.timezone >= -12 &&
        location.timezone <= 14 &&
        location.city.trim().length > 0
    );
}

/**
 * Validate time correction value (in minutes)
 */
export function isValidCorrection(correction: number): boolean {
    return correction >= -60 && correction <= 60;
}

/**
 * Validate duration value (in minutes)
 */
export function isValidDuration(duration: number, min: number, max: number): boolean {
    return duration >= min && duration <= max;
}

/**
 * Validate hex color code
 */
export function isValidHexColor(color: string): boolean {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

/**
 * Validate theme colors
 */
export function isValidThemeColors(colors: Partial<ThemeColors>): boolean {
    const requiredKeys: (keyof ThemeColors)[] = [
        'primary', 'secondary', 'background', 'surface',
        'text', 'textSecondary', 'accent', 'success', 'warning', 'error'
    ];

    return requiredKeys.every(key => {
        const color = colors[key];
        return color && isValidHexColor(color);
    });
}

/**
 * Validate URL path
 */
export function isValidPath(path: string): boolean {
    return path.startsWith('/') || path.startsWith('./') || path.startsWith('../');
}

/**
 * Validate volume level (0-1)
 */
export function isValidVolume(volume: number): boolean {
    return volume >= 0 && volume <= 1;
}

/**
 * Validate slide interval (seconds)
 */
export function isValidSlideInterval(interval: number): boolean {
    return interval >= 1 && interval <= 300;
}

/**
 * Validate running text speed (pixels per second)
 */
export function isValidTextSpeed(speed: number): boolean {
    return speed >= 10 && speed <= 500;
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeText(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate and clamp number to range
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
