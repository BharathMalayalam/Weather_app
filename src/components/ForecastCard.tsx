import React from 'react';
import type { DailyForecast, TemperatureUnit } from '../types/weather';
import { convertTemp, getTempSymbol, getWeatherIconUrl, formatDay } from '../utils/weatherUtils';

interface ForecastCardProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ daily, unit }) => {
  const symbol = getTempSymbol(unit);

  return (
    <div className="glass rounded-[20px] p-4 md:p-5 w-full">
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">7-Day Forecast</h3>
      <div className="space-y-2">
        {daily.slice(0, 7).map(day => (
          <div key={day.dt} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-28 text-sm text-white/70">{formatDay(day.dt)}</div>
              <img src={getWeatherIconUrl(day.icon, '2x')} alt={day.condition} className="w-8 h-8" />
              <div className="text-sm text-white/50 ml-2">{day.description}</div>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span>{convertTemp(day.tempMin, unit)}{symbol}</span>
              <span className="font-semibold">{convertTemp(day.tempMax, unit)}{symbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
