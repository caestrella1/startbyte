import React, { useState, useEffect } from 'react';
import AlignmentPicker from '../ui/AlignmentPicker';
import SegmentedControl from '../ui/SegmentedControl';
import Switch from '../ui/Switch';

const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const groupForecastByDay = (list) => {
  const grouped = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayDate = new Date(date);
    dayDate.setHours(0, 0, 0, 0);
    const dayKey = dayDate.toDateString();
    
    // Skip today's data (we already have current weather)
    if (dayDate.getTime() === today.getTime()) {
      return;
    }
    
    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        date: dayDate,
        temps: [],
        icons: [],
        descriptions: []
      };
    }
    grouped[dayKey].temps.push(item.main.temp);
    if (item.weather[0]) {
      grouped[dayKey].icons.push(item.weather[0].icon);
      grouped[dayKey].descriptions.push(item.weather[0].description);
    }
  });
  
  // Calculate daily highs/lows and pick representative icon (middle of day)
  Object.keys(grouped).forEach(dayKey => {
    const day = grouped[dayKey];
    day.high = Math.round(Math.max(...day.temps));
    day.low = Math.round(Math.min(...day.temps));
    // Get icon from middle of the day (around noon)
    const midIndex = Math.floor(day.icons.length / 2);
    day.icon = day.icons[midIndex] || day.icons[0];
    day.description = day.descriptions[midIndex] || day.descriptions[0];
  });
  
  return grouped;
};

export default function WeatherWidget({ settings = {} }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [containerRef, setContainerRef] = useState(null);
  const [layout, setLayout] = useState('vertical'); // 'vertical' or 'horizontal'
  const location = (settings.location && settings.location !== 'auto') ? settings.location : '';
  const forecastDays = settings.forecastDays || 0; // 0 = current only, 3, 5, or 10
  const widgetHeight = settings.height || 1;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const cacheKey = `weatherData_${location || 'geolocation'}_${forecastDays}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { current, forecastData, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < 30 * 60 * 1000) {
            setWeather(current);
            // Convert date strings back to Date objects when loading from cache
            const restoredForecast = forecastData ? forecastData.map(day => ({
              ...day,
              date: day.date ? new Date(day.date) : new Date()
            })) : null;
            setForecast(restoredForecast);
            setLoading(false);
            return;
          }
        }

        let currentUrl;
        let forecastUrl;
        
        if (location && location.trim()) {
          // Use city name if location is provided
          currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location.trim())}&units=imperial&appid=21ac4993fc8d0737d072d62da5dec638`;
          if (forecastDays > 0) {
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location.trim())}&units=imperial&appid=21ac4993fc8d0737d072d62da5dec638`;
          }
        } else {
          // Fall back to geolocation
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=imperial&appid=21ac4993fc8d0737d072d62da5dec638`;
          if (forecastDays > 0) {
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=imperial&appid=21ac4993fc8d0737d072d62da5dec638`;
          }
        }

        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(currentUrl),
          forecastDays > 0 ? fetch(forecastUrl) : Promise.resolve(null)
        ]);

        if (!currentResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const currentData = await currentResponse.json();
        let forecastData = null;

        if (forecastResponse && forecastResponse.ok) {
          const forecastResult = await forecastResponse.json();
          // Group forecast by day and take first N days
          const grouped = groupForecastByDay(forecastResult.list);
          const sortedDays = Object.keys(grouped).sort((a, b) => 
            grouped[a].date - grouped[b].date
          );
          const daysToShow = Math.min(forecastDays, sortedDays.length);
          forecastData = sortedDays.slice(0, daysToShow).map(dayKey => grouped[dayKey]);
        }
        
        localStorage.setItem(cacheKey, JSON.stringify({
          current: currentData,
          forecastData,
          timestamp: Date.now()
        }));
        
        setWeather(currentData);
        setForecast(forecastData);
        setError(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, forecastDays]);

  // Determine layout based on widget height and container size
  useEffect(() => {
    if (forecastDays === 0 || !forecast || forecast.length === 0) {
      setLayout('vertical');
      return;
    }

    const updateLayout = () => {
      if (!containerRef) return;
      
      const containerWidth = containerRef.offsetWidth;
      
      // If widget is 2+ rows tall, use vertical layout (forecast below)
      if (widgetHeight >= 2) {
        setLayout('vertical');
      } else {
        // For single row, check if we have enough horizontal space
        // Current weather takes ~200px, each forecast day ~70px (including gap)
        const estimatedForecastWidth = forecast.length * 70;
        const availableWidth = containerWidth - 220; // Reserve space for current weather
        
        if (availableWidth >= estimatedForecastWidth) {
          setLayout('horizontal');
        } else {
          setLayout('horizontal-scroll');
        }
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [containerRef, widgetHeight, forecastDays, forecast]);

  const horizontalAlign = settings.horizontalAlign || 'center';
  const justifyClass = horizontalAlign === 'left' ? 'justify-start' : 
                       horizontalAlign === 'right' ? 'justify-end' : 'justify-center';

  if (loading) {
    return (
      <div className={`flex items-center ${justifyClass} gap-3`}>
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <span className="text-neutral-600 dark:text-neutral-400">Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center ${justifyClass} gap-3`}>
        <span className="text-sm text-red-600 dark:text-red-400">
          {location ? `Unable to find weather for "${location}"` : 'Unable to fetch weather'}
        </span>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const getDayName = (date) => {
    // Convert to Date object if it's a string (from localStorage)
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const compareDate = new Date(dateObj);
    compareDate.setHours(0, 0, 0, 0);
    
    if (compareDate.getTime() === today.getTime()) return 'Today';
    if (compareDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isVerticalLayout = layout === 'vertical';
  const isScrollable = layout === 'horizontal-scroll';

  return (
    <div 
      ref={setContainerRef}
      className={`flex ${isVerticalLayout ? 'flex-col' : 'flex-row items-center'} ${justifyClass} gap-3 h-full w-full min-w-0`}
    >
      {/* Current Weather */}
      <div className={`flex items-center ${justifyClass} gap-3 ${isVerticalLayout ? 'w-full' : 'flex-shrink-0'}`}>
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

      {/* Forecast */}
      {forecast && forecast.length > 0 && (
        <div 
          className={`flex flex-row gap-2 pl-3 ${isVerticalLayout ? `w-full flex-wrap ${justifyClass}` : isScrollable ? 'overflow-x-auto min-w-0 flex-1' : `flex-wrap min-w-0 ${justifyClass}`}`}
        >
          {forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1 px-4 py-1 border-l border-neutral-300 dark:border-neutral-400/30 flex-shrink-0 w-20">
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {getDayName(day.date)}
              </div>
              {day.icon && (
                <img 
                  src={getWeatherIcon(day.icon)} 
                  alt={day.description}
                  className="w-8 h-8"
                />
              )}
              <div className="text-xs font-semibold dark:text-white">
                {day.high}°
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {day.low}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

WeatherWidget.Settings = function WeatherSettings({ settings = {}, onSettingsChange, onRemove }) {
  const effectiveLocation = (settings.location && settings.location !== 'auto') ? settings.location : '';
  const [locationInput, setLocationInput] = useState(effectiveLocation);
  const [useCurrentLocation, setUseCurrentLocation] = useState(!effectiveLocation);

  const forecastOptions = [
    { id: '0', label: 'Current only' },
    { id: '3', label: '3 days' },
    { id: '5', label: '5 days' },
  ];

  const handleLocationChange = (value) => {
    setLocationInput(value);
    if (value.trim()) {
      setUseCurrentLocation(false);
      onSettingsChange({ ...settings, location: value.trim() });
    } else {
      setUseCurrentLocation(true);
      const { location: _, ...rest } = settings;
      onSettingsChange(rest);
    }
  };

  const handleUseCurrentLocation = (checked) => {
    setUseCurrentLocation(checked);
    if (checked) {
      setLocationInput('');
      const { location: _, ...rest } = settings;
      onSettingsChange(rest);
    }
  };

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Weather Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Location
          </label>
          <div className="space-y-2">
            <Switch
              checked={useCurrentLocation}
              onChange={handleUseCurrentLocation}
              label="Use current location"
            />
            {!useCurrentLocation && (
              <input
                type="text"
                value={locationInput}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="e.g., New York, London, Tokyo"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-800
                  text-black dark:text-white
                  text-sm"
              />
            )}
            {!useCurrentLocation && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enter a city name (e.g., "New York", "London, UK", "Tokyo, Japan")
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Forecast
          </label>
          <SegmentedControl
            options={forecastOptions}
            value={String(settings.forecastDays || 0)}
            onChange={(value) => onSettingsChange({ ...settings, forecastDays: parseInt(value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Alignment
          </label>
          <AlignmentPicker
            horizontalAlign={settings.horizontalAlign || 'center'}
            verticalAlign={settings.verticalAlign || 'center'}
            onChange={({ horizontalAlign, verticalAlign }) => 
              onSettingsChange({ ...settings, horizontalAlign, verticalAlign })
            }
          />
        </div>
        <div>
          <Switch
            checked={settings.showBackground !== false}
            onChange={(checked) => onSettingsChange({ ...settings, showBackground: checked })}
            label="Show background"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn-danger w-full mt-4"
          >
            Remove Widget
          </button>
        )}
      </div>
    </div>
  );
};

