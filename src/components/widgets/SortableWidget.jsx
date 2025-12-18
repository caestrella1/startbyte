import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Widget from './Widget';
import ResizableWidget from './ResizableWidget';
import { widgetRegistry } from './widgetRegistry';
import Popover from '../ui/Popover';

export default function SortableWidget({ widget, onWidgetSettingsChange, onWidgetRemove, isEditing = false, gridColumns = 3, currentlyEditedWidgetId = null, onWidgetSettingsOpen = null, onWidgetSettingsClose = null, isDragOverlay = false }) {
  const widgetDef = widgetRegistry[widget.type];
  if (!widgetDef) return null;

  const widgetWidth = widget.settings?.width || 1;
  const width = Math.min(widgetWidth, gridColumns);
  const height = widget.settings?.height || 1;
  
  // Get min/max dimensions from widget registry, with defaults
  // min defaults to 1, max defaults to gridColumns if null/undefined
  const minWidth = widgetDef.minWidth ?? 1;
  const minHeight = widgetDef.minHeight ?? 1;
  const maxWidth = widgetDef.maxWidth ?? gridColumns;
  const maxHeight = widgetDef.maxHeight ?? gridColumns;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const widgetContainerRef = useRef(null);

  const opacity = isDragging ? 0.3 : (currentlyEditedWidgetId !== null && currentlyEditedWidgetId !== widget.id ? 0.2 : 1);
  
  const style = isDragOverlay ? {
    opacity: 1,
  } : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity,
  };
  const showBackground = widget.settings?.showBackground !== false;
  const hasSettings = widgetDef.component.Settings !== undefined;
  
  const horizontalAlign = widget.settings?.horizontalAlign || 'center';
  const verticalAlign = widget.settings?.verticalAlign || 'center';
  
  const horizontalClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };
  
  const verticalClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  };

  const handleResize = (newWidth, newHeight) => {
    onWidgetSettingsChange(widget.id, {
      ...widget.settings,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleContainerClick = (e) => {
    if (isEditing && hasSettings && !isDragging) {
      // Don't open if clicking on the drag handle
      if (e.target.closest('button[aria-label="Drag widget"]')) {
        return;
      }
      // For LinksWidget, don't open settings if clicking on links or their container
      if (widget.type === 'links') {
        if (e.target.closest('.links') || e.target.closest('.sortable-link') || e.target.closest('button')) {
          return;
        }
      }
      setIsSettingsOpen(true);
    }
  };

  return (
    <ResizableWidget
      width={width}
      height={height}
      onResize={handleResize}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      isEditing={isEditing}
      gridColumns={gridColumns}
    >
      <div
        ref={(node) => {
          setNodeRef(node);
          widgetContainerRef.current = node;
          // Make the container itself the drag activator when in edit mode
          if (isEditing && !isDragOverlay) {
            setActivatorNodeRef(node);
          }
        }}
        style={{ ...style, direction: 'ltr', touchAction: isEditing ? 'none' : 'auto' }}
        onClick={handleContainerClick}
        {...(isEditing && !isDragOverlay ? { ...attributes, ...listeners } : {})}
        className={`widget-container group ${isDragOverlay ? '' : 'transition-opacity duration-200'} ${horizontalClasses[horizontalAlign]} ${verticalClasses[verticalAlign]} ${
          isEditing && hasSettings && !isDragging ? 'cursor-pointer' : ''
        } ${
          isEditing ? 'cursor-grab active:cursor-grabbing' : ''
        } ${
          showBackground
            ? 'widget-container--with-background' 
            : ''
        } ${
          showBackground && !isEditing
            ? 'widget-container--with-background-default'
            : isEditing
            ? 'widget-edit-border'
            : ''
        }`}
      >
        {isEditing && !isDragOverlay && (
          <button
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'none', pointerEvents: 'none' }}
            className="absolute top-2 left-2 w-8 h-8 md:w-6 md:h-6 rounded-full flex items-center justify-center
              bg-white dark:bg-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700
              border border-neutral-300/10 dark:border-neutral-400/40
              text-secondary shadow-md
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
            aria-label="Drag widget"
            tabIndex={-1}
          >
            <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        )}
        <Widget
          id={widget.id}
          type={widget.type}
          component={widgetDef.component}
          settings={{ ...(widget.settings || {}), id: widget.id }}
          onSettingsChange={(newSettings) => onWidgetSettingsChange(widget.id, newSettings)}
          onRemove={() => onWidgetRemove(widget.id)}
          isEditing={isEditing}
        />
        {hasSettings && !isDragOverlay && (
          <Popover 
            isOpen={isSettingsOpen} 
            onClose={() => {
              setIsSettingsOpen(false);
              onWidgetSettingsClose?.();
            }}
            anchorElement={widgetContainerRef.current}
            onOpenChange={(isOpen) => {
              if (isOpen) {
                onWidgetSettingsOpen?.(widget.id);
              }
            }}
          >
            <widgetDef.component.Settings
              settings={widget.settings || {}}
              onSettingsChange={(newSettings) => {
                onWidgetSettingsChange(widget.id, newSettings);
              }}
              onRemove={() => onWidgetRemove(widget.id)}
            />
          </Popover>
        )}
      </div>
    </ResizableWidget>
  );
}

