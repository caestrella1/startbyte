import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import WidgetGrid from './components/WidgetGrid';
import WidgetPicker from './components/widgets/WidgetPicker';
import Settings from './components/Settings';
import { getStoredImage, storeImage, removeStoredImage } from './utils/imageStorage';

export default function App() {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('widgets');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default widgets
    return [
      { id: 'searchbar-1', type: 'searchbar', settings: {} },
      { id: 'datetime-1', type: 'datetime', settings: {} },
      { id: 'weather-1', type: 'weather', settings: {} },
      { id: 'links-1', type: 'links', settings: { styleType: 'pill' } },
    ];
  });
  const [isWidgetPickerOpen, setIsWidgetPickerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [background, setBackground] = useState(() => {
    const saved = localStorage.getItem('background');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Legacy format - convert to new format
        if (saved.startsWith('solid-') || saved.startsWith('gradient-')) {
          return saved;
        }
        return { type: 'solid', color: '#000000' };
      }
    }
    return { type: 'solid', color: '#000000' };
  });
  const [backgroundType, setBackgroundType] = useState(() => {
    return localStorage.getItem('backgroundType') || 'solid';
  });
  const [customSolidColor, setCustomSolidColor] = useState(() => {
    return localStorage.getItem('customSolidColor') || '#000000';
  });
  const [customGradientColors, setCustomGradientColors] = useState(() => {
    const saved = localStorage.getItem('customGradientColors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { from: '#000000', to: '#ffffff' };
      }
    }
    return { from: '#000000', to: '#ffffff' };
  });
  const [customBackgroundImage, setCustomBackgroundImage] = useState(() => {
    return getStoredImage('customBackgroundImage');
  });
  const [backgroundBlur, setBackgroundBlur] = useState(() => {
    const saved = localStorage.getItem('backgroundBlur');
    return saved ? parseFloat(saved) : 16; // Default blur of 16px (backdrop-blur-lg)
  });
  const [backgroundOverlay, setBackgroundOverlay] = useState(() => {
    const saved = localStorage.getItem('backgroundOverlay');
    return saved ? parseFloat(saved) : 0.5; // Default overlay opacity of 0.5 (bg-black/50)
  });

  useEffect(() => {
    localStorage.setItem('widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    if (typeof background === 'object' && background !== null) {
      localStorage.setItem('background', JSON.stringify(background));
    } else {
      localStorage.setItem('background', background);
    }
  }, [background]);

  useEffect(() => {
    localStorage.setItem('backgroundType', backgroundType);
  }, [backgroundType]);

  useEffect(() => {
    localStorage.setItem('customSolidColor', customSolidColor);
  }, [customSolidColor]);

  useEffect(() => {
    localStorage.setItem('customGradientColors', JSON.stringify(customGradientColors));
  }, [customGradientColors]);

  useEffect(() => {
    if (customBackgroundImage) {
      storeImage('customBackgroundImage', customBackgroundImage).catch(err => {
        console.error('Failed to store background image:', err);
      });
    } else {
      removeStoredImage('customBackgroundImage');
    }
  }, [customBackgroundImage]);

  useEffect(() => {
    localStorage.setItem('backgroundBlur', backgroundBlur.toString());
  }, [backgroundBlur]);

  useEffect(() => {
    localStorage.setItem('backgroundOverlay', backgroundOverlay.toString());
  }, [backgroundOverlay]);

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      settings: {},
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleWidgetSettingsChange = (widgetId, newSettings) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, settings: newSettings } : w
    ));
  };

  const handleWidgetRemove = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleWidgetReorder = (newWidgets) => {
    setWidgets(newWidgets);
  };

  const handleResetBackground = () => {
    setBackground({ type: 'solid', color: '#000000' });
    setBackgroundType('solid');
    setCustomSolidColor('#000000');
    setCustomGradientColors({ from: '#000000', to: '#ffffff' });
    setCustomBackgroundImage(null);
    setBackgroundBlur(16);
    setBackgroundOverlay(0.5);
  };

  const handleResetAll = () => {
    // Reset widgets to defaults
    const defaultWidgets = [
      { id: 'searchbar-1', type: 'searchbar', settings: {} },
      { id: 'datetime-1', type: 'datetime', settings: {} },
      { id: 'weather-1', type: 'weather', settings: {} },
      { id: 'links-1', type: 'links', settings: { styleType: 'pill' } },
    ];
    setWidgets(defaultWidgets);
    
    // Reset background
    setBackground({ type: 'solid', color: '#000000' });
    setBackgroundType('solid');
    setCustomSolidColor('#000000');
    setCustomGradientColors({ from: '#000000', to: '#ffffff' });
    setCustomBackgroundImage(null);
    setBackgroundBlur(16);
    setBackgroundOverlay(0.5);
    
    // Clear localStorage
    localStorage.removeItem('widgets');
    localStorage.removeItem('background');
    localStorage.removeItem('backgroundType');
    localStorage.removeItem('customSolidColor');
    localStorage.removeItem('customGradientColors');
    localStorage.removeItem('backgroundBlur');
    localStorage.removeItem('backgroundOverlay');
    removeStoredImage('customBackgroundImage');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Good night";
  };

  return (
    <div className="font-sans text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Background 
        background={background} 
        backgroundType={backgroundType}
        customSolidColor={customSolidColor}
        customGradientColors={customGradientColors}
        customImage={customBackgroundImage}
        blur={backgroundBlur}
        overlay={backgroundOverlay}
      />
      <div className="container w-full max-w-6xl mx-auto p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="mb-4 text-xl font-normal tracking-wide text-neutral-600 dark:text-neutral-400">
            {getGreeting()}, Carlos
          </h1>
        </div>
        <WidgetGrid
          widgets={widgets}
          onWidgetSettingsChange={handleWidgetSettingsChange}
          onWidgetRemove={handleWidgetRemove}
          onWidgetReorder={handleWidgetReorder}
          isEditing={isEditing}
        />
      </div>
      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        {/* Add Widget Button */}
        <div className="relative group">
          <button
            onClick={() => setIsWidgetPickerOpen(true)}
            className="w-12 h-12 rounded-full 
              bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm
              shadow-lg border border-neutral-200 dark:border-neutral-700
              flex items-center justify-center
              hover:bg-white dark:hover:bg-neutral-700
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Add widget"
          >
            <svg 
              className="w-6 h-6 text-neutral-700 dark:text-neutral-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 rounded-lg
            bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900
            text-sm font-medium whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            shadow-lg">
            Add widget
            <div className="absolute left-full top-1/2 -translate-y-1/2
              border-4 border-transparent border-l-neutral-900 dark:border-l-neutral-100" />
          </div>
        </div>

        {/* Edit Button */}
        <div className="relative group">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-12 h-12 rounded-full 
              backdrop-blur-sm shadow-lg border
              flex items-center justify-center
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isEditing
                  ? 'bg-green-500/90 dark:bg-green-600/90 border-green-400 dark:border-green-500 hover:bg-green-500 dark:hover:bg-green-600'
                  : 'bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            aria-label={isEditing ? "Done" : "Edit page"}
          >
            {isEditing ? (
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            ) : (
              <svg 
                className="w-6 h-6 text-neutral-700 dark:text-neutral-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
            )}
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 rounded-lg
            bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900
            text-sm font-medium whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            shadow-lg">
            {isEditing ? "Done" : "Edit page"}
            <div className="absolute left-full top-1/2 -translate-y-1/2
              border-4 border-transparent border-l-neutral-900 dark:border-l-neutral-100" />
          </div>
        </div>

        {/* Settings Button */}
        <div className="relative group">
        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 rounded-full 
              bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm
              shadow-lg border border-neutral-200 dark:border-neutral-700
              flex items-center justify-center
              hover:bg-white dark:hover:bg-neutral-700
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open settings"
          >
            <svg 
              className="w-6 h-6 text-neutral-700 dark:text-neutral-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
        </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2
            px-3 py-1.5 rounded-lg
            bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900
            text-sm font-medium whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            shadow-lg">
            Settings
            <div className="absolute left-full top-1/2 -translate-y-1/2
              border-4 border-transparent border-l-neutral-900 dark:border-l-neutral-100" />
          </div>
        </div>
      </div>
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        background={background}
        backgroundType={backgroundType}
        customSolidColor={customSolidColor}
        customGradientColors={customGradientColors}
        customBackgroundImage={customBackgroundImage}
        backgroundBlur={backgroundBlur}
        backgroundOverlay={backgroundOverlay}
        onBackgroundChange={setBackground}
        onBackgroundTypeChange={setBackgroundType}
        onCustomSolidColorChange={setCustomSolidColor}
        onCustomGradientColorsChange={setCustomGradientColors}
        onCustomBackgroundChange={setCustomBackgroundImage}
        onBackgroundBlurChange={setBackgroundBlur}
        onBackgroundOverlayChange={setBackgroundOverlay}
        onResetBackground={handleResetBackground}
        onResetAll={handleResetAll}
      />
      <WidgetPicker
        isOpen={isWidgetPickerOpen}
        onClose={() => setIsWidgetPickerOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
}
