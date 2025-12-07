import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SegmentedControl from './ui/SegmentedControl';

const linkStyles = [
  { id: 'pill', label: 'Pill' },
  { id: 'icon', label: 'Icon' }
];

export default function Settings({ isOpen, onClose, linkStyle, onLinkStyleChange }) {
  const [isClosing, setIsClosing] = useState(false);
  const isClosed = !isOpen && !isClosing;

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

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
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">Settings</h2>
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
          
          <div className="flex-1">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-black dark:text-white">
                Link Style
              </label>
              <SegmentedControl
                options={linkStyles}
                value={linkStyle}
                onChange={onLinkStyleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

