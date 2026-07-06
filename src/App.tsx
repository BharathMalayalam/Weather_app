import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import WeatherCard from './components/WeatherCard';
import { DailyForecastPanel } from './components/DailyForecast';
import SunPosition from './components/SunPosition';
import { HourlyForecastPanel } from './components/HourlyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { SettingsPanel } from './components/SettingsPanel';
import { getWeatherByCoords, getWeatherByGeolocation } from './services/weatherApi';
import { getWeatherTheme } from './utils/weatherUtils';
import type { WeatherData, FavoriteCity, TemperatureUnit } from './types/weather';

const FAVORITES_KEY = 'weather-app-favorites';
const UNIT_KEY = 'weather-app-unit';
const LAST_CITY_KEY = 'weather-app-last';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(UNIT_KEY) as TemperatureUnit) || 'celsius';
  });
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch { return []; }
  });
  const [showApiNote, setShowApiNote] = useState(true);

  const isDemo = !import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Persist unit preference
  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCoords(lat, lon);
      setWeather(data);
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify({ lat, lon }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((lat: number, lon: number) => {
    fetchWeather(lat, lon);
  }, [fetchWeather]);

  const handleGeolocate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherByGeolocation();
      setWeather(data);
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify({ lat: data.lat, lon: data.lon }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Geolocation failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh handled via fetchWeather directly when needed

  const toggleFavorite = useCallback((cityData?: WeatherData) => {
    const data = cityData || weather;
    if (!data) return;
    const fav: FavoriteCity = {
      name: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      addedAt: Date.now(),
    };
    setFavorites(prev => {
      const exists = prev.find(f => f.name === fav.name && f.country === fav.country);
      if (exists) return prev.filter(f => !(f.name === fav.name && f.country === fav.country));
      return [...prev, fav];
    });
  }, [weather]);

  const removeFavorite = useCallback((city: FavoriteCity) => {
    setFavorites(prev => prev.filter(f => !(f.name === city.name && f.country === city.country)));
  }, []);

  const isFavorite = weather
    ? favorites.some(f => f.name === weather.city && f.country === weather.country)
    : false;

  // Load last city on mount
  useEffect(() => {
    const last = localStorage.getItem(LAST_CITY_KEY);
    if (last) {
      try {
        const { lat, lon } = JSON.parse(last);
        fetchWeather(lat, lon);
      } catch { /* ignore */ }
    } else {
      // Default to New York (demo)
      fetchWeather(40.7128, -74.006);
    }
  }, [fetchWeather]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!weather) return;
    const interval = setInterval(() => {
      fetchWeather(weather.lat, weather.lon);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weather, fetchWeather]);

  const theme = weather
    ? getWeatherTheme(weather.condition, weather.icon)
    : {
        bg: 'from-[#1e3a5f] via-[#1e40af] to-[#312e81]',
        blob1: '#4f46e5',
        blob2: '#7c3aed',
        blob3: '#60a5fa',
        accent: 'rgba(79, 70, 229, 0.5)',
      };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* Animated Background Blobs */}
      <div
        className="blob blob-1 pointer-events-none"
        style={{ background: theme.blob1 }}
      />
      <div
        className="blob blob-2 pointer-events-none"
        style={{ background: theme.blob2 }}
      />
      <div
        className="blob blob-3 pointer-events-none"
        style={{ background: theme.blob3 }}
      />

      {/* Background noise texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          favorites={favorites}
          onToggleFavorite={removeFavorite}
          currentCity={weather?.city}
          isLoading={isLoading}
          onTogglePanel={() => {}}
        />

        {/* Demo API Note */}
        {isDemo && showApiNote && (
          <div className="px-4 md:px-6 lg:px-8 mb-2 max-w-[1400px] mx-auto w-full">
            <div className="glass rounded-xl px-4 py-2.5 flex items-start gap-2.5">
              <p className="text-white/70 text-xs flex-1">
                <span className="text-yellow-400 font-semibold">Demo Mode:</span>{' '}
                Using mock weather data. Create a{' '}
                <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">.env</code>{' '}
                file with{' '}
                <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">VITE_OPENWEATHER_API_KEY=your_key</code>{' '}
                to use real data from{' '}
                <span className="text-blue-300 underline">openweathermap.org</span>.
              </p>
              <button
                onClick={() => setShowApiNote(false)}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                aria-label="Dismiss note"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="px-4 md:px-6 lg:px-8 mb-2 max-w-[1400px] mx-auto w-full">
            <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-red-400/20">
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-xs flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-10 pt-2 max-w-[1400px] mx-auto w-full">
          {isLoading && !weather && (
            <LoadingSkeleton />
          )}

          {weather && (
            <div className="app-grid">
              {/* ── Left / Main Column ── */}
              <div className="app-main">
                <WeatherCard data={weather} unit={unit} isFavorite={isFavorite} onToggleFavorite={() => toggleFavorite()} />
                <HourlyForecastPanel hourly={weather.hourly} unit={unit} />
                <WeatherDetails data={weather} unit={unit} />
              </div>

              {/* ── Right Sidebar ── */}
              <aside className="app-sidebar">
                <SunPosition
                  sunrise={weather.sunrise}
                  sunset={weather.sunset}
                  timezone={weather.timezone}
                />
                <SettingsPanel unit={unit} onUnitChange={setUnit} />
                <DailyForecastPanel daily={weather.daily} unit={unit} />
              </aside>
            </div>
          )}

          {!isLoading && !weather && !error && (
            <EmptyState onGeolocate={handleGeolocate} />
          )}
        </main>
      </div>
    </div>
  );
}

// Loading Skeleton
const LoadingSkeleton: React.FC = () => (
  <div className="app-grid">
    <div className="app-main space-y-5">
      <div className="glass-strong rounded-[28px] p-6 h-80 shimmer" />
      <div className="glass rounded-[24px] h-48 shimmer" />
      <div className="glass rounded-[24px] h-96 shimmer" />
    </div>
    <div className="app-sidebar space-y-4">
      <div className="glass rounded-[24px] h-56 shimmer" />
      <div className="glass rounded-[24px] h-20 shimmer" />
      <div className="glass rounded-[24px] h-80 shimmer" />
    </div>
  </div>
);

// Empty State
const EmptyState: React.FC<{ onGeolocate: () => void }> = ({ onGeolocate }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <span className="text-8xl mb-6 weather-icon-pulse inline-block">🌍</span>
    <h2 className="text-white text-2xl font-bold mb-3">Discover the Weather</h2>
    <p className="text-white/50 text-sm mb-6 max-w-sm">
      Search for any city worldwide or use your location to get real-time weather data.
    </p>
    <button
      onClick={onGeolocate}
      id="empty-state-geolocate-btn"
      className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200"
    >
      📍 Use My Location
    </button>
  </div>
);

// (Extra info panel removed — replaced by ForecastCard simplified view)

export default App;