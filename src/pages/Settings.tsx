// Settings Page with Tabs
import { SettingsLayout } from '../layouts';
import {
    Tabs,
    GeneralSettings,
    PrayerSettings,
    AudioSettings,
    DisplaySettings,
    MediaSettings,
    type Tab
} from '../components/Settings';
import '../components/Settings/Settings.css';
import './Pages.css';

export function Settings() {
    const tabs: Tab[] = [
        {
            id: 'general',
            label: 'Umum',
            icon: '⚙️',
            component: <GeneralSettings />
        },
        {
            id: 'prayer',
            label: 'Waktu Sholat',
            icon: '🕌',
            component: <PrayerSettings />
        },
        {
            id: 'audio',
            label: 'Audio',
            icon: '🔊',
            component: <AudioSettings />
        },
        {
            id: 'display',
            label: 'Tampilan',
            icon: '🖥️',
            component: <DisplaySettings />
        },
        {
            id: 'media',
            label: 'Media',
            icon: '🖼️',
            component: <MediaSettings />
        }
    ];

    return (
        <SettingsLayout title="Pengaturan">
            <div className="settings-page-container">
                <Tabs tabs={tabs} />
            </div>
        </SettingsLayout>
    );
}

export default Settings;
