import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import type { HourlyForecast, TemperatureUnit } from '../types/weather';
import { convertTemp, getTempSymbol, formatShortDay, getWeatherIconUrl } from '../utils/weatherUtils';

interface HourlyForecastProps {
    hourly: HourlyForecast[];
    unit: TemperatureUnit;
}

export const HourlyForecastPanel: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const symbol = getTempSymbol(unit);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
        }
    };

    // Get temp range for gradient bar
    const temps = hourly.slice(0, 24).map(h => convertTemp(h.temp, unit));
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    return (
        <div className="glass rounded-[24px] p-4 md:p-5 fade-in-up fade-in-up-delay-2 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
            <div className="flex items-center justify-between" style={{ paddingBottom: '16px' }}>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                    24-Hour Forecast
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                        aria-label="Scroll left"
                        id="hourly-scroll-left"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                        aria-label="Scroll right"
                        id="hourly-scroll-right"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="hourly-scroll flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none' }}
            >
                {hourly.slice(0, 24).map((hour, idx) => {
                    const temp = convertTemp(hour.temp, unit);
                    const tempPercent = maxTemp > minTemp
                        ? ((temp - minTemp) / (maxTemp - minTemp)) * 100
                        : 50;

                    return (
                        <div
                            key={hour.dt}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3.5 rounded-2xl transition-all duration-200
                ${idx === 0 ? 'glass-strong border border-white/20' : 'hover:bg-white/10'}
              `}
                            id={`hourly-item-${idx}`}
                        >
                            {/* Time */}
                            <span className={`text-xs font-semibold ${idx === 0 ? 'text-white' : 'text-white/50'}`}>
                                {idx === 0 ? 'Now' : formatShortDay(hour.dt)}
                            </span>

                            {/* Weather Icon */}
                            <img
                                src={getWeatherIconUrl(hour.icon, '2x')}
                                alt={hour.condition}
                                className="w-10 h-10 object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />

                            {/* Temp */}
                            <span className={`text-sm font-bold ${idx === 0 ? 'text-white' : 'text-white/80'}`}>
                                {temp}{symbol}
                            </span>

                            {/* Temp bar */}
                            <div className="w-1 h-12 rounded-full bg-white/10 overflow-hidden relative">
                                <div
                                    className="absolute bottom-0 w-full rounded-full transition-all duration-700"
                                    style={{
                                        height: `${Math.max(10, tempPercent)}%`,
                                        background: `hsl(${60 - (tempPercent / 100) * 60 + 200}deg 80% 65%)`,
                                    }}
                                />
                            </div>

                            {/* Precipitation */}
                            {hour.pop > 0.1 && (
                                <div className="flex items-center gap-0.5">
                                    <Droplets size={10} className="text-blue-300" />
                                    <span className="text-xs text-blue-300 font-medium">
                                        {Math.round(hour.pop * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
