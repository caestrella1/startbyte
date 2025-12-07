import React, { useState, useEffect } from 'react';

export default function DateTimeWidget({ settings = {} }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: settings.hour12 !== false,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: settings.showWeekday !== false ? 'long' : undefined,
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="text-6xl font-bold dark:text-white mb-2 opacity-80">
        {timeFormatter.format(time)}
      </div>
      <div className="text-lg text-neutral-600 dark:text-neutral-400">
        {dateFormatter.format(time)}
      </div>
    </div>
  );
}

DateTimeWidget.Settings = function DateTimeSettings({ settings = {}, onSettingsChange, onRemove }) {
  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Date & Time Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.hour12 !== false}
              onChange={(e) => onSettingsChange({ ...settings, hour12: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">12-hour format</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showWeekday !== false}
              onChange={(e) => onSettingsChange({ ...settings, showWeekday: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show weekday</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showBackground !== false}
              onChange={(e) => onSettingsChange({ ...settings, showBackground: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show background</span>
          </label>
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

