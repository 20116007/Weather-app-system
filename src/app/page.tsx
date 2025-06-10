'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Navigation, Sun, Cloud, CloudRain, CloudSnow, Zap, Calendar, Clock, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import UserHeader from '../../components/UserHeader';

interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  icon: string;
  main: string;
  lat: number;
  lon: number;
}

interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  main: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  icon: string;
  main: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { icon: string; main: string; description: string }[];
  wind: { speed: number };
}

interface DailyData {
  date: string;
  temps: number[];
  weather: { icon: string; main: string; description: string };
  humidity: number;
  windSpeed: number;
}

// 3D Weather Icon Component
const WeatherIcon3D = ({ weatherMain, size = 'large' }: { weatherMain: string; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClass = {
    small: 'w-6 h-6 sm:w-8 sm:h-8',
    medium: 'w-12 h-12 sm:w-16 sm:h-16',
    large: 'w-24 h-24 sm:w-32 sm:h-32'
  }[size];
  
  const animationClass = 'animate-bounce';
  
  const getWeatherIcon = () => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun className={`${sizeClass} text-yellow-400 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '3s' }} />;
      case 'clouds':
        return <Cloud className={`${sizeClass} text-gray-300 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '4s' }} />;
      case 'rain':
        return <CloudRain className={`${sizeClass} text-blue-400 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '2s' }} />;
      case 'snow':
        return <CloudSnow className={`${sizeClass} text-blue-200 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '3.5s' }} />;
      case 'thunderstorm':
        return <Zap className={`${sizeClass} text-purple-400 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '1.5s' }} />;
      default:
        return <Sun className={`${sizeClass} text-yellow-400 ${animationClass} drop-shadow-2xl`} style={{ animationDuration: '3s' }} />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl"></div>
      {getWeatherIcon()}
    </div>
  );
};

// Floating Particle Background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Navigation Tabs Component
const TabNavigation = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'current', label: 'Current', icon: Sun },
    { id: 'hourly', label: 'Hourly', icon: Clock },
    { id: 'daily', label: '7-Day', icon: Calendar },
    { id: 'map', label: 'Map', icon: Map }
  ];

  return (
    <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
      <div className="bg-purple-900/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Hourly Forecast Component
const HourlyForecast = ({ forecast }: { forecast: HourlyForecast[] }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const itemsToShow = 3;

  const nextSlide = () => {
    setScrollIndex((prev) => (prev + 1) % Math.max(1, forecast.length - itemsToShow + 1));
  };

  const prevSlide = () => {
    setScrollIndex((prev) => (prev - 1 + Math.max(1, forecast.length - itemsToShow + 1)) % Math.max(1, forecast.length - itemsToShow + 1));
  };

  return (
    <div className="relative bg-purple-900/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white">24-Hour Forecast</h3>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        {forecast.slice(scrollIndex, scrollIndex + itemsToShow).map((hour, index) => (
          <div
            key={index}
            className="bg-purple-900/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <div className="text-white/70 text-xs sm:text-sm mb-2">{hour.time}</div>
            <div className="flex justify-center mb-2 sm:mb-3">
              <WeatherIcon3D weatherMain={hour.main} size="small" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">{hour.temp}°</div>
            <div className="text-white/60 text-xs capitalize">{hour.description}</div>
            <div className="text-white/50 text-xs mt-2">
              <div>💧 {hour.humidity}%</div>
              <div>💨 {hour.windSpeed}m/s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Daily Forecast Component
const DailyForecast = ({ forecast }: { forecast: DailyForecast[] }) => {
  return (
    <div className="bg-purple-900/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">7-Day Forecast</h3>
      
      <div className="space-y-3 sm:space-y-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-purple-900/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between hover:scale-[1.02] transition-all duration-300 border border-white/20"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <WeatherIcon3D weatherMain={day.main} size="medium" />
              <div>
                <div className="text-white font-semibold text-base sm:text-lg">{day.date}</div>
                <div className="text-white/70 capitalize text-sm sm:text-base">{day.description}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-8 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-center">
                <div className="text-white/60 text-xs sm:text-sm">High</div>
                <div className="text-white font-bold text-lg sm:text-xl">{day.tempMax}°</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs sm:text-sm">Low</div>
                <div className="text-white/70 font-semibold text-base sm:text-lg">{day.tempMin}°</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs sm:text-sm">Humidity</div>
                <div className="text-white/70 text-xs sm:text-sm">{day.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-white/60 text-xs sm:text-sm">Wind</div>
                <div className="text-white/70 text-xs sm:text-sm">{day.windSpeed}m/s</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Weather Map Component - Updated for better mobile view
const WeatherMap = ({ lat, lon, city }: { lat: number; lon: number; city: string }) => {
  const [mapLayer, setMapLayer] = useState('temp');
  
  const mapLayers = [
    { id: 'temp', label: 'Temperature', color: 'from-blue-500 to-red-500' },
    { id: 'precipitation', label: 'Precipitation', color: 'from-green-500 to-blue-500' },
    { id: 'pressure', label: 'Pressure', color: 'from-purple-500 to-pink-500' },
    { id: 'wind', label: 'Wind', color: 'from-teal-500 to-cyan-500' }
  ];

  return (
    <div className="bg-purple-900/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Map Controls */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Weather Map</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:flex-wrap">
            {mapLayers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setMapLayer(layer.id)}
                className={`w-full sm:w-auto p-2 sm:p-3 rounded-xl text-left transition-all duration-300 text-sm sm:text-base ${
                  mapLayer === layer.id
                    ? `bg-gradient-to-r ${layer.color} text-white shadow-lg`
                    : 'bg-purple-900/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-900/10 rounded-xl border border-white/20">
            <h4 className="text-white font-semibold text-base sm:text-lg mb-2">Location</h4>
            <p className="text-white/70 text-xs sm:text-sm">{city}</p>
            <p className="text-white/60 text-xs mt-1">
              Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
            </p>
          </div>
        </div>
        
        {/* Map Display - Updated for mobile */}
        <div>
          <div className="relative bg-white/5 rounded-2xl border border-white/20 h-[300px] sm:h-[500px] w-full overflow-hidden">
            <iframe
              src={`https://openweathermap.org/weathermap?basemap=map&cities=false&layer=${mapLayer}&lat=${lat}&lon=${lon}&zoom=8`}
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              style={{ border: 'none' }}
              title="Weather Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/50 backdrop-blur-md rounded-lg p-2 sm:p-3">
              <div className="text-white text-xs sm:text-sm font-medium">
                {mapLayers.find(l => l.id === mapLayer)?.label} Layer
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-white/50 text-center">
            <p>Scroll and zoom on the map to explore weather patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchAllWeatherData = async (cityName: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    
    try {
      let currentWeatherUrl;
      let forecastUrl;
      
      if (lat && lon) {
        currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      } else {
        currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
      }

      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl)
      ]);
      
      const currentData = currentResponse.data;
      const forecastData = forecastResponse.data;
      
      setWeatherData({
        name: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        visibility: currentData.visibility / 1000,
        pressure: currentData.main.pressure,
        feelsLike: Math.round(currentData.main.feels_like),
        icon: currentData.weather[0].icon,
        main: currentData.weather[0].main,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      });

      const hourlyData = forecastData.list.slice(0, 8).map((item: ForecastItem) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        main: item.weather[0].main,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed
      }));
      setHourlyForecast(hourlyData);

      const dailyData: { [key: string]: DailyData } = {};
      forecastData.list.forEach((item: ForecastItem) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }),
            temps: [],
            weather: item.weather[0],
            humidity: item.main.humidity,
            windSpeed: item.wind.speed
          };
        }
        dailyData[date].temps.push(item.main.temp);
      });

      const processedDailyData = Object.values(dailyData).slice(0, 7).map((day: DailyData) => ({
        date: day.date,
        tempMax: Math.round(Math.max(...day.temps)),
        tempMin: Math.round(Math.min(...day.temps)),
        icon: day.weather.icon,
        main: day.weather.main,
        description: day.weather.description,
        humidity: day.humidity,
        windSpeed: day.windSpeed
      }));
      setDailyForecast(processedDailyData);

    } catch {
      setError('Unable to fetch weather data. Please try again.');
      setWeatherData(null);
      setHourlyForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    await fetchAllWeatherData(cityName);
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLocationLoading(true);
    setError('');
    
    try {
      await fetchAllWeatherData('', lat, lon);
      if (weatherData) {
        setCity(weatherData.name);
      }
    } catch {
      setError('Unable to fetch weather for your location.');
    } finally {
      setLocationLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        setError('Unable to retrieve your location. Please allow location access.');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  useEffect(() => {
    fetchWeather('London');
  }, [fetchWeather]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <FloatingParticles />
      
      {/* User Header Component */}
      <UserHeader />
      
      <div className="relative z-10 min-h-screen p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 pt-6 sm:pt-8">
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
                Weather Universe
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl rounded-full"></div>
            </div>
            <p className="text-base sm:text-xl text-blue-100/80 font-light">Complete weather forecast with interactive maps</p>
          </div>

          {/* Enhanced Search Form */}
          <form onSubmit={handleSubmit} className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-sm"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                  <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 sm:w-6 sm:h-6" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-2xl text-base sm:text-lg"
                  />
                </div>
              </div>
              {/* Location Button */}
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="relative group px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl font-semibold text-white shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Navigation className={`w-5 h-5 sm:w-6 sm:h-6 ${locationLoading ? 'animate-spin' : ''}`} />
                </div>
              </button>
              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative group px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl font-semibold text-white shadow-2xl hover:shadow-pink-500/25 focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">
                  {loading ? 'Searching...' : 'Search'}
                </span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-100 rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                  <span className="text-sm sm:text-base">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          {weatherData && <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />}

          {/* Content Based on Active Tab */}
          {weatherData && (
            <div className="mb-8 sm:mb-12">
              {activeTab === 'current' && (
                <div className="relative">
                  {/* Current Weather Card */}
                  <div className="relative bg-purple-900/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl"></div>
                    {/* Main Weather Info */}
                    <div className="relative text-center mb-8 sm:mb-12">
                      <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 mr-2 sm:mr-3" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          {weatherData.name}, {weatherData.country}
                        </h2>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
                        <div className="mb-4 sm:mb-0 sm:mr-6 sm:mr-8">
                          <WeatherIcon3D weatherMain={weatherData.main} size="large" />
                        </div>
                        <div className="text-left">
                          <div className="text-5xl sm:text-7xl font-bold text-white drop-shadow-2xl mb-2">
                            {weatherData.temperature}°
                          </div>
                          <div className="text-white/80 capitalize text-lg sm:text-2xl font-light">
                            {weatherData.description}
                          </div>
                          <div className="text-white/60 text-base sm:text-lg mt-2">
                            Feels like {weatherData.feelsLike}°C
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Weather Details Grid */}
                    <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
                      {[
                        { icon: Thermometer, label: 'Feels Like', value: `${weatherData.feelsLike}°C`, color: 'from-orange-500 to-red-500' },
                        { icon: Droplets, label: 'Humidity', value: `${weatherData.humidity}%`, color: 'from-blue-500 to-cyan-500' },
                        { icon: Wind, label: 'Wind Speed', value: `${weatherData.windSpeed} m/s`, color: 'from-green-500 to-teal-500' },
                        { icon: Eye, label: 'Visibility', value: `${weatherData.visibility} km`, color: 'from-purple-500 to-pink-500' }
                      ].map((item, index) => (
                        <div key={index} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                          <div className="relative bg-purple-900/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-lg`}>
                              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="text-xs sm:text-sm text-white/70 mb-2 font-medium">{item.label}</div>
                            <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hourly' && (
                <HourlyForecast forecast={hourlyForecast} />
              )}

              {activeTab === 'daily' && (
                <DailyForecast forecast={dailyForecast} />
              )}

              {activeTab === 'map' && (
                <WeatherMap lat={weatherData.lat} lon={weatherData.lon} city={`${weatherData.name}, ${weatherData.country}`} />
              )}
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="text-center text-white/60 pb-6 sm:pb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl rounded-full"></div>
              <p className="relative text-sm sm:text-lg font-light">
                Advanced Weather App with Forecasts & Maps • Built with Next.js & OpenWeatherMap
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}