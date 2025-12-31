import React, { useEffect, useRef, useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableWidget from 'widgets/SortableWidget';

export default function WidgetGrid({ widgets, onWidgetSettingsChange, onWidgetRemove, onWidgetReorder, isEditing = false, gridColumnsSmall = 1, gridColumnsMedium = 2, gridColumnsLarge = 6, widgetAlignmentHorizontal = 'left', widgetAlignmentVertical = 'center', currentlyEditedWidgetId = null, onWidgetSettingsOpen = null, onWidgetSettingsClose = null }) {
  const gridRef = useRef(null);
  const [actualColumns, setActualColumns] = React.useState(1);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      onWidgetReorder(newWidgets);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Update grid columns and rows whenever gridColumns changes or on resize
  useEffect(() => {
    if (!gridRef.current) return;
    
    const updateGrid = () => {
      if (!gridRef.current) return;
      const width = window.innerWidth;
      
      let columns;
      if (width >= 1024) {
        // Large screens: use the large column count
        columns = gridColumnsLarge;
      } else if (width >= 640) {
        // Medium screens: use the medium column count
        columns = gridColumnsMedium;
      } else {
        // Small screens: use the small column count
        columns = gridColumnsSmall;
      }
      
      // Update actual columns state
      setActualColumns(columns);
      
      // Calculate row height to make widgets square (height = width)
      // Row height = column width (accounting for gaps)
      const containerWidth = gridRef.current.offsetWidth;
      const gap = 16; // gap-4 = 16px
      const numGaps = columns - 1;
      const columnWidth = (containerWidth - (numGaps * gap)) / columns;
      const rowHeight = columnWidth;
      
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
  }, [gridColumnsSmall, gridColumnsMedium, gridColumnsLarge]);

  const activeWidget = widgets.find(w => w.id === activeId);

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToFirstScrollableAncestor]}
    >
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
        <div 
          ref={gridRef}
          className="grid gap-4 w-full overflow-visible"
          style={{
            direction: widgetAlignmentHorizontal === 'right' ? 'rtl' : 'ltr',
          }}
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
      <DragOverlay dropAnimation={null}>
        {activeId && activeWidget ? (
          <SortableWidget
            widget={activeWidget}
            onWidgetSettingsChange={onWidgetSettingsChange}
            onWidgetRemove={onWidgetRemove}
            isEditing={isEditing}
            gridColumns={actualColumns}
            currentlyEditedWidgetId={currentlyEditedWidgetId}
            onWidgetSettingsOpen={onWidgetSettingsOpen}
            onWidgetSettingsClose={onWidgetSettingsClose}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

