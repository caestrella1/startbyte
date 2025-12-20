/**
 * Date/time formatting utilities shared by DateTime widgets/settings.
 *
 * Token-based custom formatting is intentionally lightweight and meant for a
 * small set of common tokens (not a full date-fns/moment replacement).
 */

export const COMMON_TIME_ZONES = [
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

export function resolveTimeZone(settings = {}) {
  return (settings.timeZone && settings.timeZone !== 'auto')
    ? settings.timeZone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimeFormatter({ format = 'medium', timeZone, locale = 'en-US' }) {
  // We interpret formats as:
  // - short:  hh:mm
  // - medium: hh:mm:ss
  // - long:   hh:mm:ss (kept same as medium for now; can be expanded later)
  const baseOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  };

  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, baseOptions);
    case 'medium':
      return new Intl.DateTimeFormat(locale, { ...baseOptions, second: '2-digit' });
    case 'long':
      return new Intl.DateTimeFormat(locale, { ...baseOptions, second: '2-digit' });
    default:
      return new Intl.DateTimeFormat(locale, { ...baseOptions, second: '2-digit' });
  }
}

export function getDateFormatter({ format = 'medium', timeZone, locale = 'en-US' }) {
  const baseOptions = { timeZone };

  switch (format) {
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    case 'medium':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        weekday: 'short',
      });
    case 'long':
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        weekday: 'long',
      });
    default:
      return new Intl.DateTimeFormat(locale, {
        ...baseOptions,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        weekday: 'short',
      });
  }
}

export function formatCustomDate({ date, formatString, timeZone, locale = 'en-US' }) {
  if (!formatString) return '';

  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const values = {
    YYYY: parts.find((p) => p.type === 'year')?.value || '',
    YY: (parts.find((p) => p.type === 'year')?.value || '').slice(-2),
    MM: parts.find((p) => p.type === 'month')?.value || '',
    M: String(parseInt(parts.find((p) => p.type === 'month')?.value || '0', 10)),
    DD: parts.find((p) => p.type === 'day')?.value || '',
    D: String(parseInt(parts.find((p) => p.type === 'day')?.value || '0', 10)),
    HH: parts.find((p) => p.type === 'hour')?.value || '',
    H: String(parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10)),
    mm: parts.find((p) => p.type === 'minute')?.value || '',
    m: String(parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10)),
    ss: parts.find((p) => p.type === 'second')?.value || '',
    s: String(parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10)),
  };

  // 12-hour helpers
  const hour24 = parseInt(values.HH || '0', 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  values.hh = String(hour12).padStart(2, '0');
  values.h = String(hour12);
  values.A = hour24 >= 12 ? 'PM' : 'AM';
  values.a = hour24 >= 12 ? 'pm' : 'am';

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(values.MM || '0', 10) - 1;
  values.MMMM = monthNames[monthIndex] || '';
  values.MMM = monthShort[monthIndex] || '';

  // Weekday names (locale-aware weekday tokens are tricky; we keep simple english names for now)
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = date.getDay();
  values.dddd = weekdayNames[dayOfWeek] || '';
  values.ddd = weekdayShort[dayOfWeek] || '';

  let result = formatString;

  // Replace long tokens first to avoid partial matches
  const tokens = ['YYYY', 'YY', 'MMMM', 'MMM', 'MM', 'dddd', 'ddd', 'DD', 'HH', 'hh', 'mm', 'ss', 'A', 'a'];
  for (const token of tokens) {
    if (values[token] !== undefined) {
      result = result.replace(new RegExp(token, 'g'), values[token]);
    }
  }

  // Single-character tokens (word-boundary so we don't corrupt text)
  result = result.replace(/\bM\b/g, values.M);
  result = result.replace(/\bD\b/g, values.D);
  result = result.replace(/\bH\b/g, values.H);
  result = result.replace(/\bh\b/g, values.h);
  result = result.replace(/\bm\b/g, values.m);
  result = result.replace(/\bs\b/g, values.s);

  return result;
}


