import React, { useState } from 'react';
import './Settings.css';

export interface Tab {
    id: string;
    label: string;
    icon?: string;
    component: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
    const [activeTabId, setActiveTabId] = useState<string>(defaultTab || tabs[0]?.id);

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className="settings-tabs">
            <div className="settings-tabs__header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`settings-tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        {tab.icon && <span className="settings-tab-btn__icon">{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="settings-tabs__content">
                {activeTab?.component}
            </div>
        </div>
    );
}
