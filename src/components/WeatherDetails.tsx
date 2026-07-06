import React from 'react';
import type { WeatherData } from '../types/weather';
import {
  getAQILabel,
  getUVLabel,
  getHumidityLabel,
  getVisibilityLabel,
  getWindDirection,
  convertTemp,
  getTempSymbol,
} from '../utils/weatherUtils';
import type { TemperatureUnit } from '../types/weather';

interface WeatherDetailsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, unit }) => {
  const symbol = getTempSymbol(unit);
  const aqiInfo = getAQILabel(data.airQuality.aqi);
  const uvInfo = getUVLabel(data.uvIndex);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Row 1: Air Quality + Wind side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Air Quality */}
        <div className="glass rounded-2xl p-4 fade-in-up flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Air Quality</h3>
              <span className={`text-sm font-bold ${aqiInfo.color}`}>{aqiInfo.label}</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${aqiInfo.bg}`}
                style={{ width: `${(data.airQuality.aqi / 5) * 100}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PollutantRow label="PM2.5" value={`${data.airQuality.pm2_5.toFixed(1)} µg`} />
            <PollutantRow label="PM10"  value={`${data.airQuality.pm10.toFixed(1)} µg`} />
            <PollutantRow label="O₃"    value={`${data.airQuality.o3.toFixed(1)} µg`} />
            <PollutantRow label="NO₂"   value={`${data.airQuality.no2.toFixed(1)} µg`} />
          </div>
        </div>

        {/* Wind Details */}
        <div className="glass rounded-2xl p-4 fade-in-up flex flex-col justify-between">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Wind Details</h3>
          <div className="flex items-center gap-4">
            {/* Compass */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-white/15 flex items-center justify-center">
                <div className="text-xs text-white/30 absolute top-1">N</div>
                <div className="text-xs text-white/30 absolute bottom-1">S</div>
                <div className="text-xs text-white/30 absolute left-1">W</div>
                <div className="text-xs text-white/30 absolute right-1">E</div>
                <div
                  className="absolute w-1 h-8 origin-bottom transition-transform duration-700"
                  style={{ transform: `rotate(${data.windDeg}deg)`, bottom: '50%', left: '50%', marginLeft: '-2px' }}
                >
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-400 mx-auto" />
                  <div className="w-1 h-5 bg-white/40 mx-auto" />
                </div>
                <div className="w-2 h-2 rounded-full bg-white/60 z-10" />
              </div>
            </div>
            {/* Wind Stats */}
            <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <WindRow label="Speed"     value={`${data.windSpeed} m/s`} />
              {data.windGust && <WindRow label="Gust" value={`${data.windGust} m/s`} />}
              <WindRow label="Direction" value={`${getWindDirection(data.windDeg)} (${data.windDeg}°)`} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 6-card stat grid — 3 cols at md+ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <DetailCard emoji="💧" label="Humidity"   value={`${data.humidity}%`}              subLabel={getHumidityLabel(data.humidity)} progress={data.humidity}                              progressColor="bg-blue-400"   id="detail-humidity" />
        <DetailCard emoji="☀️"   label="UV Index"  value={data.uvIndex.toFixed(1)}           subLabel={uvInfo.label}                    progress={(data.uvIndex / 12) * 100}                   progressColor="bg-yellow-400" id="detail-uv" />
        <DetailCard emoji="👁️"   label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} subLabel={getVisibilityLabel(data.visibility)} progress={Math.min((data.visibility / 10000) * 100, 100)} progressColor="bg-purple-400" id="detail-visibility" />
        <DetailCard emoji="🌡️" label="Dew Point" value={`${convertTemp(data.dewPoint, unit)}${symbol}`} subLabel="Moisture level" progress={Math.max(0, Math.min(100, (data.dewPoint / 30) * 100))} progressColor="bg-cyan-400" id="detail-dewpoint" />
        <DetailCard emoji="☁️"   label="Cloudiness" value={`${data.cloudiness}%`}           subLabel={data.cloudiness < 30 ? 'Clear sky' : data.cloudiness < 70 ? 'Partly cloudy' : 'Overcast'} progress={data.cloudiness} progressColor="bg-gray-400" id="detail-cloudiness" />
        <DetailCard emoji="🔵" label="Pressure"  value={`${data.pressure} hPa`}           subLabel={data.pressure > 1013 ? 'High' : 'Low'} progress={Math.min(100, ((data.pressure - 960) / 80) * 100)} progressColor="bg-orange-400" id="detail-pressure" />
      </div>
    </div>
  );
};

// Pollutant Row
const PollutantRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center bg-white/5 rounded-lg px-2.5 py-1.5">
    <span className="text-white/50 text-xs font-medium">{label}</span>
    <span className="text-white text-xs font-semibold">{value}</span>
  </div>
);

// Wind Row
const WindRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-white/50 text-xs">{label}</span>
    <span className="text-white text-sm font-semibold">{value}</span>
  </div>
);

// Detail Card with progress
const DetailCard: React.FC<{
  emoji: string;
  label: string;
  value: string;
  subLabel: string;
  progress: number;
  progressColor: string;
  id: string;
}> = ({ emoji, label, value, subLabel, progress, progressColor, id }) => (
  <div className="glass weather-card glass-hover rounded-2xl p-3.5 cursor-default" id={id}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{emoji}</span>
      <span className="text-white/40 text-xs font-medium">{label}</span>
    </div>
    <p className="text-white font-bold text-lg mb-0.5">{value}</p>
    <p className="text-white/50 text-xs mb-2">{subLabel}</p>
    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${progressColor} transition-all duration-1000`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  </div>
);
