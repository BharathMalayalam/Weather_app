// Weather API Types
export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  condition: string;
  description: string;
  icon: string;
  cloudiness: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  uvIndex: number;
  dewPoint: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  pop: number;
  sunrise: number;
  sunset: number;
  uvIndex: number;
}

export interface AirQuality {
  aqi: number; // 1-5 scale
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
}

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type ThemeMode = 'auto' | 'dark' | 'light';
export type ActiveTab = 'today' | 'hourly' | 'week';
