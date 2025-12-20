export function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function groupForecastByDay(list = []) {
  const grouped = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayDate = new Date(date);
    dayDate.setHours(0, 0, 0, 0);
    const dayKey = dayDate.toDateString();

    // Skip today's data (we already have current weather)
    if (dayDate.getTime() === today.getTime()) return;

    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        date: dayDate,
        temps: [],
        icons: [],
        descriptions: [],
      };
    }

    grouped[dayKey].temps.push(item.main.temp);
    if (item.weather?.[0]) {
      grouped[dayKey].icons.push(item.weather[0].icon);
      grouped[dayKey].descriptions.push(item.weather[0].description);
    }
  });

  // Calculate daily highs/lows and pick representative icon (middle of day)
  Object.keys(grouped).forEach((dayKey) => {
    const day = grouped[dayKey];
    day.high = Math.round(Math.max(...day.temps));
    day.low = Math.round(Math.min(...day.temps));
    const midIndex = Math.floor(day.icons.length / 2);
    day.icon = day.icons[midIndex] || day.icons[0];
    day.description = day.descriptions[midIndex] || day.descriptions[0];
  });

  return grouped;
}

export function getDayName(date) {
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
}

function restoreForecastDates(forecastData) {
  if (!forecastData) return null;
  return forecastData.map((day) => ({
    ...day,
    date: day.date ? new Date(day.date) : new Date(),
  }));
}

// NOTE: this keeps the existing behavior/key as-is. Consider moving the API key to env later.
const OPEN_WEATHER_APP_ID = '21ac4993fc8d0737d072d62da5dec638';

export async function fetchWeatherData({ location = '', forecastDays = 0 }) {
  const loc = location?.trim() || '';
  const cacheKey = `weatherData_${loc || 'geolocation'}_${forecastDays}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { current, forecastData, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    if (age < 30 * 60 * 1000) {
      return {
        current,
        forecast: restoreForecastDates(forecastData),
        fromCache: true,
      };
    }
  }

  let currentUrl;
  let forecastUrl;

  if (loc) {
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(loc)}&units=imperial&appid=${OPEN_WEATHER_APP_ID}`;
    if (forecastDays > 0) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(loc)}&units=imperial&appid=${OPEN_WEATHER_APP_ID}`;
    }
  } else {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=imperial&appid=${OPEN_WEATHER_APP_ID}`;
    if (forecastDays > 0) {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=imperial&appid=${OPEN_WEATHER_APP_ID}`;
    }
  }

  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(currentUrl),
    forecastDays > 0 ? fetch(forecastUrl) : Promise.resolve(null),
  ]);

  if (!currentResponse.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const current = await currentResponse.json();

  let forecast = null;
  if (forecastResponse && forecastResponse.ok) {
    const forecastResult = await forecastResponse.json();
    const grouped = groupForecastByDay(forecastResult.list);
    const sortedDays = Object.keys(grouped).sort((a, b) => grouped[a].date - grouped[b].date);
    const daysToShow = Math.min(forecastDays, sortedDays.length);
    forecast = sortedDays.slice(0, daysToShow).map((dayKey) => grouped[dayKey]);
  }

  localStorage.setItem(cacheKey, JSON.stringify({
    current,
    forecastData: forecast,
    timestamp: Date.now(),
  }));

  return { current, forecast, fromCache: false };
}


