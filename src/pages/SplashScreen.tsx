// Splash Screen Page
import { useEffect } from 'react';
import { useScreenManager } from '../hooks/useScreenManager';
import { useSettings } from '../hooks/useSettings';
import './Pages.css';

interface SplashScreenProps {
    minDuration?: number;
}

export function SplashScreen({ minDuration = 2000 }: SplashScreenProps) {
    const { navigateTo } = useScreenManager();
    const { isLoaded } = useSettings();

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                navigateTo('dashboard');
            }, minDuration);

            return () => clearTimeout(timer);
        }
    }, [isLoaded, minDuration, navigateTo]);

    return (
        <div className="splash-screen">
            <div className="splash-screen__logo">🕌</div>
            <h1 className="splash-screen__title">Jadwal Waktu Sholat</h1>
            <p className="splash-screen__subtitle">Prayer Time Clock</p>
            <div className="splash-screen__loader" />
        </div>
    );
}

export default SplashScreen;
