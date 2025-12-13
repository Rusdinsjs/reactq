// UI Store - Manage UI state

import { create } from 'zustand';
import type { ScreenName, ScreenState } from '../types/prayerFlow.types';
import { getTransitionType } from '../utils/screenManager';

interface UIState {
    // Screen state
    screen: ScreenState;

    // Sidebar/menu state
    isSettingsOpen: boolean;

    // Fullscreen
    isFullscreen: boolean;

    // Modal state
    modalContent: React.ReactNode | null;
    isModalOpen: boolean;

    // Loading overlay
    isLoading: boolean;
    loadingMessage: string;

    // Last activity time (for screensaver)
    lastActivityTime: Date;

    // Actions
    navigateTo: (screen: ScreenName) => void;
    goBack: () => void;

    openSettings: () => void;
    closeSettings: () => void;
    toggleSettings: () => void;

    setFullscreen: (fullscreen: boolean) => void;
    toggleFullscreen: () => void;

    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;

    showLoading: (message?: string) => void;
    hideLoading: () => void;

    updateActivity: () => void;

    reset: () => void;
}

const DEFAULT_SCREEN_STATE: ScreenState = {
    current: 'splash',
    previous: null,
    isTransitioning: false,
    transitionType: null,
};

export const useUIStore = create<UIState>((set, get) => ({
    // Initial state
    screen: DEFAULT_SCREEN_STATE,
    isSettingsOpen: false,
    isFullscreen: false,
    modalContent: null,
    isModalOpen: false,
    isLoading: false,
    loadingMessage: 'Loading...',
    lastActivityTime: new Date(),

    // Navigate to screen
    navigateTo: (screen) => {
        const { screen: currentScreen } = get();
        const transitionType = getTransitionType(currentScreen.current, screen);

        set({
            screen: {
                current: screen,
                previous: currentScreen.current,
                isTransitioning: true,
                transitionType,
            },
        });

        // Clear transition state after animation
        setTimeout(() => {
            set((state) => ({
                screen: {
                    ...state.screen,
                    isTransitioning: false,
                    transitionType: null,
                },
            }));
        }, 300);
    },

    // Go to previous screen
    goBack: () => {
        const { screen } = get();
        if (screen.previous) {
            get().navigateTo(screen.previous);
        }
    },

    // Settings panel
    openSettings: () => set({ isSettingsOpen: true }),
    closeSettings: () => set({ isSettingsOpen: false }),
    toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

    // Fullscreen
    setFullscreen: (fullscreen) => {
        set({ isFullscreen: fullscreen });

        if (fullscreen) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    },

    toggleFullscreen: () => {
        const { isFullscreen } = get();
        get().setFullscreen(!isFullscreen);
    },

    // Modal
    openModal: (content) => set({ modalContent: content, isModalOpen: true }),
    closeModal: () => set({ modalContent: null, isModalOpen: false }),

    // Loading
    showLoading: (message = 'Loading...') => set({ isLoading: true, loadingMessage: message }),
    hideLoading: () => set({ isLoading: false }),

    // Activity tracking
    updateActivity: () => set({ lastActivityTime: new Date() }),

    // Reset
    reset: () => set({
        screen: DEFAULT_SCREEN_STATE,
        isSettingsOpen: false,
        isFullscreen: false,
        modalContent: null,
        isModalOpen: false,
        isLoading: false,
        loadingMessage: 'Loading...',
        lastActivityTime: new Date(),
    }),
}));
