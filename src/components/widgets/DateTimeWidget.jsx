import React, { useState, useEffect } from 'react';
import AlignmentPicker from '../ui/AlignmentPicker';
import Switch from '../ui/Switch';

export default function DateTimeWidget({ settings = {} }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeZone = (settings.timeZone && settings.timeZone !== 'auto') 
    ? settings.timeZone 
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: settings.hour12 !== false,
    timeZone: timeZone,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: settings.showWeekday !== false ? 'long' : undefined,
    month: 'long',
    day: 'numeric',
    timeZone: timeZone,
  });

  // Get timezone abbreviation
  const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    timeZone: timeZone,
  });
  const timeZoneName = timeZoneFormatter.formatToParts(time).find(part => part.type === 'timeZoneName')?.value || '';

  const horizontalAlign = settings.horizontalAlign || 'center';
  const textAlignClass = horizontalAlign === 'left' ? 'text-left' : 
                         horizontalAlign === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={textAlignClass}>
      {settings.showTimeZone && timeZoneName && (
        <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
          {timeZoneName}
        </div>
      )}
      <div className="text-4xl font-bold dark:text-white mb-2 opacity-80">
        {timeFormatter.format(time)}
      </div>
      <div className="text-md text-neutral-600 dark:text-neutral-400">
        {dateFormatter.format(time)}
      </div>
    </div>
  );
}

const commonTimeZones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Phoenix', label: 'Phoenix (MST)' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
  { value: 'America/Honolulu', label: 'Honolulu (HST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
];

DateTimeWidget.Settings = function DateTimeSettings({ settings = {}, onSettingsChange, onRemove }) {
  const currentTimeZone = (settings.timeZone && settings.timeZone !== 'auto') 
    ? settings.timeZone 
    : Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [customTimeZone, setCustomTimeZone] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

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
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Location / Timezone
          </label>
          <select
            value={showCustomInput ? 'custom' : currentTimeZone}
            onChange={(e) => handleTimeZoneChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
              bg-white dark:bg-neutral-800
              text-black dark:text-white
              text-sm"
          >
            {commonTimeZones.map(tz => (
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
                  text-black dark:text-white
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
                  bg-white dark:bg-neutral-800 text-black dark:text-white text-sm font-medium
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
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
            checked={settings.hour12 !== false}
            onChange={(checked) => onSettingsChange({ ...settings, hour12: checked })}
            label="12-hour format"
          />
        </div>
        <div>
          <Switch
            checked={settings.showWeekday !== false}
            onChange={(checked) => onSettingsChange({ ...settings, showWeekday: checked })}
            label="Show weekday"
          />
        </div>
        <div>
          <Switch
            checked={settings.showTimeZone || false}
            onChange={(checked) => onSettingsChange({ ...settings, showTimeZone: checked })}
            label="Show timezone name"
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

