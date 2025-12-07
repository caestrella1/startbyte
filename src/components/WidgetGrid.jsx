import React from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableWidget from './widgets/SortableWidget';

export default function WidgetGrid({ widgets, onWidgetSettingsChange, onWidgetRemove, onWidgetReorder, isEditing = false }) {
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

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full auto-rows-min">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              onWidgetSettingsChange={onWidgetSettingsChange}
              onWidgetRemove={onWidgetRemove}
              isEditing={isEditing}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

