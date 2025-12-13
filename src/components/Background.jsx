import React from 'react';
import defaultConfig from '../config/defaults.json';

export default function Background({ 
  background, 
  backgroundType,
  customSolidColor,
  customGradientColors,
  customImage,
  blur,
  overlay
}) {
  // Use defaults from config if props are not provided
  const effectiveBackground = background || defaultConfig.background;
  const effectiveBackgroundType = backgroundType || defaultConfig.backgroundType;
  const effectiveSolidColor = customSolidColor || defaultConfig.customSolidColor;
  const effectiveGradientColors = customGradientColors || defaultConfig.customGradientColors;
  const effectiveImage = customImage || defaultConfig.customBackgroundImage;
  const effectiveBlur = blur !== undefined ? blur : defaultConfig.backgroundBlur;
  const effectiveOverlay = overlay !== undefined ? overlay : defaultConfig.backgroundOverlay;
  
  // Handle image background
  if (effectiveBackgroundType === 'image' && effectiveImage) {
    return (
      <>
        <div 
          className="fixed inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${effectiveImage})` }}
        />
        <div 
          className="fixed inset-0 -z-10"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${effectiveOverlay})`,
            backdropFilter: `blur(${effectiveBlur}px)`,
            WebkitBackdropFilter: `blur(${effectiveBlur}px)`
          }}
        />
      </>
    );
  }
  
  // Handle gradient background
  if (effectiveBackgroundType === 'gradient') {
    const from = effectiveGradientColors?.from || '#000000';
    const to = effectiveGradientColors?.to || '#ffffff';
    return (
      <div 
        className="fixed inset-0 -z-20" 
        style={{ 
          background: `linear-gradient(to bottom right, ${from}, ${to})` 
        }} 
      />
    );
  }
  
  // Handle solid background (default)
  const backgroundColor = effectiveBackground?.color || effectiveSolidColor || '#000000';
  return (
    <div 
      className="fixed inset-0 -z-20" 
      style={{ backgroundColor }} 
    />
  );
}
