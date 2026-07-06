import React from 'react';
import { Star, MapPin } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';
import {
  convertTemp,
  getTempSymbol,
  getWeatherIconUrl,
  formatTime,
  getCurrentDateTime,
  getDayProgress,
} from '../utils/weatherUtils';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const symbol = getTempSymbol(unit);
  const dayProgress = getDayProgress(data.sunrise, data.sunset);

  return (
    <div className="fade-in-up">
      {/* Header: Location + Favorite */}
      <div className="flex items-start justify-between mb-6">
        <div className="fade-in-up fade-in-up-delay-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-white/60" />
            <h2 className="text-white/60 text-sm font-medium tracking-wide uppercase">
              {data.city}, {data.country}
            </h2>
          </div>
          <p className="text-white/40 text-xs">{getCurrentDateTime()}</p>
        </div>
        <button
          onClick={onToggleFavorite}
          id="favorite-toggle-btn"
          className={`p-2.5 rounded-xl glass hover:bg-white/15 transition-all duration-200 ${isFavorite ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-300'
            }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Toggle favorite"
        >
          <Star size={20} className={isFavorite ? 'fill-current star-pop' : ''} />
        </button>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-start justify-between mb-8 fade-in-up fade-in-up-delay-2">
        <div>
          {/* Weather condition */}
          <p className="text-white/70 text-lg font-medium capitalize mb-2">
            {data.description}
          </p>
          {/* Big Temperature */}
          <div className="flex items-start gap-2">
            <span className="temp-display text-[7rem] md:text-[9rem] font-extralight text-white leading-none">
              {convertTemp(data.temp, unit)}
            </span>
            <span className="text-3xl md:text-4xl font-light text-white/60 mt-4">{symbol}</span>
          </div>
          {/* Min / Max */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-sm text-white/60">
              <span className="text-blue-300">↓</span>
              {convertTemp(data.tempMin, unit)}{symbol}
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 text-sm text-white/60">
              <span className="text-orange-300">↑</span>
              {convertTemp(data.tempMax, unit)}{symbol}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-sm text-white/60">
              Feels {convertTemp(data.feelsLike, unit)}{symbol}
            </span>
          </div>
        </div>

        {/* Weather Icon */}
        <div className="weather-icon-pulse flex-shrink-0">
          <img
            src={getWeatherIconUrl(data.icon, '4x')}
            alt={data.condition}
            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>


      {/* Sunrise / Sunset Arc */}
      <SunArc
        sunrise={data.sunrise}
        sunset={data.sunset}
        timezone={data.timezone}
        progress={dayProgress}
      />
    </div>
  );
};



// Sun Arc Component
const SunArc: React.FC<{
  sunrise: number;
  sunset: number;
  timezone: number;
  progress: number;
}> = ({ sunrise, sunset, timezone, progress }) => {
  const r = 60;
  const cx = 100;
  const cy = 85;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle - (startAngle - endAngle) * (progress / 100);
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  return (
    <div className="glass rounded-2xl p-4 fade-in-up fade-in-up-delay-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Sun Position</p>
        <p className="text-white/40 text-xs">{progress}% of day</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <svg viewBox="0 0 200 100" className="w-full h-auto">
            {/* Background arc */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            {progress > 0 && (
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
                fill="none"
                stroke="rgba(251,191,36,0.5)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            {/* Horizon line */}
            <line x1={cx - r - 5} y1={cy} x2={cx + r + 5} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Sun circle */}
            <circle
              cx={sunX}
              cy={sunY}
              r="7"
              fill="#fbbf24"
              className="drop-shadow-lg"
              style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }}
            />
            {/* Sunrise marker */}
            <circle cx={cx - r} cy={cy} r="3" fill="rgba(251,191,36,0.4)" />
            {/* Sunset marker */}
            <circle cx={cx + r} cy={cy} r="3" fill="rgba(251,191,36,0.4)" />
          </svg>
        </div>
        <div className="flex flex-col gap-3 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-white/40 mb-0.5">Sunrise</p>
            <p className="text-white text-sm font-semibold">🌅 {formatTime(sunrise, timezone)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/40 mb-0.5">Sunset</p>
            <p className="text-white text-sm font-semibold">🌇 {formatTime(sunset, timezone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
