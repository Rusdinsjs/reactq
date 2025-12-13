// Prayer Flow Container - Coordinator for prayer flow screens
import { usePrayerFlow } from '../hooks/usePrayerFlow';
import { PrayerLayout } from '../layouts';
import {
    PrayerTimeScreen,
    AdzanScreen,
    IqamahWaitScreen,
    PrayerPeriodScreen,
} from '../components/PrayerFlow';
import { TartilPlayer, TarhimPlayer } from '../components/Audio';
import './Pages.css';

export function PrayerFlowContainer() {
    const { state, isInPrayerFlow } = usePrayerFlow();

    if (!isInPrayerFlow) {
        return null;
    }

    const renderScreen = () => {
        switch (state) {
            case 'pre-prayer':
                return (
                    <PrayerLayout>
                        <TartilPlayer />
                    </PrayerLayout>
                );
            case 'tarhim':
                return (
                    <PrayerLayout>
                        <TarhimPlayer />
                    </PrayerLayout>
                );
            case 'arrived':
                return <PrayerTimeScreen />;
            case 'adhan':
                return <AdzanScreen />;
            case 'iqamah-wait':
                return <IqamahWaitScreen />;
            case 'prayer':
                return <PrayerPeriodScreen />;
            default:
                return null;
        }
    };

    return (
        <div className="prayer-flow-container">
            {renderScreen()}
        </div>
    );
}

export default PrayerFlowContainer;
