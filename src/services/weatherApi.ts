import axios from 'axios';
import type {
  WeatherData,
  HourlyForecast,
  DailyForecast,
  AirQuality,
} from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Generate fresh demo data each time it's called
function generateDemoData(city: string = 'New York', country: string = 'US', lat: number = 40.7128, lon: number = -74.006): WeatherData {
  const now = Math.floor(Date.now() / 1000);
  const hourlyIcons = ['01d', '02d', '10d', '01d', '02d', '04d'];
  const hourlyConditions = ['Clear', 'Clouds', 'Rain', 'Clear', 'Clouds', 'Clouds'];
  const hourlyDescriptions = ['clear sky', 'few clouds', 'light rain', 'clear sky', 'partly cloudy', 'overcast clouds'];

  return {
    city,
    country,
    lat,
    lon,
    temp: 24,
    feelsLike: 23,
    tempMin: 19,
    tempMax: 27,
    humidity: 62,
    pressure: 1013,
    visibility: 10000,
    windSpeed: 5.2,
    windDeg: 220,
    windGust: 8.1,
    condition: 'Clouds',
    description: 'partly cloudy',
    icon: '02d',
    cloudiness: 40,
    sunrise: now - 3600 * 6,
    sunset: now + 3600 * 6,
    timezone: -18000,
    uvIndex: 5.2,
    dewPoint: 16,
    airQuality: {
      aqi: 2,
      co: 201.94,
      no2: 15.4,
      o3: 82.3,
      pm2_5: 8.7,
      pm10: 12.1,
    },
    hourly: Array.from({ length: 24 }, (_, i) => {
      const iconIdx = i % hourlyIcons.length;
      return {
        dt: now + i * 3600,
        temp: Math.round(22 + Math.sin((i / 24) * Math.PI * 2) * 6),
        feelsLike: Math.round(20 + Math.sin((i / 24) * Math.PI * 2) * 5),
        humidity: Math.round(60 + (i % 5) * 4),
        windSpeed: Math.round((3 + (i % 3)) * 10) / 10,
        condition: hourlyConditions[iconIdx],
        description: hourlyDescriptions[iconIdx],
        icon: hourlyIcons[iconIdx],
        pop: i % 3 === 0 ? 0.3 : i % 5 === 0 ? 0.7 : 0.1,
      };
    }),
    daily: Array.from({ length: 7 }, (_, i) => {
      const icons = ['01d', '02d', '03d', '10d', '13d', '11d', '04d'];
      const conditions = ['Clear', 'Clouds', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Clouds'];
      const descriptions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'snowy', 'stormy', 'overcast'];
      const tempMins = [16, 18, 15, 17, 12, 14, 19];
      const tempMaxs = [26, 28, 24, 22, 18, 20, 27];
      return {
        dt: now + i * 86400,
        tempMin: tempMins[i],
        tempMax: tempMaxs[i],
        humidity: 55 + i * 5,
        windSpeed: 3.5 + i * 0.5,
        condition: conditions[i],
        description: descriptions[i],
        icon: icons[i],
        pop: [0.1, 0.2, 0.4, 0.7, 0.3, 0.5, 0.1][i],
        sunrise: now + i * 86400 - 21600,
        sunset: now + i * 86400 + 21600,
        uvIndex: [5.2, 3.1, 6.8, 2.0, 1.5, 4.3, 7.1][i],
      };
    }),
  };
}

export async function searchCities(query: string): Promise<Array<{ name: string; country: string; state?: string; lat: number; lon: number }>> {
  if (!query || query.length < 2) return [];
  
  if (API_KEY === 'demo') {
    // Return mock suggestions
    const cities = [
      { name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 },
      { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
      { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
      { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
      { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
      { name: 'Mumbai', country: 'IN', lat: 19.076, lon: 72.8777 },
      { name: 'Delhi', country: 'IN', lat: 28.6139, lon: 77.209 },
      { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
      { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 },
    ];
    return cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }

  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    return response.data.map((item: { name: string; country: string; state?: string; lat: number; lon: number }) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  if (API_KEY === 'demo') {
    return generateDemoData('New York', 'US', lat, lon);
  }

  try {
    const [currentRes, forecastRes, airRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, appid: API_KEY, units: 'metric' },
      }),
      axios.get(`${BASE_URL}/forecast`, {
        params: { lat, lon, appid: API_KEY, units: 'metric' },
      }),
      axios.get(`${BASE_URL}/air_pollution`, {
        params: { lat, lon, appid: API_KEY },
      }),
    ]);

    const current = currentRes.data;
    const forecast = forecastRes.data;
    const air = airRes.data;

    // Process hourly (next 24h = 8 items at 3h intervals)
    const hourly: HourlyForecast[] = forecast.list.slice(0, 24).map((item: {
      dt: number;
      main: { temp: number; feels_like: number; humidity: number };
      wind: { speed: number };
      weather: Array<{ main: string; description: string; icon: string }>;
      pop?: number;
    }) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: item.pop || 0,
    }));

    // Process daily (group 3h intervals by day)
    const dailyMap = new Map<string, typeof forecast.list>();
    forecast.list.forEach((item: { dt: number; main: { temp_min: number; temp_max: number; humidity: number }; wind: { speed: number }; weather: Array<{ main: string; description: string; icon: string }>; pop?: number }) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date)!.push(item);
    });

    const daily: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 7).map(([_, items]) => {
      const avgItem = items[Math.floor(items.length / 2)];
      const temps = items.map((i: { main: { temp_min: number; temp_max: number } }) => ({ min: i.main.temp_min, max: i.main.temp_max }));
      return {
        dt: avgItem.dt,
        tempMin: Math.round(Math.min(...temps.map((t: { min: number }) => t.min))),
        tempMax: Math.round(Math.max(...temps.map((t: { max: number }) => t.max))),
        humidity: Math.round(items.reduce((acc: number, i: { main: { humidity: number } }) => acc + i.main.humidity, 0) / items.length),
        windSpeed: avgItem.wind.speed,
        condition: avgItem.weather[0].main,
        description: avgItem.weather[0].description,
        icon: avgItem.weather[0].icon,
        pop: Math.max(...items.map((i: { pop?: number }) => i.pop || 0)),
        sunrise: current.sys.sunrise,
        sunset: current.sys.sunset,
        uvIndex: 0, // Would need OneCall API for UV
      };
    });

    const airComponent = air.list[0].components;
    const airQuality: AirQuality = {
      aqi: air.list[0].main.aqi,
      co: airComponent.co,
      no2: airComponent.no2,
      o3: airComponent.o3,
      pm2_5: airComponent.pm2_5,
      pm10: airComponent.pm10,
    };

    return {
      city: current.name,
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempMin: Math.round(current.main.temp_min),
      tempMax: Math.round(current.main.temp_max),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      visibility: current.visibility,
      windSpeed: current.wind.speed,
      windDeg: current.wind.deg || 0,
      windGust: current.wind.gust,
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      cloudiness: current.clouds.all,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      timezone: current.timezone,
      uvIndex: 0,
      dewPoint: Math.round(current.main.temp - ((100 - current.main.humidity) / 5)),
      hourly,
      daily,
      airQuality,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Failed to fetch weather data. Please check your API key or try again.');
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  if (API_KEY === 'demo') {
    return generateDemoData(city, 'US', 40.7128, -74.006);
  }
  try {
    const geoRes = await axios.get(`${GEO_URL}/direct`, {
      params: { q: city, limit: 1, appid: API_KEY },
    });
    if (!geoRes.data.length) throw new Error('City not found');
    const { lat, lon } = geoRes.data[0];
    return getWeatherByCoords(lat, lon);
  } catch (error) {
    throw new Error('City not found. Please try another city name.');
  }
}

export function getWeatherByGeolocation(): Promise<WeatherData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoords(position.coords.latitude, position.coords.longitude);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      () => reject(new Error('Unable to retrieve your location'))
    );
  });
}
