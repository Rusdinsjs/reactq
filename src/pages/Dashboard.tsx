
// Dashboard Page - Main display
import { MainLayout } from '../layouts';
import { DateTimeDisplay, DigitalClock, GregorianDate, HijriDate } from '../components/Clock';
import { PrayerTimesDisplay, CountdownTimer } from '../components/PrayerTimes';
import { MediaController, RunningText } from '../components/Media';
import { MosqueHeader } from '../components/MosqueInfo';
import { AudioManager } from '../components/Audio';
import { useScreenManager } from '../hooks/useScreenManager';
import { useSettings } from '../hooks/useSettings';
import './Pages.css';

export function Dashboard() {
    const { navigateTo } = useScreenManager();
    const { display } = useSettings();

    const prayerLayout = display.prayerTimesLayout;
    const isHorizontal = prayerLayout === 'horizontal';

    return (
        <MainLayout
            showHeader={!isHorizontal}
            showRunningText={!isHorizontal}
            noPadding={isHorizontal}
        >
            <AudioManager />

            <div className={`dashboard dashboard--prayer-${prayerLayout}`}>

                {/* Custom Header for Horizontal Layout */}
                {isHorizontal && (
                    <header className="dashboard__custom-header">
                        {/* Column 1: Mosque Info */}
                        <div className="dashboard__header-col-1">
                            <MosqueHeader />
                        </div>

                        {/* Column 2: Dates */}
                        <div className="dashboard__header-col-2">
                            <GregorianDate />
                            <HijriDate />
                        </div>

                        {/* Column 3: Digital Clock */}
                        <div className="dashboard__header-col-3">
                            <DigitalClock size={display.clockSize} />
                        </div>
                    </header>
                )}

                {/* Vertical Left Prayer Times */}
                {prayerLayout === 'vertical-left' && (
                    <aside className="dashboard__prayer-aside dashboard__prayer-aside--left">
                        <PrayerTimesDisplay
                            layout="vertical"
                            position="left"
                            carousel={true}
                            carouselSpeed={display.prayerTimesCarouselSpeed}
                        />
                    </aside>
                )}

                <div className="dashboard__content">
                    {/* Horizontal Layout Specific Structure */}
                    {isHorizontal ? (
                        <div className="dashboard__main-grid">
                            {/* Content Column 1: Media */}
                            <div className="dashboard__visible-col-1">
                                <MediaController />
                            </div>

                            {/* Content Column 2: Countdown */}
                            <div className="dashboard__visible-col-2">
                                <CountdownTimer showPrayerName={true} showLabels={true} />
                            </div>
                        </div>
                    ) : (
                        /* Standard Layout for Vertical Modes */
                        <div className="dashboard__main">
                            <div className="dashboard__clock-section">
                                <DateTimeDisplay clockSize="large" />
                            </div>
                            <div className="dashboard__media-section">
                                <MediaController />
                            </div>
                            <div className="dashboard__countdown-section">
                                <CountdownTimer showPrayerName={true} showLabels={true} />
                            </div>
                        </div>
                    )}

                    {/* Bottom: Horizontal Prayer Times (Row 3) */}
                    {isHorizontal && (
                        <>
                            <div className="dashboard__prayer-section dashboard__prayer-section--horizontal">
                                <PrayerTimesDisplay
                                    layout="horizontal"
                                    position="bottom"
                                    carousel={true}
                                    carouselSpeed={display.prayerTimesCarouselSpeed}
                                />
                            </div>
                            {/* Running Text (Row 4) - Internal to grid for horizontal layout */}
                            <div className="dashboard__running-text-container">
                                <RunningText />
                            </div>
                        </>
                    )}
                </div>

                {/* Vertical Right Prayer Times */}
                {prayerLayout === 'vertical-right' && (
                    <aside className="dashboard__prayer-aside dashboard__prayer-aside--right">
                        <PrayerTimesDisplay
                            layout="vertical"
                            position="right"
                            carousel={true}
                            carouselSpeed={display.prayerTimesCarouselSpeed}
                        />
                    </aside>
                )}

                {/* Settings Button */}
                <button
                    className="dashboard__settings-btn"
                    onClick={() => navigateTo('settings')}
                    title="Pengaturan"
                >
                    ⚙️
                </button>
            </div>
        </MainLayout>
    );
}

export default Dashboard;
