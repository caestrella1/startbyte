import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Widget from './Widget';
import ResizableWidget from './ResizableWidget';
import { widgetRegistry } from './widgetRegistry';
import Popover from '../ui/Popover';

export default function SortableWidget({ widget, onWidgetSettingsChange, onWidgetRemove, isEditing = false, gridColumns = 3, currentlyEditedWidgetId = null, onWidgetSettingsOpen = null, onWidgetSettingsClose = null }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const widgetContainerRef = useRef(null);

  // Dim widget if another widget's popover is open
  const shouldDim = currentlyEditedWidgetId !== null && currentlyEditedWidgetId !== widget.id;
  
  // Calculate opacity: dragging takes precedence, then dimming
  const opacity = isDragging ? 0.5 : shouldDim ? 0.2 : 1;
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'opacity 0.2s ease-in-out',
    opacity,
  };

  const widgetDef = widgetRegistry[widget.type];
  if (!widgetDef) return null;

  // Clamp width to current grid size
  const widgetWidth = widget.settings?.width || 1;
  const width = Math.min(widgetWidth, gridColumns);
  const height = widget.settings?.height || 1;
  const showBackground = widget.settings?.showBackground !== false; // Default to true
  const hasSettings = widgetDef.component.Settings !== undefined;
  
  // Alignment settings
  const horizontalAlign = widget.settings?.horizontalAlign || 'center';
  const verticalAlign = widget.settings?.verticalAlign || 'center';
  
  // Map alignment values to Tailwind classes
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
    if (isEditing && hasSettings) {
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
      minWidth={1}
      minHeight={1}
      maxWidth={gridColumns}
      maxHeight={3}
      isEditing={isEditing}
      gridColumns={gridColumns}
    >
      <div
        ref={(node) => {
          setNodeRef(node);
          widgetContainerRef.current = node;
        }}
        style={style}
        onClick={handleContainerClick}
        className={`widget-container group transition-opacity duration-200 ${horizontalClasses[horizontalAlign]} ${verticalClasses[verticalAlign]} ${
          isEditing && hasSettings ? 'cursor-pointer' : ''
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
        {isEditing && (
          <>
            <button
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center
                bg-white dark:bg-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700
                border border-neutral-300/10 dark:border-neutral-400/40
                text-neutral-600 dark:text-neutral-400 shadow-md
                opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-grab active:cursor-grabbing"
              aria-label="Drag widget"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </>
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
        {hasSettings && (
          <Popover 
            isOpen={isSettingsOpen} 
            onClose={() => {
              setIsSettingsOpen(false);
              // Notify parent immediately when closing
              if (onWidgetSettingsClose) {
                onWidgetSettingsClose();
              }
            }}
            anchorElement={widgetContainerRef.current}
            onOpenChange={(isOpen) => {
              // Notify parent when popover opens
              if (isOpen && onWidgetSettingsOpen) {
                onWidgetSettingsOpen(widget.id);
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

