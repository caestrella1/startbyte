import React from 'react';
import Dropdown, { DropdownItem } from 'ui/Dropdown';

export default function Suggestions({ suggestions, selectedIndex, onSelect }) {
  if (!suggestions.length) return null;

  return (
    <Dropdown>
      {suggestions.map((suggestion, index) => (
        <DropdownItem
          key={suggestion}
          selected={index === selectedIndex}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
