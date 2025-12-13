// Tauri Bridge Service - Bridge to Rust backend

import { invoke } from '@tauri-apps/api/core';

/**
 * Call a Tauri command
 */
export async function callCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
    try {
        return await invoke<T>(command, args);
    } catch (error) {
        console.error(`Tauri command failed: ${command}`, error);
        throw error;
    }
}

/**
 * Greet command (example from template)
 */
export async function greet(name: string): Promise<string> {
    return callCommand<string>('greet', { name });
}

/**
 * Read file from filesystem
 */
export async function readFile(_path: string): Promise<string> {
    // This would need a Rust command to be implemented
    // For now, return a placeholder
    console.warn('readFile not implemented in Rust backend yet');
    return '';
}

/**
 * Write file to filesystem
 */
export async function writeFile(_path: string, _contents: string): Promise<void> {
    // This would need a Rust command to be implemented
    console.warn('writeFile not implemented in Rust backend yet');
}

/**
 * Get app data directory
 */
export async function getAppDataDir(): Promise<string> {
    // This would need tauri-plugin-fs
    console.warn('getAppDataDir not implemented yet');
    return '';
}

/**
 * Get external audio directory path - AppData/Audio
 * Creates the directory if it doesn't exist
 */
export async function getAudioDirectory(): Promise<string> {
    if (!isTauriAvailable()) {
        // Fallback for browser - use relative path
        return '/Audio';
    }

    try {
        return await callCommand<string>('get_audio_directory');
    } catch (error) {
        console.warn('getAudioDirectory failed:', error);
        return '/Audio';
    }
}

/**
 * Open file dialog to select audio file
 */
export async function openAudioFileDialog(title: string = 'Pilih File Audio'): Promise<string | null> {
    if (!isTauriAvailable()) {
        // Fallback: use browser file input
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'audio/*';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    // Return object URL for browser
                    resolve(URL.createObjectURL(file));
                } else {
                    resolve(null);
                }
            };
            input.click();
        });
    }

    try {
        return await callCommand<string | null>('open_audio_file_dialog', { title });
    } catch (error) {
        console.warn('openAudioFileDialog failed:', error);
        return null;
    }
}

/**
 * Open folder dialog to select directory
 */
export async function openFolderDialog(title: string = 'Pilih Folder'): Promise<string | null> {
    if (!isTauriAvailable()) {
        console.warn('Folder dialog not available in browser');
        return null;
    }

    try {
        const result = await callCommand<string | null>('open_folder_dialog', { title });
        return result;
    } catch {
        console.warn('openFolderDialog not implemented in Rust backend yet');
        return null;
    }
}

/**
 * Copy audio file to destination directory
 */
export async function copyAudioFile(sourcePath: string, fileName: string, destinationDir?: string): Promise<string> {
    if (!isTauriAvailable()) {
        // In browser, just return the source path
        return sourcePath;
    }

    try {
        return await callCommand<string>('copy_audio_file', {
            sourcePath,
            fileName,
            destinationDir,
        });
    } catch (error) {
        console.warn('copyAudioFile failed:', error);
        return sourcePath;
    }
}

/**
 * Check if Tauri is available
 */
export function isTauriAvailable(): boolean {
    return typeof window !== 'undefined' && '__TAURI__' in window;
}

/**
 * Get window handle for fullscreen control
 */
export async function setFullscreen(fullscreen: boolean): Promise<void> {
    if (!isTauriAvailable()) {
        // Fallback to browser fullscreen API
        if (fullscreen) {
            await document.documentElement.requestFullscreen?.();
        } else {
            await document.exitFullscreen?.();
        }
        return;
    }

    // Would use Tauri window API
    console.warn('Tauri fullscreen not implemented yet');
}

/**
 * Prevent display sleep during prayer times
 */
export async function preventSleep(_prevent: boolean): Promise<void> {
    // This would need a Rust implementation
    console.warn('preventSleep not implemented yet');
}

/**
 * Get system volume
 */
export async function getSystemVolume(): Promise<number> {
    // This would need a Rust implementation
    return 0.8;
}

/**
 * Set system volume
 */
export async function setSystemVolume(_volume: number): Promise<void> {
    // This would need a Rust implementation
    console.warn('setSystemVolume not implemented yet');
}

/**
 * Get audio file duration in seconds
 */
export async function getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve) => {
        const audio = new Audio(filePath);
        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
        });
        audio.addEventListener('error', () => {
            console.warn('Failed to get audio duration:', filePath);
            resolve(0);
        });
    });
}
