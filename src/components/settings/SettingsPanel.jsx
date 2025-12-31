import React from 'react';
import { createPortal } from 'react-dom';
import { ImageIcon, GridIcon, RefreshIcon, ChevronLeftIcon, CloseIcon, ChevronRightIcon } from 'assets/icons';

const categories = [
  { id: 'background', label: 'Wallpaper', icon: <ImageIcon className="w-5 h-5" /> },
  { id: 'grid', label: 'Grid', icon: <GridIcon className="w-5 h-5" /> },
  { id: 'reset', label: 'Transfer & Reset', icon: <RefreshIcon className="w-5 h-5" /> },
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
        className={`fixed right-4 top-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl 
          rounded-2xl border border-neutral-600/20 dark:border-white/10
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
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-primary">
                  {currentCategoryLabel}
                </h2>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-primary">Settings</h2>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg 
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                text-secondary"
              aria-label="Close settings"
            >
              <CloseIcon className="w-5 h-5" />
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
                      className="w-full p-4 rounded-2xl transition-colors text-left flex items-center gap-3
                        bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800"
                    >
                      <div className="text-secondary">
                        {category.icon}
                      </div>
                      <span className="font-medium text-primary">
                        {category.label}
                      </span>
                      <ChevronRightIcon className="w-5 h-5 text-icon ml-auto" />
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

