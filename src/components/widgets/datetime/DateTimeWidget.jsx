import React, { useState, useEffect } from 'react';
import AlignmentPicker from '../../ui/AlignmentPicker';
import Switch from '../../ui/Switch';
import SegmentedControl from '../../ui/SegmentedControl';
import {
  COMMON_TIME_ZONES,
  resolveTimeZone,
  getTimeFormatter,
  getDateFormatter,
  formatCustomDate,
} from './dateTimeUtils';

export default function DateTimeWidget({ settings = {} }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeZone = resolveTimeZone(settings);

  // Date/time format options
  const dateTimeFormat = settings.dateTimeFormat || 'medium';
  const customDateFormat = settings.customDateFormat || '';
  const customTimeFormat = settings.customTimeFormat || '';
  const timeFormatter = dateTimeFormat === 'custom' && customTimeFormat
    ? null
    : getTimeFormatter({ format: dateTimeFormat, timeZone });

  const dateFormatter = dateTimeFormat === 'custom' && customDateFormat
    ? null
    : getDateFormatter({ format: dateTimeFormat, timeZone });

  const horizontalAlign = settings.horizontalAlign || 'center';
  const textAlignClass = horizontalAlign === 'left' ? 'text-left' : 
                         horizontalAlign === 'right' ? 'text-right' : 'text-center';

  const displayTime = dateTimeFormat === 'custom' && customTimeFormat
    ? formatCustomDate({ date: time, formatString: customTimeFormat, timeZone })
    : timeFormatter?.format(time) || '';
    
  const displayDate = dateTimeFormat === 'custom' && customDateFormat
    ? formatCustomDate({ date: time, formatString: customDateFormat, timeZone })
    : dateFormatter?.format(time) || '';

  return (
    <div className={textAlignClass}>
      {/* Example: Time text size adjusts based on container width */}
      {displayTime && (
        <div className="text-md @sm/datetime:text-2xl @lg/datetime:text-4xl font-bold mb-2 text-primary">
          {displayTime}
        </div>
      )}
      {displayDate && (
        <div className="text-xs @sm/datetime:text-sm @lg/datetime:text-base text-secondary">
          {displayDate}
        </div>
      )}
    </div>
  );
}

DateTimeWidget.Settings = function DateTimeSettings({ settings = {}, onSettingsChange, onRemove }) {
  const currentTimeZone = resolveTimeZone(settings);
  const [customTimeZone, setCustomTimeZone] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDateFormat, setCustomDateFormat] = useState(settings.customDateFormat || '');
  const [customTimeFormat, setCustomTimeFormat] = useState(settings.customTimeFormat || '');

  const handleTimeZoneChange = (value) => {
    if (value === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onSettingsChange({ ...settings, timeZone: value });
    }
  };

  const handleCustomTimeZoneSubmit = () => {
    if (customTimeZone.trim()) {
      try {
        // Validate timezone
        Intl.DateTimeFormat(undefined, { timeZone: customTimeZone.trim() });
        onSettingsChange({ ...settings, timeZone: customTimeZone.trim() });
        setShowCustomInput(false);
        setCustomTimeZone('');
      } catch (e) {
        alert('Invalid timezone. Please enter a valid IANA timezone (e.g., America/New_York)');
      }
    }
  };

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Date & Time Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
            Location / Timezone
          </label>
          <select
            value={showCustomInput ? 'custom' : currentTimeZone}
            onChange={(e) => handleTimeZoneChange(e.target.value)}
            className="form-input--select"
          >
            {COMMON_TIME_ZONES.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
            <option value="custom">Custom timezone...</option>
          </select>
          {showCustomInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customTimeZone}
                onChange={(e) => setCustomTimeZone(e.target.value)}
                placeholder="e.g., America/New_York"
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-800
                  text-primary
                  text-sm font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomTimeZoneSubmit();
                  } else if (e.key === 'Escape') {
                    setShowCustomInput(false);
                    setCustomTimeZone('');
                  }
                }}
              />
              <button
                onClick={handleCustomTimeZoneSubmit}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium
                  hover:bg-blue-600 transition-colors"
              >
                Set
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTimeZone('');
                }}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-800 text-primary text-sm font-medium
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
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
          <label className="block text-sm font-medium mb-3 text-primary">
            Date/Time Format
          </label>
          <SegmentedControl
            options={[
              { id: 'short', label: 'Short' },
              { id: 'medium', label: 'Medium' },
              { id: 'long', label: 'Long' },
              { id: 'custom', label: 'Custom' },
            ]}
            value={settings.dateTimeFormat || 'medium'}
            onChange={(value) => {
              const newSettings = { ...settings, dateTimeFormat: value };
              if (value !== 'custom') {
                // Clear custom formats when switching away
                delete newSettings.customDateFormat;
                delete newSettings.customTimeFormat;
                setCustomDateFormat('');
                setCustomTimeFormat('');
              }
              onSettingsChange(newSettings);
            }}
          />
          {settings.dateTimeFormat === 'custom' && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-primary">
                  Date Format
                </label>
                <input
                  type="text"
                  value={customDateFormat}
                  onChange={(e) => {
                    setCustomDateFormat(e.target.value);
                    onSettingsChange({ 
                      ...settings, 
                      customDateFormat: e.target.value 
                    });
                  }}
                  placeholder="e.g., MMMM DD, YYYY"
                  className="form-input font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-primary">
                  Time Format
                </label>
                <input
                  type="text"
                  value={customTimeFormat}
                  onChange={(e) => {
                    setCustomTimeFormat(e.target.value);
                    onSettingsChange({ 
                      ...settings, 
                      customTimeFormat: e.target.value 
                    });
                  }}
                  placeholder="e.g., hh:mm A"
                  className="form-input font-mono text-sm"
                />
              </div>
              <div className="text-xs text-secondary">
                <p className="mb-1">Format tokens:</p>
                <p className="text-secondary mb-2">
                  <strong>Date:</strong> YYYY/YY (year), MMMM/MMM/MM/M (month), dddd/ddd (weekday), DD/D (day)
                </p>
                <p className="text-secondary mb-2">
                  <strong>Time:</strong> HH/H (24h), hh/h (12h), mm/m (minute), ss/s (second), A/a (AM/PM)
                </p>
                <p className="text-secondary">
                  See{' '}
                  <a 
                    href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    MDN documentation
                  </a>
                  {' '}for more formatting options.
                </p>
              </div>
            </div>
          )}
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

