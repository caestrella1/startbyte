import DateTimeWidget from './DateTimeWidget';
import WeatherWidget from './WeatherWidget';
import LinksWidget from './LinksWidget';
import SearchBarWidget from './SearchBarWidget';

export const widgetRegistry = {
  datetime: {
    name: 'Date & Time',
    description: 'Display current date and time',
    component: DateTimeWidget,
  },
  weather: {
    name: 'Weather',
    description: 'Show current weather conditions',
    component: WeatherWidget,
  },
  links: {
    name: 'Links',
    description: 'Quick access links',
    component: LinksWidget,
  },
  searchbar: {
    name: 'Search Bar',
    description: 'Web search with autocomplete',
    component: SearchBarWidget,
  },
};

