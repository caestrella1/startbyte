import React from 'react';

export default function SettingSection({ 
  categoryId, 
  currentCategory, 
  isTransitioning,
  children 
}) {
  return (
    <div 
      className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
        currentCategory === categoryId
          ? isTransitioning
            ? 'translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

