import React from 'react';
import './SegmentedControl.css';

export default function SegmentedControl({ options, value, onChange, ...props }) {
  return (
    <div {...props} className={`segmented-control ${props.className}`}>
      {options.map(option => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`segmented-control__option ${
            value === option.id && 'segmented-control__option--selected'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
