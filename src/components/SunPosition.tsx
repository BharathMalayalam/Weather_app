import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { formatTime } from '../utils/weatherUtils';

interface SunPositionProps {
  sunrise: number;
  sunset: number;
  timezone: number;
}

export const SunPosition: React.FC<SunPositionProps> = ({ sunrise, sunset, timezone }) => {
  const [now, setNow] = useState(() => Date.now() / 1000);

  // Update time every 30 seconds to keep countdown accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now() / 1000);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const isDay = now >= sunrise && now <= sunset;

  // Calculate day or night progress percentage
  let progress = 50;
  let statusText = '';
  let pathColor = '';
  let shadowColor = '';

  if (isDay) {
    // Daytime
    progress = ((now - sunrise) / (sunset - sunrise)) * 100;
    progress = Math.max(0, Math.min(100, progress));

    const remaining = sunset - now;
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    statusText = `${hours}h ${minutes}m until sunset`;
    pathColor = 'stroke-yellow-400/50';
    shadowColor = 'rgba(251, 191, 36, 0.8)';
  } else {
    // Nighttime
    let startNight = sunset;
    let endNight = sunrise;

    if (now > sunset) {
      // Night started today, ends tomorrow at sunrise
      endNight = sunrise + 86400;
    } else {
      // Night started yesterday, ends today at sunrise
      startNight = sunset - 86400;
    }

    progress = ((now - startNight) / (endNight - startNight)) * 100;
    progress = Math.max(0, Math.min(100, progress));

    const remaining = endNight - now;
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    statusText = `${hours}h ${minutes}m until sunrise`;
    pathColor = 'stroke-indigo-400/40';
    shadowColor = 'rgba(147, 197, 253, 0.6)';
  }

  // SVG dimensions for layout
  const r = 55;
  const cx = 100;
  const cy = 70;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle - (startAngle - endAngle) * (progress / 100);
  const orbitalX = cx + r * Math.cos(angle);
  const orbitalY = cy - r * Math.sin(angle);

  return (
    <div className="glass rounded-[24px] p-4 md:p-5 fade-in-up fade-in-up-delay-3 flex flex-col justify-between h-full shadow-[0_12px_40px_rgba(0,0,0,0.16)] min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          {isDay ? 'Solar Path' : 'Lunar Path'}
        </h3>
        <span className="text-white/60 text-xs font-medium bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          {statusText}
        </span>
      </div>

      {/* SVG Arc Display */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-[240px] relative">
          <svg viewBox="0 0 200 90" className="w-full h-auto">
            {/* Background dashed arc */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            {progress > 0 && (
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${orbitalX} ${orbitalY}`}
                fill="none"
                className={pathColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
            {/* Horizon line */}
            <line
              x1={cx - r - 10}
              y1={cy}
              x2={cx + r + 10}
              y2={cy}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
            />
            {/* Orbiting celestial body (Sun or Moon) */}
            <g transform={`translate(${orbitalX}, ${orbitalY})`}>
              <circle
                r="7"
                fill={isDay ? '#fbbf24' : '#93c5fd'}
                style={{ filter: `drop-shadow(0 0 8px ${shadowColor})` }}
              />
            </g>
          </svg>

          {/* Icon overlay on the moving orbital object */}
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              left: `${(orbitalX / 200) * 100}%`,
              top: `${(orbitalY / 90) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {isDay ? (
              <Sun size={10} className="text-amber-950 font-bold" />
            ) : (
              <Moon size={10} className="text-slate-900 font-bold" />
            )}
          </div>
        </div>
      </div>

      {/* Sunrise & Sunset Timestamps */}
      <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🌅</span>
          <div>
            <span className="block text-[10px] text-white/30 uppercase font-semibold">Sunrise</span>
            <span className="font-semibold text-white/80">{formatTime(sunrise, timezone)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-right">
          <div>
            <span className="block text-[10px] text-white/30 uppercase font-semibold">Sunset</span>
            <span className="font-semibold text-white/80">{formatTime(sunset, timezone)}</span>
          </div>
          <span className="text-sm">🌇</span>
        </div>
      </div>
    </div>
  );
};

export default SunPosition;
