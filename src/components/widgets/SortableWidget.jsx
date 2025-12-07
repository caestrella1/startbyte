import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Widget from './Widget';
import ResizableWidget from './ResizableWidget';
import { widgetRegistry } from './widgetRegistry';
import Modal from '../ui/Modal';

export default function SortableWidget({ widget, onWidgetSettingsChange, onWidgetRemove, isEditing = false }) {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const widgetDef = widgetRegistry[widget.type];
  if (!widgetDef) return null;

  const width = widget.settings?.width || 1;
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
      maxWidth={3}
      maxHeight={3}
      isEditing={isEditing}
    >
      <div
        ref={setNodeRef}
        style={style}
        onClick={handleContainerClick}
        className={`rounded-2xl p-6 relative group h-full w-full flex ${horizontalClasses[horizontalAlign]} ${verticalClasses[verticalAlign]} ${
          isEditing && hasSettings ? 'is-editing cursor-pointer' : isEditing ? 'is-editing' : ''
        } ${
          showBackground 
            ? 'bg-white/70 dark:bg-neutral-900/30 shadow-lg backdrop-blur-xl border border-neutral-500 dark:border-white/10' 
            : isEditing 
              ? 'border-2 border-neutral-400 dark:border-neutral-500' 
              : ''
        }`}
      >
        {isEditing && (
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
        )}
        <Widget
          id={widget.id}
          type={widget.type}
          component={widgetDef.component}
          settings={widget.settings || {}}
          onSettingsChange={(newSettings) => onWidgetSettingsChange(widget.id, newSettings)}
          onRemove={() => onWidgetRemove(widget.id)}
          isEditing={isEditing}
        />
        {hasSettings && (
          <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
            <widgetDef.component.Settings
              settings={widget.settings || {}}
              onSettingsChange={(newSettings) => {
                onWidgetSettingsChange(widget.id, newSettings);
              }}
              onRemove={() => onWidgetRemove(widget.id)}
            />
          </Modal>
        )}
      </div>
    </ResizableWidget>
  );
}

