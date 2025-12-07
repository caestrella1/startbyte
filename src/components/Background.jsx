import React from 'react';
import { getStoredImage } from '../utils/imageStorage';

const backgroundStyles = {
  // Legacy solid colors
  'solid-black': { className: 'bg-black', isGradient: false },
  'solid-white': { className: 'bg-white', isGradient: false },
  'solid-red': { className: 'bg-red-600', isGradient: false },
  'solid-orange': { className: 'bg-orange-500', isGradient: false },
  'solid-yellow': { className: 'bg-yellow-400', isGradient: false },
  'solid-green': { className: 'bg-green-600', isGradient: false },
  'solid-blue': { className: 'bg-blue-600', isGradient: false },
  'solid-purple': { className: 'bg-purple-600', isGradient: false },
  'solid-pink': { className: 'bg-pink-500', isGradient: false },
  
  // Legacy gradients
  'gradient-black': { className: 'bg-gradient-to-br from-neutral-400 via-neutral-700 to-black', isGradient: true },
  'gradient-white': { className: 'bg-gradient-to-br from-white via-neutral-200 to-neutral-400', isGradient: true },
  'gradient-red': { className: 'bg-gradient-to-br from-red-300 via-red-600 to-red-900', isGradient: true },
  'gradient-orange': { className: 'bg-gradient-to-br from-orange-200 via-orange-500 to-orange-800', isGradient: true },
  'gradient-yellow': { className: 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700', isGradient: true },
  'gradient-green': { className: 'bg-gradient-to-br from-green-300 via-green-600 to-green-900', isGradient: true },
  'gradient-blue': { className: 'bg-gradient-to-br from-blue-300 via-blue-600 to-blue-900', isGradient: true },
  'gradient-purple': { className: 'bg-gradient-to-br from-purple-300 via-purple-600 to-purple-900', isGradient: true },
  'gradient-pink': { className: 'bg-gradient-to-br from-pink-200 via-pink-500 to-pink-800', isGradient: true },
  
  // Legacy custom
  'custom': { className: '', isGradient: false, isCustom: true },
};

export default function Background({ 
  background = { type: 'solid', color: '#000000' }, 
  backgroundType = 'solid',
  customSolidColor = '#000000',
  customGradientColors = { from: '#000000', to: '#ffffff' },
  customImage = null,
  blur = 16,
  overlay = 0.5
}) {
  // Handle new format (object) or legacy format (string)
  let backgroundStyle = null;
  let isImage = false;
  
  if (typeof background === 'object' && background !== null) {
    // New format
    if (background.type === 'solid') {
      backgroundStyle = { backgroundColor: background.color || customSolidColor };
    } else if (background.type === 'gradient') {
      const from = background.from || customGradientColors?.from || '#000000';
      const to = background.to || customGradientColors?.to || '#ffffff';
      backgroundStyle = { 
        background: `linear-gradient(to bottom right, ${from}, ${to})` 
      };
    } else if (background.type === 'image' || (backgroundType === 'image' && customImage)) {
      isImage = true;
    }
  } else if (typeof background === 'string') {
    // Legacy format
    const style = backgroundStyles[background] || backgroundStyles['solid-black'];
    if (background === 'custom' && customImage) {
      isImage = true;
    } else {
      backgroundStyle = { className: style.className };
    }
  }
  
  // Handle image background
  if (isImage || (backgroundType === 'image' && customImage)) {
    return (
      <>
        <div 
          className="fixed inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${customImage || (background?.image)})` }}
        />
        <div 
          className="fixed inset-0 -z-10"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${overlay})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`
          }}
        />
      </>
    );
  }
  
  // Handle solid or gradient background
  if (backgroundStyle) {
    if (backgroundStyle.className) {
      // Legacy format with className
      return <div className={`fixed inset-0 -z-20 ${backgroundStyle.className}`} />;
    } else {
      // New format with inline styles
      return <div className="fixed inset-0 -z-20" style={backgroundStyle} />;
    }
  }
  
  // Default fallback
  return <div className="fixed inset-0 -z-20 bg-black" />;
}
