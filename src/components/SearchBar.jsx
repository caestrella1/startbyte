import React, { useState, useEffect, useRef } from 'react';
import SearchProviderPicker from './SearchProviderPicker';
import { searchProviders } from '../utils/searchProviders';
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
    const suggestions = searchProviders[provider].autocomplete.transform(data);
    setSuggestions(suggestions);
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
    const existingScript = document.getElementById('search-suggestions');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    const providerConfig = searchProviders[provider].autocomplete;
    const script = document.createElement('script');
    script.id = 'search-suggestions';
    script.src = `${providerConfig.url}${providerConfig.params(value)}&callback=${providerConfig.callback}`;
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
      const searchUrl = `${searchProviders[provider].action}?q=${encodeURIComponent(selectedSuggestion)}`;
      window.location.href = searchUrl;
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

  // Add effect to focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
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
