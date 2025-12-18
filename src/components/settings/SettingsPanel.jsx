import React from 'react';
import { createPortal } from 'react-dom';

const categories = [
  { id: 'background', label: 'Wallpaper', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ) },
  { id: 'grid', label: 'Grid', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ) },
  { id: 'reset', label: 'Transfer & Reset', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ) },
];

export default function SettingsPanel({ 
  isOpen, 
  isClosing, 
  currentCategory, 
  isTransitioning,
  onClose, 
  onFinishClose,
  onCategorySelect, 
  onBack,
  children 
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const finishClosing = () => {
    if (isClosing && onFinishClose) {
      onFinishClose();
    }
  };

  if (!isOpen && !isClosing) return null;

  const currentCategoryLabel = categories.find(c => c.id === currentCategory)?.label || 'Settings';

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Side Panel */}
      <div 
        className={`fixed right-4 top-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl 
          rounded-2xl border border-neutral-500 dark:border-white/10
          shadow-2xl z-50
          ${isClosing ? 'animate-spring-slide-out' : 'animate-spring-slide-in'}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) {
            finishClosing();
          }
        }}
      >
        <div className="p-6 h-full flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            {currentCategory ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="w-8 h-8 flex items-center justify-center rounded-lg 
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    text-secondary transition-colors"
                  aria-label="Back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {currentCategoryLabel}
                </h2>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-black dark:text-white">Settings</h2>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg 
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                text-secondary"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Categories View */}
            <div 
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                currentCategory 
                  ? 'translate-x-full opacity-0' 
                  : isTransitioning 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="h-full overflow-y-auto">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect(category.id)}
                      className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700
                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                        transition-colors flex items-center gap-3
                        text-left"
                    >
                      <div className="text-secondary">
                        {category.icon}
                      </div>
                      <span className="font-medium text-black dark:text-white">
                        {category.label}
                      </span>
                      <svg className="w-5 h-5 text-neutral-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Content */}
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

