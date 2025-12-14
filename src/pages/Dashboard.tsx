// Dashboard Page - Main display
import { MainLayout } from '../layouts';
import { DateTimeDisplay } from '../components/Clock';
import { PrayerTimesDisplay, CountdownTimer } from '../components/PrayerTimes';
import { MediaController } from '../components/Media';
import { AudioManager } from '../components/Audio';
import { useScreenManager } from '../hooks/useScreenManager';
import { useSettings } from '../hooks/useSettings';
import './Pages.css';

export function Dashboard() {
    const { navigateTo } = useScreenManager();
    const { display } = useSettings();

    const prayerLayout = display.prayerTimesLayout;

    return (
        <MainLayout>
            <AudioManager />

            <div className={`dashboard dashboard--prayer-${prayerLayout}`}>
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
                    <div className="dashboard__main">
                        {/* Left: Clock and Date */}
                        <div className="dashboard__clock-section">
                            <DateTimeDisplay clockSize="large" />
                        </div>

                        {/* Center: Media Carousel */}
                        <div className="dashboard__media-section">
                            <MediaController />
                        </div>

                        {/* Right: Countdown */}
                        <div className="dashboard__countdown-section">
                            <CountdownTimer showPrayerName={true} showLabels={true} />
                        </div>
                    </div>

                    {/* Bottom: Horizontal Prayer Times (above running text) */}
                    {prayerLayout === 'horizontal' && (
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
