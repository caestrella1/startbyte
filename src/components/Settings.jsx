import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SegmentedControl from './ui/SegmentedControl';
import { compressImage } from '../utils/imageStorage';

const categories = [
  { id: 'background', label: 'Background', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ) },
  { id: 'reset', label: 'Reset', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ) },
];

const backgroundTypeOptions = [
  { id: 'solid', label: 'Solid' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'image', label: 'Image' },
];

export default function Settings({ isOpen, onClose, background, customBackgroundImage, backgroundType, customSolidColor, customGradientColors, backgroundBlur, backgroundOverlay, onBackgroundChange, onCustomBackgroundChange, onBackgroundTypeChange, onCustomSolidColorChange, onCustomGradientColorsChange, onBackgroundBlurChange, onBackgroundOverlayChange, onResetBackground, onResetAll }) {
  const fileInputRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isClosed = !isOpen && !isClosing;
  
  // Determine current background type from background state
  const getCurrentBackgroundType = () => {
    if (backgroundType) return backgroundType;
    if (customBackgroundImage) return 'image';
    if (typeof background === 'object' && background !== null) {
      return background.type || 'solid';
    }
    if (typeof background === 'string') {
      if (background.startsWith('gradient-')) return 'gradient';
      if (background === 'custom' && customBackgroundImage) return 'image';
      return 'solid';
    }
    return 'solid';
  };
  
  const currentBackgroundType = getCurrentBackgroundType();

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setCurrentCategory(null);
    }
  }, [isOpen]);

  const handleCategorySelect = (categoryId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategory(categoryId);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCategory(null);
      setIsTransitioning(false);
    }, 150);
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const finishClosing = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  if (isClosed && !isClosing) return null;

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
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            {currentCategory ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="w-8 h-8 flex items-center justify-center rounded-lg 
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    text-neutral-600 dark:text-neutral-400 transition-colors"
                  aria-label="Back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {categories.find(c => c.id === currentCategory)?.label || 'Settings'}
                </h2>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-black dark:text-white">Settings</h2>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg 
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                text-neutral-600 dark:text-neutral-400"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
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
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700
                        hover:bg-neutral-100 dark:hover:bg-neutral-800
                        transition-colors flex items-center gap-3
                        text-left"
                    >
                      <div className="text-neutral-600 dark:text-neutral-400">
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

            {/* Background Settings View */}
            <div 
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                currentCategory === 'background'
                  ? isTransitioning
                    ? 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0'
              }`}
            >
              <div className="h-full overflow-y-auto">
                <div className="mb-6">
                  <SegmentedControl
                    options={backgroundTypeOptions}
                    value={currentBackgroundType}
                    onChange={(type) => {
                      onBackgroundTypeChange(type);
                      if (type === 'solid') {
                        // Initialize with current solid color or default
                        const currentColor = (typeof background === 'object' && background?.type === 'solid')
                          ? background.color
                          : customSolidColor || '#000000';
                        onBackgroundChange({ type: 'solid', color: currentColor });
                      } else if (type === 'gradient') {
                        // Initialize with current gradient colors or defaults
                        const from = (typeof background === 'object' && background?.type === 'gradient')
                          ? background.from
                          : customGradientColors?.from || '#000000';
                        const to = (typeof background === 'object' && background?.type === 'gradient')
                          ? background.to
                          : customGradientColors?.to || '#ffffff';
                        onBackgroundChange({ type: 'gradient', from, to });
                      }
                    }}
                    className="mb-6"
                  />

                  {/* Solid Color Picker */}
                  {currentBackgroundType === 'solid' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                          Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={(() => {
                              if (typeof background === 'object' && background?.type === 'solid') {
                                return background.color || customSolidColor || '#000000';
                              }
                              return customSolidColor || '#000000';
                            })()}
                            onChange={(e) => {
                              const color = e.target.value;
                              onCustomSolidColorChange(color);
                              onBackgroundChange({ type: 'solid', color });
                              onBackgroundTypeChange('solid');
                            }}
                            className="w-20 h-20 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={(() => {
                                if (typeof background === 'object' && background?.type === 'solid') {
                                  return background.color || customSolidColor || '#000000';
                                }
                                return customSolidColor || '#000000';
                              })()}
                              onChange={(e) => {
                                const color = e.target.value;
                                if (/^#[0-9A-F]{6}$/i.test(color)) {
                                  onCustomSolidColorChange(color);
                                  onBackgroundChange({ type: 'solid', color });
                                  onBackgroundTypeChange('solid');
                                }
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                                bg-white dark:bg-neutral-800
                                text-black dark:text-white
                                font-mono text-sm"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient Color Picker */}
                  {currentBackgroundType === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                          From Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={(() => {
                              if (typeof background === 'object' && background?.type === 'gradient') {
                                return background.from || customGradientColors?.from || '#000000';
                              }
                              return customGradientColors?.from || '#000000';
                            })()}
                            onChange={(e) => {
                              const from = e.target.value;
                              const to = (typeof background === 'object' && background?.type === 'gradient') 
                                ? (background.to || customGradientColors?.to || '#ffffff')
                                : (customGradientColors?.to || '#ffffff');
                              const newColors = { from, to };
                              onCustomGradientColorsChange(newColors);
                              onBackgroundChange({ type: 'gradient', from, to });
                              onBackgroundTypeChange('gradient');
                            }}
                            className="w-20 h-20 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={(() => {
                                if (typeof background === 'object' && background?.type === 'gradient') {
                                  return background.from || customGradientColors?.from || '#000000';
                                }
                                return customGradientColors?.from || '#000000';
                              })()}
                              onChange={(e) => {
                                const from = e.target.value;
                                if (/^#[0-9A-F]{6}$/i.test(from)) {
                                  const to = (typeof background === 'object' && background?.type === 'gradient') 
                                    ? (background.to || customGradientColors?.to || '#ffffff')
                                    : (customGradientColors?.to || '#ffffff');
                                  const newColors = { from, to };
                                  onCustomGradientColorsChange(newColors);
                                  onBackgroundChange({ type: 'gradient', from, to });
                                  onBackgroundTypeChange('gradient');
                                }
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                                bg-white dark:bg-neutral-800
                                text-black dark:text-white
                                font-mono text-sm"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                          To Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={(() => {
                              if (typeof background === 'object' && background?.type === 'gradient') {
                                return background.to || customGradientColors?.to || '#ffffff';
                              }
                              return customGradientColors?.to || '#ffffff';
                            })()}
                            onChange={(e) => {
                              const to = e.target.value;
                              const from = (typeof background === 'object' && background?.type === 'gradient') 
                                ? (background.from || customGradientColors?.from || '#000000')
                                : (customGradientColors?.from || '#000000');
                              const newColors = { from, to };
                              onCustomGradientColorsChange(newColors);
                              onBackgroundChange({ type: 'gradient', from, to });
                              onBackgroundTypeChange('gradient');
                            }}
                            className="w-20 h-20 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={(() => {
                                if (typeof background === 'object' && background?.type === 'gradient') {
                                  return background.to || customGradientColors?.to || '#ffffff';
                                }
                                return customGradientColors?.to || '#ffffff';
                              })()}
                              onChange={(e) => {
                                const to = e.target.value;
                                if (/^#[0-9A-F]{6}$/i.test(to)) {
                                  const from = (typeof background === 'object' && background?.type === 'gradient') 
                                    ? (background.from || customGradientColors?.from || '#000000')
                                    : (customGradientColors?.from || '#000000');
                                  const newColors = { from, to };
                                  onCustomGradientColorsChange(newColors);
                                  onBackgroundChange({ type: 'gradient', from, to });
                                  onBackgroundTypeChange('gradient');
                                }
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                                bg-white dark:bg-neutral-800
                                text-black dark:text-white
                                font-mono text-sm"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Picker */}
                  {currentBackgroundType === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                          Background Image
                        </label>
                        {!customBackgroundImage ? (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700
                              hover:border-neutral-400 dark:hover:border-neutral-600
                              bg-neutral-50 dark:bg-neutral-800/50
                              transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              Choose Image
                            </span>
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative">
                              <img 
                                src={customBackgroundImage} 
                                alt="Background preview" 
                                className="w-full h-48 object-cover rounded-lg border-2 border-neutral-300 dark:border-neutral-700"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                                  bg-white dark:bg-neutral-800/50
                                  transition-colors text-sm font-medium text-black dark:text-white"
                              >
                                Change Image
                              </button>
                              <button
                                onClick={() => {
                                  onCustomBackgroundChange(null);
                                  onBackgroundTypeChange('solid');
                                  onBackgroundChange({ type: 'solid', color: '#000000' });
                                  onCustomSolidColorChange('#000000');
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium
                                  hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Background Blur Slider */}
                      {customBackgroundImage && (
                        <div>
                          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                            Background Blur: {backgroundBlur}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="32"
                            step="1"
                            value={backgroundBlur}
                            onChange={(e) => onBackgroundBlurChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                              [&::-webkit-slider-thumb]:cursor-pointer
                              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
                              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Overlay Opacity Slider */}
                      {customBackgroundImage && (
                        <div>
                          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                            Overlay: {Math.round(backgroundOverlay * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={backgroundOverlay}
                            onChange={(e) => onBackgroundOverlayChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                              [&::-webkit-slider-thumb]:cursor-pointer
                              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
                              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          const imageUrl = event.target?.result;
                          if (imageUrl) {
                            try {
                              // Compress the image before storing
                              const compressedImage = await compressImage(imageUrl);
                              onBackgroundTypeChange('image');
                              onCustomBackgroundChange(compressedImage);
                              onBackgroundChange({ type: 'image', image: compressedImage });
                            } catch (error) {
                              console.error('Error compressing image:', error);
                              // Fall back to uncompressed if compression fails
                              onBackgroundTypeChange('image');
                              onCustomBackgroundChange(imageUrl);
                              onBackgroundChange({ type: 'image', image: imageUrl });
                            }
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Reset Settings View */}
            <div 
              className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                currentCategory === 'reset'
                  ? isTransitioning
                    ? 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0'
              }`}
            >
              <div className="h-full overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">Reset Background</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                      Reset the background to the default solid black color.
                    </p>
                    <button
                      onClick={() => {
                        onResetBackground();
                        handleBack();
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700
                        bg-red-50 dark:bg-red-900/20
                        text-red-700 dark:text-red-400
                        hover:bg-red-100 dark:hover:bg-red-900/30
                        transition-colors font-medium"
                    >
                      Reset Background
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">Reset All Settings</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                      Reset all settings including background and widgets to their default values. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all settings? This will remove all widgets and reset your background. This action cannot be undone.')) {
                          onResetAll();
                          handleBack();
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-red-500 dark:border-red-600
                        bg-red-600 dark:bg-red-700
                        text-white
                        hover:bg-red-700 dark:hover:bg-red-600
                        transition-colors font-medium"
                    >
                      Reset All Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

