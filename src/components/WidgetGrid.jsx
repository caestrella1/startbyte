import React, { useEffect, useRef, useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableWidget from './widgets/SortableWidget';

export default function WidgetGrid({ widgets, onWidgetSettingsChange, onWidgetRemove, onWidgetReorder, isEditing = false, gridColumns = 3, rowHeight = 120, currentlyEditedWidgetId = null, onWidgetSettingsOpen = null, onWidgetSettingsClose = null }) {
  const gridRef = useRef(null);
  const [actualColumns, setActualColumns] = React.useState(1);
  const cols = Number(gridColumns) || 3;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      onWidgetReorder(newWidgets);
    }
  };

  // Update grid columns and rows whenever gridColumns changes or on resize
  useEffect(() => {
    if (!gridRef.current) return;
    
    const updateGrid = () => {
      if (!gridRef.current) return;
      const width = window.innerWidth;
      
      let columns;
      if (width >= 1024) {
        // Large screens: use the selected column count
        columns = cols;
      } else if (width >= 640) {
        // Medium screens: 2 columns
        columns = 2;
      } else {
        // Small screens: 1 column
        columns = 1;
      }
      
      // Update actual columns state
      setActualColumns(columns);
      
      // Apply the grid template columns and rows
      gridRef.current.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      gridRef.current.style.gridAutoRows = `${rowHeight}px`;
    };

    // Update immediately
    updateGrid();
    
    // Also update on window resize
    window.addEventListener('resize', updateGrid);
    
    return () => {
      window.removeEventListener('resize', updateGrid);
    };
  }, [cols, rowHeight]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
        <div 
          ref={gridRef}
          className="grid gap-4 w-full"
        >
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onWidgetSettingsChange={onWidgetSettingsChange}
              onWidgetRemove={onWidgetRemove}
              isEditing={isEditing}
              gridColumns={actualColumns}
              currentlyEditedWidgetId={currentlyEditedWidgetId}
              onWidgetSettingsOpen={onWidgetSettingsOpen}
              onWidgetSettingsClose={onWidgetSettingsClose}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

