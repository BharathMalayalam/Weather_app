
// Map weather condition to background gradient + blob colors
export function getWeatherTheme(condition: string, icon: string) {
  const isNight = icon.endsWith('n');

  if (isNight) {
    return {
      bg: 'from-[#0f0c29] via-[#1a1a4e] to-[#0f0c29]',
      blob1: '#4c1d95',
      blob2: '#1e3a5f',
      blob3: '#2d1b69',
      accent: 'rgba(139, 92, 246, 0.6)',
    };
  }

  switch (condition.toLowerCase()) {
    case 'clear':
      return {
        bg: 'from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc]',
        blob1: '#f97316',
        blob2: '#fbbf24',
        blob3: '#60a5fa',
        accent: 'rgba(251, 191, 36, 0.5)',
      };
    case 'clouds':
      return {
        bg: 'from-[#374151] via-[#4b5563] to-[#1f2937]',
        blob1: '#6366f1',
        blob2: '#60a5fa',
        blob3: '#818cf8',
        accent: 'rgba(99, 102, 241, 0.5)',
      };
    case 'rain':
    case 'drizzle':
      return {
        bg: 'from-[#1e3a5f] via-[#1e40af] to-[#1e3a5f]',
        blob1: '#3b82f6',
        blob2: '#1d4ed8',
        blob3: '#60a5fa',
        accent: 'rgba(59, 130, 246, 0.5)',
      };
    case 'thunderstorm':
      return {
        bg: 'from-[#111827] via-[#1f2937] to-[#0f172a]',
        blob1: '#7c3aed',
        blob2: '#4338ca',
        blob3: '#4f46e5',
        accent: 'rgba(124, 58, 237, 0.5)',
      };
    case 'snow':
      return {
        bg: 'from-[#bfdbfe] via-[#dbeafe] to-[#e0f2fe]',
        blob1: '#93c5fd',
        blob2: '#bae6fd',
        blob3: '#a5f3fc',
        accent: 'rgba(147, 197, 253, 0.5)',
      };
    case 'mist':
    case 'fog':
    case 'haze':
      return {
        bg: 'from-[#334155] via-[#475569] to-[#334155]',
        blob1: '#94a3b8',
        blob2: '#64748b',
        blob3: '#7f8ea3',
        accent: 'rgba(148, 163, 184, 0.5)',
      };
    default:
      return {
        bg: 'from-[#1e3a5f] via-[#1e40af] to-[#312e81]',
        blob1: '#4f46e5',
        blob2: '#7c3aed',
        blob3: '#60a5fa',
        accent: 'rgba(79, 70, 229, 0.5)',
      };
  }
}

// Format timestamp to time
export function formatTime(timestamp: number, timezone: number = 0): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

// Format day name
export function formatDay(timestamp: number): string {
  const today = new Date();
  const date = new Date(timestamp * 1000);
  const todayStr = today.toDateString();
  const dateStr = date.toDateString();

  if (todayStr === dateStr) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (tomorrow.toDateString() === dateStr) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Format short day
export function formatShortDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).replace(':00', '');
}

// Convert temperature
export function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32);
  return celsius;
}

// Get temp unit symbol
export function getTempSymbol(unit: 'celsius' | 'fahrenheit'): string {
  return unit === 'celsius' ? '°C' : '°F';
}

// Get wind direction label
export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

// Get AQI label
export function getAQILabel(aqi: number): { label: string; color: string; bg: string } {
  switch (aqi) {
    case 1: return { label: 'Good', color: 'text-green-400', bg: 'bg-green-400' };
    case 2: return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    case 3: return { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-400' };
    case 4: return { label: 'Poor', color: 'text-red-400', bg: 'bg-red-400' };
    case 5: return { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-400' };
    default: return { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-400' };
  }
}

// Get UV index label
export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-green-400' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-400' };
  return { label: 'Extreme', color: 'text-purple-400' };
}

// Weather icon component (emoji-based)
export function WeatherEmoji({ condition, size = 'md', animated = false }: {
  condition: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}) {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl', xl: 'text-8xl' };
  const emojiMap: Record<string, string> = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    drizzle: '🌦️',
    thunderstorm: '⛈️',
    snow: '❄️',
    mist: '🌫️',
    fog: '🌫️',
    haze: '🌫️',
    dust: '🌪️',
    smoke: '🌫️',
    tornado: '🌪️',
  };
  const emoji = emojiMap[condition.toLowerCase()] || '🌡️';
  return (
    <span
      className={`${sizes[size]} ${animated ? 'weather-icon-pulse inline-block' : ''}`}
      role="img"
      aria-label={condition}
    >
      {emoji}
    </span>
  );
}

// Get OpenWeatherMap icon URL
export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '4x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

// Humidity comfort label
export function getHumidityLabel(humidity: number): string {
  if (humidity < 30) return 'Dry';
  if (humidity < 50) return 'Comfortable';
  if (humidity < 70) return 'Humid';
  return 'Very Humid';
}

// Visibility label
export function getVisibilityLabel(visibility: number): string {
  const km = visibility / 1000;
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  return 'Poor';
}

// Format date
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// Current date time string
export function getCurrentDateTime(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Calculate day progress (for sun arc)
export function getDayProgress(sunrise: number, sunset: number): number {
  const now = Date.now() / 1000;
  if (now < sunrise) return 0;
  if (now > sunset) return 100;
  return Math.round(((now - sunrise) / (sunset - sunrise)) * 100);
}
