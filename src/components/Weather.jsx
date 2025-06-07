import React, { useState, useEffect } from 'react';

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

  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  const weatherInfo = loading ? (
    <span className="inline-flex items-center">
      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      checking weather...
    </span>
  ) : error || !weather ? (
    null
  ) : (
    <span>It's <b className="dark:text-white">{Math.round(weather.main.temp)}°F</b> outside in <a href={`https://openweathermap.org/city/${weather.id}`} target="_blank" className="dark:text-blue-400 font-bold">{weather.name}</a>.</span>
  );

  return (
    <h2 className="dark:text-white/50">
      It's currently <b className="dark:text-white">{formatter.format(now)}</b>.{' '}
      {weatherInfo}
    </h2>
  );
}
