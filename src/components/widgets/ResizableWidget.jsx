import React, { useState, useRef, useEffect } from 'react';

export default function ResizableWidget({ 
  children, 
  width = 1, 
  height = 1, 
  onResize,
  minWidth = 1,
  minHeight = 1,
  maxWidth = 3,
  maxHeight = 3,
  isEditing = false,
  gridColumns = 3
}) {
  const widgetRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleStart = (e, handle) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setStartSize({ width, height });
    
    // Support both mouse and touch events
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    setStartPos({ x: clientX, y: clientY });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e) => {
      // Support both mouse and touch events
      const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;
      
      // Calculate grid units - use actual grid dimensions
      const container = widgetRef.current?.parentElement;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const gap = 16; // gap-4 = 16px
      const numGaps = gridColumns - 1;
      const gridColumnSize = (containerWidth - (numGaps * gap)) / gridColumns;
      
      // Get the actual row height from the grid's computed style
      const computedStyle = window.getComputedStyle(container);
      const gridAutoRows = computedStyle.gridAutoRows;
      // Parse the row height (e.g., "200px" -> 200)
      const gridRowSize = parseFloat(gridAutoRows) || gridColumnSize;
      
      let newWidth = startSize.width;
      let newHeight = startSize.height;

      if (resizeHandle === 'se' || resizeHandle === 'e' || resizeHandle === 'ne') {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startSize.width + Math.round(deltaX / gridColumnSize)));
      }
      if (resizeHandle === 'sw' || resizeHandle === 'w' || resizeHandle === 'nw') {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startSize.width - Math.round(deltaX / gridColumnSize)));
      }
      if (resizeHandle === 'se' || resizeHandle === 's' || resizeHandle === 'sw') {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startSize.height + Math.round(deltaY / gridRowSize)));
      }
      if (resizeHandle === 'ne' || resizeHandle === 'n' || resizeHandle === 'nw') {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startSize.height - Math.round(deltaY / gridRowSize)));
      }

      if (newWidth !== startSize.width || newHeight !== startSize.height) {
        onResize(newWidth, newHeight);
      }
    };

    const handleEnd = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    // Add both mouse and touch event listeners
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, resizeHandle, startPos, startSize, minWidth, minHeight, maxWidth, maxHeight, onResize, gridColumns]);

  return (
    <div
      ref={widgetRef}
      className="relative"
      style={{
        gridColumn: `span ${width}`,
        gridRow: `span ${height}`,
      }}
    >
      {children}
      {isEditing && (
        <div 
          className="widget-grabber"
          onMouseDown={(e) => handleStart(e, 'se')}
          onTouchStart={(e) => handleStart(e, 'se')}
          style={{ cursor: 'se-resize' }}
        />
      )}
      {isEditing && (
        <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto z-30 hidden md:block">
          <div
            onMouseDown={(e) => handleStart(e, 'nw')}
            className="absolute top-0 left-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 z-30 transition-opacity pointer-events-auto cursor-nw-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleStart(e, 'ne')}
            className="absolute top-0 right-0 w-5 h-5 translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 z-30 transition-opacity pointer-events-auto cursor-ne-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleStart(e, 'sw')}
            className="absolute bottom-0 left-0 w-5 h-5 -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 z-30 transition-opacity pointer-events-auto cursor-sw-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleStart(e, 'se')}
            className="absolute bottom-0 right-0 w-5 h-5 translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 z-30 transition-opacity pointer-events-auto cursor-se-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
}

