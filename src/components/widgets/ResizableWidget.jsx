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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);

  const handleMouseDown = (e, handle) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setStartSize({ width, height });
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      // Calculate grid units - more accurate calculation
      // Use the actual grid column count
      const container = widgetRef.current?.parentElement;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const gap = 16; // gap-4 = 16px
      const numGaps = gridColumns - 1;
      const gridColumnSize = (containerWidth - (numGaps * gap)) / gridColumns;
      const gridRowSize = 200; // Approximate row height
      
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

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, startPos, startSize, minWidth, minHeight, maxWidth, maxHeight, onResize]);

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
        <div className="widget-grabber" />
      )}
      {isEditing && (
        <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto z-30">
          <div
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
            className="absolute top-0 left-0 w-5 h-5 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-nw-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
            className="absolute top-0 right-0 w-5 h-5 translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-ne-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
            className="absolute bottom-0 left-0 w-5 h-5 -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-sw-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
          <div
            onMouseDown={(e) => handleMouseDown(e, 'se')}
            className="absolute bottom-0 right-0 w-5 h-5 translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-se-resize"
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg hover:bg-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
}

