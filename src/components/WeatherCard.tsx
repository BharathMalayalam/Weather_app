import React from 'react';
import { Heart } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemp, getTempSymbol, getWeatherIconUrl } from '../utils/weatherUtils';

interface WeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit, isFavorite, onToggleFavorite }) => {
  const temp = convertTemp(data.temp, unit);
  const symbol = getTempSymbol(unit);

  return (
    <div className="glass-strong rounded-[24px] p-6 md:p-8 w-full fade-in-up">
      {/* Header: City + Favorite */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
            {data.city}, {data.country}
          </h2>
          <p className="text-white/60 text-sm mt-1 capitalize">{data.description}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-xl glass hover:bg-white/15 transition-all duration-200 flex-shrink-0 ml-4 ${
            isFavorite ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-300'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Temperature + Icon Row */}
      <div className="flex items-center justify-between">
        {/* Left: Big temp */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-extralight leading-none" style={{ fontSize: 'clamp(5rem, 10vw, 8rem)' }}>
              {temp}
            </span>
            <span className="text-white/50 text-3xl font-light">{symbol}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-white/50 text-sm">
            <span>Feels {convertTemp(data.feelsLike, unit)}{symbol}</span>
            <span className="text-orange-300">↑ {convertTemp(data.tempMax, unit)}{symbol}</span>
            <span className="text-blue-300">↓ {convertTemp(data.tempMin, unit)}{symbol}</span>
          </div>
        </div>

        {/* Right: Weather Icon */}
        <img
          src={getWeatherIconUrl(data.icon, '4x')}
          alt={data.condition}
          className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl weather-icon-pulse flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    </div>
  );
};

export default WeatherCard;
