import DateTimeWidget from './DateTimeWidget';
import WeatherWidget from './WeatherWidget';
import LinksWidget from './LinksWidget';
import SearchBarWidget from './SearchBarWidget';
import TextWidget from './TextWidget';
import GreetingWidget from './GreetingWidget';

export const widgetRegistry = {
  datetime: {
    name: 'Date & Time',
    description: 'Display current date and time',
    component: DateTimeWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null, // null means use gridColumns
    maxHeight: null, // null means use gridColumns
  },
  weather: {
    name: 'Weather',
    description: 'Show current weather conditions',
    component: WeatherWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  links: {
    name: 'Links',
    description: 'Quick access links',
    component: LinksWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  searchbar: {
    name: 'Search Bar',
    description: 'Web search with autocomplete',
    component: SearchBarWidget,
    minWidth: 2,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  text: {
    name: 'Text',
    description: 'Display and edit custom text',
    component: TextWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  greeting: {
    name: 'Greeting',
    description: 'Personalized greeting with time-based message',
    component: GreetingWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
};

