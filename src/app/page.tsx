// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import axios from 'axios';

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
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      const data = response.data;
      setWeatherData({
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        icon: data.weather[0].icon
      });
    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // Fetch weather for a default city on component mount
  useEffect(() => {
    fetchWeather('London');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather App</h1>
          <p className="text-blue-100">Get current weather information for any city</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Weather Card */}
        {weatherData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Main Weather Info */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {weatherData.name}, {weatherData.country}
                </h2>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
                  alt={weatherData.description}
                  className="w-24 h-24"
                />
                <div className="ml-4">
                  <div className="text-5xl font-bold text-gray-800">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-gray-600 capitalize text-lg">
                    {weatherData.description}
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600">
                Feels like {weatherData.feelsLike}°C
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Thermometer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Feels Like</div>
                <div className="text-xl font-semibold text-gray-800">
                  {weatherData.feelsLike}°C
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Humidity</div>
                <div className="text-xl font-semibold text-gray-800">
                  {weatherData.humidity}%
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Wind className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Wind Speed</div>
                <div className="text-xl font-semibold text-gray-800">
                  {weatherData.windSpeed} m/s
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Visibility</div>
                <div className="text-xl font-semibold text-gray-800">
                  {weatherData.visibility} km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-blue-100">
          <p>Built with Next.js, TypeScript, and OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  );
}