// Screensaver Page - Large analog clock
import { useState, useEffect } from 'react';
import { FullscreenLayout } from '../layouts';
import { useScreenManager } from '../hooks/useScreenManager';
import { formatDate } from '../utils/dateUtils';
import { padZero } from '../utils/formatters';
import './Pages.css';

export function Screensaver() {
    const [time, setTime] = useState(new Date());
    const { returnToDashboard } = useScreenManager();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const hours = padZero(time.getHours());
    const minutes = padZero(time.getMinutes());
    const seconds = padZero(time.getSeconds());
    const dateDisplay = formatDate(time, 'id');

    return (
        <FullscreenLayout onClick={returnToDashboard}>
            <div className="screensaver">
                <div className="screensaver__clock">
                    {hours}:{minutes}
                    <span style={{ opacity: 0.5 }}>:{seconds}</span>
                </div>
                <div className="screensaver__date">
                    {dateDisplay.formatted}
                </div>
            </div>
        </FullscreenLayout>
    );
}

export default Screensaver;
