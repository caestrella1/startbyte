import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function BottomSheet({ isOpen, onClose, children }) {
  const [isClosing, setIsClosing] = useState(false);
  const isClosed = !isOpen && !isClosing;

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const startClosing = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      setIsClosing(true);
    }
  }

  const finishClosing = () => {
    if (isClosing) {
      setIsClosing(false);
      // Use setTimeout to prevent event propagation issues
      setTimeout(() => {
        onClose();
      }, 0);
    }
  }

  if (isClosed && !isClosing) return null;

  return createPortal(
    <div 
      className={`bottomsheet__overlay ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={startClosing}
    >
      <div 
        className={`bottomsheet__container ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={finishClosing}
      >
        <div className="bottomsheet__handle" />
        {children}
      </div>
    </div>,
    document.body
  );
}

