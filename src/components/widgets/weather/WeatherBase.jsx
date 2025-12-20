import React, { useEffect, useState } from 'react';
import AlignmentPicker from '../../ui/AlignmentPicker';
import SegmentedControl from '../../ui/SegmentedControl';
import Switch from '../../ui/Switch';
import { fetchWeatherData } from './weatherUtils';

export function useWeatherData({ settings = {}, forecastDays = 0 }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const location = (settings.location && settings.location !== 'auto') ? settings.location : '';
  const showForecast = forecastDays > 0 && forecast && forecast.length > 0;

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { current, forecast: nextForecast } = await fetchWeatherData({ location, forecastDays });
        setWeather(current);
        setForecast(nextForecast);
        setError(false);
      } catch (e) {
        console.error('Error fetching weather:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [location, forecastDays]);

  const horizontalAlign = settings.horizontalAlign || 'center';
  const justifyClass = horizontalAlign === 'left' ? 'justify-start' :
    horizontalAlign === 'right' ? 'justify-end' : 'justify-center';
  const itemsAlignClass = horizontalAlign === 'left' ? 'items-start' :
    horizontalAlign === 'right' ? 'items-end' : 'items-center';
  const textAlignClass = horizontalAlign === 'left' ? 'text-left' :
    horizontalAlign === 'right' ? 'text-right' : 'text-center';

  return {
    weather,
    forecast,
    loading,
    error,
    location,
    justifyClass,
    itemsAlignClass,
    textAlignClass,
    showForecast,
  };
}

export function WeatherSettingsBase({
  settings = {},
  onSettingsChange,
  onRemove,
  forecastLabel = null,
  showForecastPicker = false,
}) {
  const effectiveLocation = (settings.location && settings.location !== 'auto') ? settings.location : '';
  const [locationInput, setLocationInput] = useState(effectiveLocation);
  const [useCurrentLocation, setUseCurrentLocation] = useState(!effectiveLocation);

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
        {showForecastPicker && (
          <div>
            <label className="block text-sm font-medium mb-3 text-primary">
              Forecast
            </label>
            <SegmentedControl
              options={[
                { id: 'today', label: 'Today' },
                { id: '3day', label: '3 Day' },
                { id: '5day', label: '5 Day' },
              ]}
              value={settings.forecastMode || 'today'}
              onChange={(value) => {
                // Normalize away legacy `forecastDays` if present
                const { forecastDays: _omit, ...rest } = (settings || {});
                onSettingsChange({ ...rest, forecastMode: value });
              }}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
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
                className="form-input"
              />
            )}
            {!useCurrentLocation && (
              <p className="text-xs text-secondary">
                Enter a city name (e.g., "New York", "London, UK", "Tokyo, Japan")
              </p>
            )}
            {forecastLabel && (
              <p className="text-xs text-secondary">
                {forecastLabel}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
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
}


