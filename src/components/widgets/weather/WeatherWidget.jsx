import React from 'react';
import { WeatherSettingsBase, useWeatherData } from './WeatherBase';
import { getDayName, getWeatherIcon } from './weatherUtils';

export default function WeatherWidget({ settings = {} }) {
  const mode = settings.forecastMode || 'today';
  const forecastDays = mode === '3day' ? 3 : mode === '5day' ? 5 : 0;

  const { weather, forecast, loading, error, location, justifyClass, showForecast } = useWeatherData({
    settings,
    forecastDays,
  });
  const { itemsAlignClass, textAlignClass } = useWeatherData({ settings, forecastDays });

  if (loading) {
    return (
      <div className={`flex items-center ${justifyClass} gap-3`}>
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-secondary">Loading weather...</span>
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

  if (!weather) return null;

  const highTemp = Math.round(weather.main?.temp_max ?? weather.main?.temp ?? 0);
  const lowTemp = Math.round(weather.main?.temp_min ?? weather.main?.temp ?? 0);
  const currentCondition = weather.weather?.[0]?.description || '';

  // Today layout (current-only)
  if (mode === 'today') {
    return (
      <div className={`flex flex-col ${itemsAlignClass} ${textAlignClass} w-full min-w-0 gap-1.5`}>
        <div className="text-xs @sm/weather:text-sm text-secondary truncate max-w-full">
          <a
            href={`https://openweathermap.org/city/${weather.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {weather.name}
          </a>
        </div>

        <div className="text-md text-primary text-2xl @sm/weather:text-3xl leading-tight">
          {Math.round(weather.main.temp)}°F
        </div>

        {(weather.weather?.[0]?.icon || currentCondition) && (
          <div className={`flex items-center gap-2 min-w-0 w-full ${justifyClass}`}>
            {weather.weather?.[0]?.icon && (
              <img
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={currentCondition}
                className="w-6 h-6 @sm/weather:w-8 @sm/weather:h-8"
              />
            )}
            {currentCondition && (
              <div className="text-xs @sm/weather:text-sm text-secondary truncate capitalize">
                {currentCondition}
              </div>
            )}
          </div>
        )}

        <div className={`flex items-center gap-2 text-xs @sm/weather:text-sm text-nowrap w-full ${justifyClass}`}>
          <span className="text-primary font-semibold">
            H {highTemp}°
          </span>
          <span className="text-secondary">
            L {lowTemp}°
          </span>
        </div>
      </div>
    );
  }

  // 3-day / 5-day layout: current + forecast
  return (
    <div
      className={[
        'flex h-full w-full min-w-0 gap-3',
        `flex-col ${itemsAlignClass} ${textAlignClass} @sm/weather:flex-row @sm/weather:items-center`,
      ].join(' ')}
    >
      <div className={`flex items-center gap-3 w-full @sm/weather:w-auto @sm/weather:flex-shrink-0 ${justifyClass}`}>
        <div className="flex items-center gap-2 min-w-0">
          {weather.weather?.[0]?.icon && (
            <img
              src={getWeatherIcon(weather.weather[0].icon)}
              alt={currentCondition}
              className="w-16 h-16"
            />
          )}
          {currentCondition && (
            <div className="text-xs text-secondary truncate capitalize max-w-32">
              {currentCondition}
            </div>
          )}
        </div>
        <div className={`flex flex-col min-w-0 ${textAlignClass}`}>
          <div className="text-3xl font-bold text-primary">
            {Math.round(weather.main.temp)}°F
          </div>
          <div className="text-sm text-secondary truncate">
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

      {showForecast && (
        <div
          className={[
            'flex flex-row gap-2 pl-0 @sm/weather:pl-3',
            'overflow-x-auto min-w-0 w-full @sm/weather:flex-1',
            '@lg/weather:flex-wrap @lg/weather:overflow-visible',
            justifyClass,
          ].join(' ')}
        >
          {forecast.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 px-4 py-1 border-l border-neutral-300 dark:border-neutral-400/30 flex-shrink-0 w-20"
            >
              <div className="text-xs text-secondary">
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
              <div className="text-xs text-secondary">
                {day.low}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

WeatherWidget.Settings = function WeatherSettings(props) {
  return <WeatherSettingsBase {...props} showForecastPicker />;
};

