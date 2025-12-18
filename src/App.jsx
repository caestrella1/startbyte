import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import WidgetGrid from './components/WidgetGrid';
import WidgetPicker from './components/widgets/WidgetPicker';
import Settings from './components/Settings';
import { getStoredImage, storeImage, removeStoredImage } from './utils/imageStorage';
import defaultConfig from './config/defaults.json';

export default function App() {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('widgets');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default widgets from config
    return defaultConfig.widgets;
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
        return defaultConfig.background;
      }
    }
    return defaultConfig.background;
  });
  const [backgroundType, setBackgroundType] = useState(() => {
    return localStorage.getItem('backgroundType') || defaultConfig.backgroundType;
  });
  const [customSolidColor, setCustomSolidColor] = useState(() => {
    return localStorage.getItem('customSolidColor') || defaultConfig.customSolidColor;
  });
  const [customGradientColors, setCustomGradientColors] = useState(() => {
    const saved = localStorage.getItem('customGradientColors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultConfig.customGradientColors;
      }
    }
    return defaultConfig.customGradientColors;
  });
  const [customBackgroundImage, setCustomBackgroundImage] = useState(() => {
    return getStoredImage('customBackgroundImage');
  });
  const [backgroundBlur, setBackgroundBlur] = useState(() => {
    const saved = localStorage.getItem('backgroundBlur');
    return saved ? parseFloat(saved) : defaultConfig.backgroundBlur;
  });
  const [backgroundOverlay, setBackgroundOverlay] = useState(() => {
    const saved = localStorage.getItem('backgroundOverlay');
    return saved ? parseFloat(saved) : defaultConfig.backgroundOverlay;
  });
  const [gridColumnsSmall, setGridColumnsSmall] = useState(() => {
    const saved = localStorage.getItem('gridColumnsSmall');
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsSmall ?? 1);
  });
  const [gridColumnsMedium, setGridColumnsMedium] = useState(() => {
    const saved = localStorage.getItem('gridColumnsMedium');
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsMedium ?? 2);
  });
  const [gridColumnsLarge, setGridColumnsLarge] = useState(() => {
    const saved = localStorage.getItem('gridColumnsLarge');
    return saved ? parseInt(saved) : (defaultConfig.gridColumnsLarge ?? defaultConfig.gridColumns ?? 6);
  });
  const [widgetAlignmentHorizontal, setWidgetAlignmentHorizontal] = useState(() => {
    const saved = localStorage.getItem('widgetAlignmentHorizontal');
    return saved || defaultConfig.widgetAlignmentHorizontal || 'left';
  });
  const [widgetAlignmentVertical, setWidgetAlignmentVertical] = useState(() => {
    const saved = localStorage.getItem('widgetAlignmentVertical');
    return saved || defaultConfig.widgetAlignmentVertical || 'center';
  });
  const [currentlyEditedWidgetId, setCurrentlyEditedWidgetId] = useState(null);

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

  useEffect(() => {
    localStorage.setItem('gridColumnsSmall', gridColumnsSmall.toString());
  }, [gridColumnsSmall]);

  useEffect(() => {
    localStorage.setItem('gridColumnsMedium', gridColumnsMedium.toString());
  }, [gridColumnsMedium]);

  useEffect(() => {
    localStorage.setItem('gridColumnsLarge', gridColumnsLarge.toString());
  }, [gridColumnsLarge]);

  useEffect(() => {
    localStorage.setItem('widgetAlignmentHorizontal', widgetAlignmentHorizontal);
  }, [widgetAlignmentHorizontal]);

  useEffect(() => {
    localStorage.setItem('widgetAlignmentVertical', widgetAlignmentVertical);
  }, [widgetAlignmentVertical]);

  // Clamp widget widths when grid size changes (use largest breakpoint)
  useEffect(() => {
    const maxGridColumns = Math.max(gridColumnsSmall, gridColumnsMedium, gridColumnsLarge);
    setWidgets(prevWidgets => {
      const updated = prevWidgets.map(widget => {
        const widgetWidth = widget.settings?.width || 1;
        if (widgetWidth > maxGridColumns) {
          // Clamp width to new grid size
          return {
            ...widget,
            settings: {
              ...widget.settings,
              width: maxGridColumns,
            },
          };
        }
        return widget;
      });
      // Only update if something changed
      const hasChanges = updated.some((w, i) => {
        const oldWidth = prevWidgets[i].settings?.width || 1;
        const newWidth = w.settings?.width || 1;
        return oldWidth !== newWidth;
      });
      return hasChanges ? updated : prevWidgets;
    });
  }, [gridColumnsSmall, gridColumnsMedium, gridColumnsLarge]);

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      settings: {},
    };
    // Always add to the end (right of last widget)
    setWidgets([...widgets, newWidget]);
  };

  const handleWidgetSettingsChange = (widgetId, newSettings) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, settings: newSettings } : w
    ));
  };

  const handleWidgetRemove = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    // Clear the edited widget ID if the deleted widget was being edited
    if (currentlyEditedWidgetId === widgetId) {
      setCurrentlyEditedWidgetId(null);
    }
  };

  const handleWidgetReorder = (newWidgets) => {
    setWidgets(newWidgets);
  };

  const handleResetBackground = () => {
    setBackground(defaultConfig.background);
    setBackgroundType(defaultConfig.backgroundType);
    setCustomSolidColor(defaultConfig.customSolidColor);
    setCustomGradientColors(defaultConfig.customGradientColors);
    setCustomBackgroundImage(defaultConfig.customBackgroundImage);
    setBackgroundBlur(defaultConfig.backgroundBlur);
    setBackgroundOverlay(defaultConfig.backgroundOverlay);
  };

  const handleResetAll = () => {
    // Clear all links data for links widgets first
    const linkKeys = Object.keys(localStorage).filter(key => key.startsWith('linkOrder-'));
    linkKeys.forEach(key => localStorage.removeItem(key));
    
    // Reset widgets to defaults with new IDs to force remounting
    const timestamp = Date.now();
    const defaultWidgets = defaultConfig.widgets.map(widget => ({
      ...widget,
      id: `${widget.type}-${timestamp}`,
    }));
    setWidgets(defaultWidgets);
    
    // Reset background
    setBackground(defaultConfig.background);
    setBackgroundType(defaultConfig.backgroundType);
    setCustomSolidColor(defaultConfig.customSolidColor);
    setCustomGradientColors(defaultConfig.customGradientColors);
    setCustomBackgroundImage(defaultConfig.customBackgroundImage);
    setBackgroundBlur(defaultConfig.backgroundBlur);
    setBackgroundOverlay(defaultConfig.backgroundOverlay);
    
    // Reset grid settings
    setGridColumnsSmall(defaultConfig.gridColumnsSmall ?? 1);
    setGridColumnsMedium(defaultConfig.gridColumnsMedium ?? 2);
    setGridColumnsLarge(defaultConfig.gridColumnsLarge ?? defaultConfig.gridColumns ?? 6);
    setWidgetAlignmentHorizontal(defaultConfig.widgetAlignmentHorizontal || 'left');
    setWidgetAlignmentVertical(defaultConfig.widgetAlignmentVertical || 'center');
    
    // Clear localStorage
    localStorage.removeItem('widgets');
    localStorage.removeItem('background');
    localStorage.removeItem('backgroundType');
    localStorage.removeItem('customSolidColor');
    localStorage.removeItem('gridColumns');
    localStorage.removeItem('widgetAlignmentHorizontal');
    localStorage.removeItem('widgetAlignmentVertical');
    localStorage.removeItem('customGradientColors');
    localStorage.removeItem('backgroundBlur');
    localStorage.removeItem('backgroundOverlay');
    removeStoredImage('customBackgroundImage');
  };

  const handleExportSettings = () => {
    // Collect all settings
    const exportData = {
      version: '1.0',
      widgets: widgets,
      background: background,
      backgroundType: backgroundType,
      customSolidColor: customSolidColor,
      customGradientColors: customGradientColors,
      customBackgroundImage: customBackgroundImage,
      backgroundBlur: backgroundBlur,
      backgroundOverlay: backgroundOverlay,
      gridColumnsSmall: gridColumnsSmall,
      gridColumnsMedium: gridColumnsMedium,
      gridColumnsLarge: gridColumnsLarge,
      widgetAlignmentHorizontal: widgetAlignmentHorizontal,
      widgetAlignmentVertical: widgetAlignmentVertical,
      // Collect links data for all links widgets
      linksData: {},
      // Search provider (if stored globally)
      searchProvider: localStorage.getItem('searchProvider') || null,
    };

    // Collect links data for each links widget
    widgets.forEach(widget => {
      if (widget.type === 'links') {
        // Use widget.id as the key (this is what LinksWidget uses)
        const widgetId = widget.id;
        const linkKey = `linkOrder-${widgetId}`;
        const linksData = localStorage.getItem(linkKey);
        if (linksData) {
          try {
            exportData.linksData[widgetId] = JSON.parse(linksData);
          } catch (e) {
            console.warn(`Failed to parse links data for widget ${widgetId}:`, e);
          }
        }
      }
    });

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `startbyte-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          // Validate version (for future compatibility)
          if (!importData.version) {
            throw new Error('Invalid settings file format');
          }

          // Import widgets
          if (importData.widgets) {
            setWidgets(importData.widgets);
          }

          // Import background settings
          if (importData.background) {
            setBackground(importData.background);
          }
          if (importData.backgroundType) {
            setBackgroundType(importData.backgroundType);
          }
          if (importData.customSolidColor) {
            setCustomSolidColor(importData.customSolidColor);
          }
          if (importData.customGradientColors) {
            setCustomGradientColors(importData.customGradientColors);
          }
          if (importData.customBackgroundImage) {
            // Store the imported image
            await storeImage('customBackgroundImage', importData.customBackgroundImage);
            setCustomBackgroundImage(importData.customBackgroundImage);
          } else {
            setCustomBackgroundImage(null);
            removeStoredImage('customBackgroundImage');
          }
          if (importData.backgroundBlur !== undefined) {
            setBackgroundBlur(importData.backgroundBlur);
          }
          if (importData.backgroundOverlay !== undefined) {
            setBackgroundOverlay(importData.backgroundOverlay);
          }
          if (importData.gridColumnsSmall !== undefined) {
            setGridColumnsSmall(importData.gridColumnsSmall);
          }
          if (importData.gridColumnsMedium !== undefined) {
            setGridColumnsMedium(importData.gridColumnsMedium);
          }
          if (importData.gridColumnsLarge !== undefined) {
            setGridColumnsLarge(importData.gridColumnsLarge);
          }
          // Legacy support: if old gridColumns exists, use it for large
          if (importData.gridColumns !== undefined && importData.gridColumnsLarge === undefined) {
            setGridColumnsLarge(importData.gridColumns);
          }

          // Import links data
          if (importData.linksData) {
            Object.keys(importData.linksData).forEach(widgetId => {
              const linkKey = `linkOrder-${widgetId}`;
              localStorage.setItem(linkKey, JSON.stringify(importData.linksData[widgetId]));
            });
          }

          // Import search provider
          if (importData.searchProvider) {
            localStorage.setItem('searchProvider', importData.searchProvider);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <div className="font-sans text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col relative overflow-hidden"
      style={{
        justifyContent: widgetAlignmentVertical === 'top' ? 'flex-start' : 
                      widgetAlignmentVertical === 'bottom' ? 'flex-end' : 
                      'center',
      }}
    >
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
        <WidgetGrid
          widgets={widgets}
          onWidgetSettingsChange={handleWidgetSettingsChange}
          onWidgetRemove={handleWidgetRemove}
          onWidgetReorder={handleWidgetReorder}
          isEditing={isEditing}
          gridColumnsSmall={gridColumnsSmall}
          gridColumnsMedium={gridColumnsMedium}
          gridColumnsLarge={gridColumnsLarge}
          widgetAlignmentHorizontal={widgetAlignmentHorizontal}
          widgetAlignmentVertical={widgetAlignmentVertical}
          currentlyEditedWidgetId={currentlyEditedWidgetId}
          onWidgetSettingsOpen={(widgetId) => setCurrentlyEditedWidgetId(widgetId)}
          onWidgetSettingsClose={() => setCurrentlyEditedWidgetId(null)}
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
              className="fab-icon" 
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
                className="fab-icon" 
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
              className="fab-icon" 
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
        gridColumnsSmall={gridColumnsSmall}
        onGridColumnsSmallChange={setGridColumnsSmall}
        gridColumnsMedium={gridColumnsMedium}
        onGridColumnsMediumChange={setGridColumnsMedium}
        gridColumnsLarge={gridColumnsLarge}
        onGridColumnsLargeChange={setGridColumnsLarge}
        widgetAlignmentHorizontal={widgetAlignmentHorizontal}
        onWidgetAlignmentHorizontalChange={setWidgetAlignmentHorizontal}
        widgetAlignmentVertical={widgetAlignmentVertical}
        onWidgetAlignmentVerticalChange={setWidgetAlignmentVertical}
        onResetBackground={handleResetBackground}
        onResetAll={handleResetAll}
        onExportSettings={handleExportSettings}
        onImportSettings={handleImportSettings}
      />
      <WidgetPicker
        isOpen={isWidgetPickerOpen}
        onClose={() => setIsWidgetPickerOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
}
