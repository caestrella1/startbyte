import React, { useState, useEffect, useRef } from 'react';
import SearchProviderPicker from 'components/SearchProviderPicker';
import { searchProviders } from 'utils/searchProviders';
import Suggestions from 'components/Suggestions';
import AlignmentPicker from 'ui/AlignmentPicker';
import Switch from 'ui/Switch';

export default function SearchBarWidget({ settings = {}, onSettingsChange }) {
  const [provider, setProvider] = useState(settings.provider || 'duckduckgo');
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

  useEffect(() => {
    window.autocompleteCallback = autocompleteCallback;

    return () => {
      delete window.autocompleteCallback;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const script = document.getElementById('duckduckgo-jsonp');
      if (script) document.body.removeChild(script);
    };
  }, [provider]);

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
    if (onSettingsChange) {
      onSettingsChange({ ...settings, provider: newProvider });
    }
  };

  useEffect(() => {
    if (settings.provider && searchProviders[settings.provider]) {
      setProvider(settings.provider);
    } else {
      const savedProvider = localStorage.getItem('searchProvider');
      if (savedProvider && searchProviders[savedProvider]) {
        setProvider(savedProvider);
        if (onSettingsChange) {
          onSettingsChange({ ...settings, provider: savedProvider });
        }
      }
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    if (!query.trim()) {
      e.preventDefault();
      return;
    }
  };

  return (
    <form ref={formRef} className="search-box flex justify-center" action={searchProviders[provider].action} method="get" onSubmit={handleSubmit}>
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

        <button 
          type="submit" 
          disabled={!query.trim()} 
          className="btn-primary absolute right-1 top-1/2 -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div>
    </form>
  );
}

SearchBarWidget.Settings = function SearchBarSettings({ settings = {}, onSettingsChange, onRemove }) {
  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Search Bar Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
            Alignment
          </label>
          <AlignmentPicker
            horizontalAlign={settings.horizontalAlign || 'center'}
            verticalAlign={settings.verticalAlign || 'center'}
            onChange={({ horizontalAlign, verticalAlign }) => 
              onSettingsChange({ ...settings, horizontalAlign, verticalAlign })
            }
          />
        </div>
        <div>
          <Switch
            checked={settings.showBackground !== false}
            onChange={(checked) => onSettingsChange({ ...settings, showBackground: checked })}
            label="Show background"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn-danger w-full mt-4"
          >
            Remove Widget
          </button>
        )}
      </div>
    </div>
  );
};

