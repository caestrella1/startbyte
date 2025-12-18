import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {
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
      className="modal__overlay"
      onClick={startClosing}
    >
      <div 
        className={`modal__container ${
          isClosing ? 'animate-spring-out' : 'animate-spring-in'
        }`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={finishClosing}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
