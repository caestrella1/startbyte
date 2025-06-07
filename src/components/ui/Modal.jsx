import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, children }) {
  const [isClosing, setIsClosing] = useState(false);
  const isClosed = !isOpen && !isClosing;

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const startClosing = (e) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
    }
  }

  const finishClosing = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }

  if (isClosed && !isClosing) return null;

  return createPortal(
    <div 
      className="modal__overlay"
      onClick={startClosing}
    >
      <div 
        className={`modal__container animate__animated animate__fast
          ${isClosing ? 'animate__bounceOut' : 'animate__bounceIn'}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={finishClosing}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
