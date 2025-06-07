import React, { useState, useEffect, useRef } from 'react';
import SearchProviderPicker, { searchProviders } from './SearchProviderPicker';
import Suggestions from './Suggestions';

export default function SearchBar() {
  const [provider, setProvider] = useState('duckduckgo');
  const [showProviders, setShowProviders] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const timeoutRef = useRef(null);

  const autocompleteCallback = (data) => {
    if (Array.isArray(data)) {
      setSuggestions(data[1]);
    }
  };

  // Setup stable callback
  useEffect(() => {
    window.autocompleteCallback = autocompleteCallback

    return () => {
      delete window.autocompleteCallback;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const script = document.getElementById('duckduckgo-jsonp');
      if (script) document.body.removeChild(script);
    };
  }, []);

  const fetchSuggestions = (value) => {
    const existingScript = document.getElementById('duckduckgo-jsonp');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    const script = document.createElement('script');
    script.id = 'duckduckgo-jsonp';
    script.src = `https://ac.duckduckgo.com/ac/?q=${encodeURIComponent(value)}&type=list&callback=autocompleteCallback`;
    document.body.appendChild(script);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length > 1) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 200);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex > -1) {
      e.preventDefault();
      const selectedSuggestion = suggestions[selectedIndex];
      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(selectedSuggestion)}`;
      setSuggestions([]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setShowProviders(false);
    localStorage.setItem('searchProvider', newProvider);
  };

  useEffect(() => {
    const savedProvider = localStorage.getItem('searchProvider');
    if (savedProvider && searchProviders[savedProvider]) {
      setProvider(savedProvider);
    }
  }, []);

  return (
    <form ref={formRef} className="search-box mt-6 flex justify-center" action={searchProviders[provider].action} method="get">
      <div className="flex w-[500px] relative">
        <SearchProviderPicker
          provider={provider}
          showProviders={showProviders}
          onToggle={() => setShowProviders(!showProviders)}
          onChange={handleProviderChange}
        />

        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          autoComplete="off"
          className="input input--search"
          onBlur={() => {
            setTimeout(() => setSuggestions([]), 200);
          }}
        />
        <Suggestions
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={(suggestion) => {
            setQuery(suggestion);
            setSuggestions([]);
          }}
        />

        <button type="submit" className="btn-primary absolute right-1 top-1/2 -translate-y-1/2">
          Search
        </button>
      </div>
    </form>
  );
}
