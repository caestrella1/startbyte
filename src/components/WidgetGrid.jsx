import React, { useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableWidget from './widgets/SortableWidget';

export default function WidgetGrid({ widgets, onWidgetSettingsChange, onWidgetRemove, onWidgetReorder, isEditing = false, gridColumns = 3 }) {
  const gridRef = useRef(null);
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

  // Update grid columns whenever gridColumns changes or on resize
  useEffect(() => {
    if (!gridRef.current) return;
    
    const updateGridColumns = () => {
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
      
      // Apply the grid template columns directly
      gridRef.current.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    };

    // Update immediately
    updateGridColumns();
    
    // Also update on window resize
    window.addEventListener('resize', updateGridColumns);
    
    return () => {
      window.removeEventListener('resize', updateGridColumns);
    };
  }, [cols]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
        <div 
          ref={gridRef}
          className="grid gap-4 w-full auto-rows-min"
        >
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onWidgetSettingsChange={onWidgetSettingsChange}
              onWidgetRemove={onWidgetRemove}
              isEditing={isEditing}
              gridColumns={gridColumns}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

