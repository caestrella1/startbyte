import React, { useState, useRef, useEffect } from 'react';
import Dropdown, { DropdownItem } from './ui/Dropdown';
import { searchProviders, getProviderInfo } from '../utils/searchProviders';

export default function SearchProviderPicker({ provider, showProviders, onToggle, onChange }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const buttonRef = useRef(null);
  const pickerRef = useRef(null);
  const currentProvider = getProviderInfo(provider);

  useEffect(() => {
    if (!showProviders) {
      setSelectedIndex(-1);
    }
  }, [showProviders]);

  useEffect(() => {
    if (!showProviders) return;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showProviders, onToggle]);

  const handleKeyDown = (e) => {
    if (!showProviders && e.key === 'Enter') {
      onToggle();
      return;
    }

    if (showProviders) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < Object.entries(searchProviders).length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            onChange(Object.entries(searchProviders)[selectedIndex][0]);
            onToggle();
            buttonRef.current?.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onToggle();
          buttonRef.current?.focus();
          break;
      }
    }
  };

  return (
    <div ref={pickerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={showProviders}
        aria-label={`Search using ${currentProvider.name}`}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-8 p-1 rounded-full
        flex items-center gap-1
        dark:hover:bg-neutral-600/60
        focus:outline-none focus:ring-2 focus:ring-blue-400 group"
      >
        <img 
          src={currentProvider.favicon}
          alt={currentProvider.name}
          className="w-5 h-5"
        />
        <svg 
          className={`w-3 h-3 text-primary transition-transform ${showProviders ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showProviders && (
        <Dropdown 
          className="left-0 right-auto w-48" 
          role="listbox" 
          anchorElement={buttonRef.current}
          useAnchorWidth={false}
        >
          {Object.entries(searchProviders).map(([key, info], index) => (
            <DropdownItem
              key={key}
              onClick={() => onChange(key)}
              selected={index === selectedIndex}
              role="option"
              aria-selected={index === selectedIndex}
              className="flex items-center gap-2"
            >
              <img src={info.favicon} alt="" className="w-4 h-4" />
              {info.name}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </div>
  );
}
