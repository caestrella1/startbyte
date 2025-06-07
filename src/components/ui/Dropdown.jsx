import React from 'react';

export default function Dropdown({ children, className = '' }) {
  return (
    <ul className={`absolute left-0 right-0 top-full mt-2 py-2 
      bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm 
      rounded-lg shadow-lg 
      border border-neutral-200 dark:border-neutral-700 
      z-50 ${className}`}>
      {children}
    </ul>
  );
}

export function DropdownItem({ children, selected, onClick, className = '' }) {
  return (
    <li
      className={`px-4 py-2 cursor-pointer text-left ${
        selected
          ? 'bg-blue-50 dark:bg-blue-500/80'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
      } ${className}`}
      onMouseDown={onClick}
    >
      {children}
    </li>
  );
}
