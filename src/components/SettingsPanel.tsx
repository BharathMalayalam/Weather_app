import React from 'react';
import { Thermometer } from 'lucide-react';
import type { TemperatureUnit } from '../types/weather';

interface SettingsPanelProps {
    unit: TemperatureUnit;
    onUnitChange: (unit: TemperatureUnit) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ unit, onUnitChange }) => {
    return (
        <div className="glass rounded-[24px] p-4 md:p-5 fade-in-up shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Settings</h3>

            {/* Temperature Unit */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Thermometer size={16} className="text-orange-300" />
                    <span className="text-white/70 text-sm">Temperature Unit</span>
                </div>
                <div className="flex gap-1 glass rounded-xl p-1">
                    <button
                        id="unit-celsius-btn"
                        onClick={() => onUnitChange('celsius')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${unit === 'celsius'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-white/50 hover:text-white'
                            }`}
                    >
                        °C
                    </button>
                    <button
                        id="unit-fahrenheit-btn"
                        onClick={() => onUnitChange('fahrenheit')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${unit === 'fahrenheit'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-white/50 hover:text-white'
                            }`}
                    >
                        °F
                    </button>
                </div>
            </div>
        </div>
    );
};
