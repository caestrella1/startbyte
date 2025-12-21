import React from 'react';

export default function Switch({ checked, onChange, label, id, ...props }) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label htmlFor={switchId} className="flex items-center gap-2 cursor-pointer">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-500"></div>
      </div>
      {label && <span className="text-sm text-primary">{label}</span>}
    </label>
  );
}

