import React, { useState, useEffect } from 'react';

const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('weatherData');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < 30 * 60 * 1000) { // Less than 30 minutes old
            setWeather(data);
            setLoading(false);
            return;
          }
        }

        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
          console.log('Fetching weather data...', );
        });

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=imperial&appid=21ac4993fc8d0737d072d62da5dec638`
        );
        const data = await response.json();
        
        // Cache the new data
        localStorage.setItem('weatherData', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="mb-4 flex items-center justify-center gap-3">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-neutral-600 dark:text-neutral-400">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      {weather.weather[0]?.icon && (
        <img 
          src={getWeatherIcon(weather.weather[0].icon)} 
          alt={weather.weather[0].description}
          className="w-16 h-16"
        />
      )}
      <div className="flex flex-col">
        <div className="text-3xl font-bold dark:text-white">
          {Math.round(weather.main.temp)}°F
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <a 
            href={`https://openweathermap.org/city/${weather.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {weather.name}
          </a>
        </div>
      </div>
    </div>
  );
}
