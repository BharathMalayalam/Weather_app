import React from 'react';
import { Droplets } from 'lucide-react';
import type { DailyForecast, TemperatureUnit } from '../types/weather';
import { convertTemp, getTempSymbol, formatDay, getWeatherIconUrl } from '../utils/weatherUtils';

interface DailyForecastProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

export const DailyForecastPanel: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  const symbol = getTempSymbol(unit);

  // Get overall range for the progress bar widths
  const allMins = daily.map(d => convertTemp(d.tempMin, unit));
  const allMaxs = daily.map(d => convertTemp(d.tempMax, unit));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);

  return (
    <div className="glass rounded-[24px] p-4 md:p-5 fade-in-up fade-in-up-delay-3 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
        7-Day Forecast
      </h3>
      <div className="space-y-1">
        {daily.map((day, idx) => {
          const min = convertTemp(day.tempMin, unit);
          const max = convertTemp(day.tempMax, unit);
          const barStart = globalMax > globalMin ? ((min - globalMin) / (globalMax - globalMin)) * 100 : 0;
          const barWidth = globalMax > globalMin ? ((max - min) / (globalMax - globalMin)) * 100 : 100;

          return (
            <div
              key={day.dt}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 weather-card hover:bg-white/8 group
                ${idx === 0 ? 'bg-white/8 border border-white/10' : ''}`}
              id={`daily-item-${idx}`}
            >
              {/* Day */}
              <div className="w-24 flex-shrink-0">
                <span className={`text-sm font-semibold ${idx === 0 ? 'text-white' : 'text-white/70'}`}>
                  {formatDay(day.dt)}
                </span>
              </div>

              {/* Icon + Condition */}
              <div className="flex items-center gap-2 w-24 flex-shrink-0">
                <img
                  src={getWeatherIconUrl(day.icon, '2x')}
                  alt={day.condition}
                  className="w-9 h-9 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {day.pop > 0.1 && (
                  <div className="flex items-center gap-0.5">
                    <Droplets size={11} className="text-blue-300" />
                    <span className="text-xs text-blue-300">{Math.round(day.pop * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Temp range bar */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-white/40 font-medium w-10 text-right">
                  {min}{symbol}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      marginLeft: `${barStart}%`,
                      width: `${Math.max(barWidth, 5)}%`,
                      background: `linear-gradient(to right, 
                        hsl(210deg 80% 65%), 
                        hsl(30deg 90% 65%))`,
                    }}
                  />
                </div>
                <span className="text-xs text-white font-semibold w-10">
                  {max}{symbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
