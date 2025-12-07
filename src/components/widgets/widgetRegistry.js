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
  text: {
    name: 'Text',
    description: 'Display and edit custom text',
    component: TextWidget,
  },
  greeting: {
    name: 'Greeting',
    description: 'Personalized greeting with time-based message',
    component: GreetingWidget,
  },
};

