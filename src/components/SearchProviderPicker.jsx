import React from 'react';

const searchProviders = {
  duckduckgo: {
    name: 'DuckDuckGo',
    action: 'https://duckduckgo.com/',
    favicon: 'https://duckduckgo.com/favicon.ico'
  },
  google: {
    name: 'Google',
    action: 'https://www.google.com/search',
    favicon: 'https://www.google.com/favicon.ico'
  },
  bing: {
    name: 'Bing',
    action: 'https://www.bing.com/search',
    favicon: 'https://www.bing.com/favicon.ico'
  }
};

export { searchProviders };

export default function SearchProviderPicker({ provider, showProviders, onToggle, onChange }) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-8 p-1 rounded-full
        flex items-center gap-1
        dark:hover:bg-neutral-600/60
        focus:outline-none group"
      >
        <img 
          src={searchProviders[provider].favicon}
          alt={searchProviders[provider].name}
          className="w-5 h-5"
        />
        <svg 
          className={`w-3 h-3 text-neutral-400 transition-transform ${showProviders ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showProviders && (
        <ul className="absolute left-0 top-full mt-2 py-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
          {Object.entries(searchProviders).map(([key, { name, favicon }]) => (
            <li
              key={key}
              className="px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
              onClick={() => onChange(key)}
            >
              <img src={favicon} alt={name} className="w-4 h-4" />
              {name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
