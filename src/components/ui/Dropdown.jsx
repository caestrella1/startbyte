import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Dropdown({ children, className = '', anchorElement = null, useAnchorWidth = true }) {
  const [position, setPosition] = useState(null);
  const fallbackAnchorRef = useRef(null);

  useEffect(() => {
    // Use provided anchorElement or find the parent of fallback anchor
    const updatePosition = () => {
      const element = anchorElement || fallbackAnchorRef.current?.parentElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [children, anchorElement]);

  const dropdownStyle = position ? {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    ...(useAnchorWidth && { width: `${position.width}px` }),
  } : {};

  return (
    <>
      {!anchorElement && (
        <div ref={fallbackAnchorRef} style={{ position: 'absolute', pointerEvents: 'none' }} />
      )}
      {position && createPortal(
        <ul
          style={dropdownStyle}
          className={`py-2 
            bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm 
            rounded-lg shadow-lg 
            border border-neutral-200 dark:border-neutral-700 
            z-[100] ${className}`}
        >
          {children}
        </ul>,
        document.body
      )}
    </>
  );
}

export function DropdownItem({ children, selected, onClick, className = '' }) {
  return (
    <li
      className={`px-4 py-2 cursor-pointer text-left ${
        selected
          ? 'bg-blue-50 dark:bg-blue-500/80 text-primary--inverse'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-primary'
      } ${className}`}
      onMouseDown={onClick}
    >
      {children}
    </li>
  );
}
