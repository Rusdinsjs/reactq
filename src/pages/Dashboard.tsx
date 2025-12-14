// Dashboard Page - Main display
import { MainLayout } from '../layouts';
import { DateTimeDisplay, DigitalClock, GregorianDate, HijriDate } from '../components/Clock';
import { PrayerTimesDisplay, CountdownTimer } from '../components/PrayerTimes';
import { MediaController } from '../components/Media';
import { MosqueHeader, InfoPuasaSunnah } from '../components/MosqueInfo';
import { AudioManager, TartilPlayer, TarhimPlayer } from '../components/Audio';
import { useScreenManager } from '../hooks/useScreenManager';
import { usePrayerFlow } from '../hooks/usePrayerFlow';
import { useSettings } from '../hooks/useSettings';
import './Pages.css';

export function Dashboard() {
    const { navigateTo } = useScreenManager();
    const { display } = useSettings();
    const { state: prayerFlowState } = usePrayerFlow();

    const prayerLayout = display.prayerTimesLayout;
    const isHorizontal = prayerLayout === 'horizontal';

    return (
        <MainLayout showHeader={!isHorizontal}>
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

                <div className="dashboard__content">
                    {/* Horizontal Layout Specific Structure */}
                    {isHorizontal ? (
                        <div className="dashboard__main-grid">
                            {/* Content Column 1: Media */}
                            <div className="dashboard__visible-col-1">
                                <MediaController />
                            </div>

                            {/* Content Column 2: Split Rows */}
                            <div className="dashboard__visible-col-2">
                                {/* Row 1: Countdown Timer */}
                                <div className="dashboard__col-2-row-1">
                                    <CountdownTimer showPrayerName={true} showLabels={true} />
                                </div>

                                {/* Row 2: Info Puasa or Audio Player */}
                                <div className="dashboard__col-2-row-2">
                                    {prayerFlowState === 'pre-prayer' ? (
                                        <TartilPlayer className="dashboard__audio-player" />
                                    ) : prayerFlowState === 'tarhim' ? (
                                        <TarhimPlayer className="dashboard__audio-player" />
                                    ) : (
                                        <InfoPuasaSunnah />
                                    )}
                                </div>
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
                        <div className="dashboard__prayer-section dashboard__prayer-section--horizontal">
                            <PrayerTimesDisplay
                                layout="horizontal"
                                position="bottom"
                                carousel={true}
                                carouselSpeed={display.prayerTimesCarouselSpeed}
                            />
                        </div>
                    )}
                </div>


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
        </MainLayout >
    );
}

export default Dashboard;
