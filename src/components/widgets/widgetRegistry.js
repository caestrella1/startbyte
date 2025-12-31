import DateTimeWidget from 'widgets/datetime/DateTimeWidget';
import WeatherWidget from 'widgets/weather/WeatherWidget';
import LinkWidget from 'widgets/LinkWidget';
import SearchBarWidget from 'widgets/SearchBarWidget';
import TextWidget from 'widgets/TextWidget';
import GreetingWidget from 'widgets/GreetingWidget';

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
    description: 'Show weather (today, 3-day, or 5-day forecast)',
    component: WeatherWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  link: {
    name: 'Link',
    description: 'Single quick access link',
    component: LinkWidget,
    minWidth: 1,
    minHeight: 1,
    maxWidth: null,
    maxHeight: null,
  },
  searchbar: {
    name: 'Search Bar',
    description: 'Web search with autocomplete',
    component: SearchBarWidget,
    minWidth: 3,
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

