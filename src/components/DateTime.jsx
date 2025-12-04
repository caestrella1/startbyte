import React, { useState, useEffect } from 'react';

export default function DateTime() {
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
    hour12: true
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-4">
      <div className="text-6xl font-bold dark:text-white mb-2">
        {timeFormatter.format(time)}
      </div>
      <div className="text-lg text-neutral-600 dark:text-neutral-400">
        {dateFormatter.format(time)}
      </div>
    </div>
  );
}

