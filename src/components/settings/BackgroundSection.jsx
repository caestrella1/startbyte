import React, { useRef } from 'react';
import SegmentedControl from 'ui/SegmentedControl';
import { ImageIcon } from 'assets/icons';
import { compressImage } from 'utils/imageStorage';

const backgroundTypeOptions = [
  { id: 'solid', label: 'Solid' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'image', label: 'Image' },
];

export default function BackgroundSection({
  background,
  backgroundType,
  customSolidColor,
  customGradientColors,
  customBackgroundImage,
  backgroundBlur,
  backgroundOverlay,
  onBackgroundChange,
  onBackgroundTypeChange,
  onCustomSolidColorChange,
  onCustomGradientColorsChange,
  onCustomBackgroundChange,
  onBackgroundBlurChange,
  onBackgroundOverlayChange,
}) {
  const fileInputRef = useRef(null);

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

  return (
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
            <label className="block text-sm font-medium mb-3 text-primary">
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
                  className="form-input font-mono"
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
            <label className="block text-sm font-medium mb-3 text-primary">
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
                  className="form-input font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3 text-primary">
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
                  className="form-input font-mono"
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
            <label className="block text-sm font-medium mb-3 text-primary">
              Wallpaper Image
            </label>
            {!customBackgroundImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700
                  hover:border-neutral-400 dark:hover:border-neutral-600
                  bg-neutral-50 dark:bg-neutral-800/50
                  transition-colors flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5 text-secondary" />
                <span className="text-sm text-secondary">
                  Choose Image
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <img 
                    src={customBackgroundImage} 
                    alt="Wallpaper preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-neutral-300 dark:border-neutral-700"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
                      hover:bg-neutral-100 dark:hover:bg-neutral-800
                      bg-white dark:bg-neutral-800/50
                      transition-colors text-sm font-medium text-primary"
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

          {/* Wallpaper Blur Slider */}
          {customBackgroundImage && (
            <div>
              <label className="block text-sm font-medium mb-3 text-primary">
                Wallpaper Blur: {backgroundBlur}px
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
              <label className="block text-sm font-medium mb-3 text-primary">
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
  );
}

