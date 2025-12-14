// Main Application
import { useEffect } from 'react';
import { useScreenManager } from './hooks/useScreenManager';
import { useSettings } from './hooks/useSettings';
import { usePrayerFlow } from './hooks/usePrayerFlow';
import { Dashboard, Settings, SplashScreen, Screensaver, PrayerFlowContainer } from './pages';

// Import global styles
import './styles/global.css';
import './styles/animations.css';
import './styles/themes/dark.css';
import './styles/themes/light.css';
import './styles/themes/green.css';

function App() {
  const { currentScreen, isTransitioning } = useScreenManager();
  const { theme, isLoaded } = useSettings();
  const { isInPrayerFlow } = usePrayerFlow();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show splash until settings are loaded
  if (!isLoaded) {
    return <SplashScreen />;
  }

  // Prayer flow takes priority over normal screens
  if (isInPrayerFlow) {
    return <PrayerFlowContainer />;
  }

  // Screensaver takes over entire screen
  if (currentScreen === 'screensaver') {
    return <Screensaver />;
  }

  // Dashboard is always rendered, Settings appears as modal overlay on top
  return (
    <div className={`app ${isTransitioning ? 'app--transitioning' : ''}`}>
      {/* Dashboard is always visible */}
      <Dashboard />

      {/* Settings Modal Overlay - rendered on top of Dashboard */}
      {currentScreen === 'settings' && <Settings />}
    </div>
  );
}

export default App;
