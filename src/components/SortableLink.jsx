import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PillLink from './links/PillLink';
import IconLink from './links/IconLink';

const SortableLink = ({ link, isEditing, styleType, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.href,
    disabled: !isEditing,
    // animateLayoutChanges: () => true,
  });

  const mouseDownRef = useRef({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (isDragging) {
      hasMovedRef.current = true;
    }
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (isEditing) {
      mouseDownRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
      hasMovedRef.current = false;
    }
  };

  const handleMouseMove = (e) => {
    if (isEditing && mouseDownRef.current.x !== 0) {
      const deltaX = Math.abs(e.clientX - mouseDownRef.current.x);
      const deltaY = Math.abs(e.clientY - mouseDownRef.current.y);
      // If moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        hasMovedRef.current = true;
      }
    }
  };

  const handleMouseUp = (e) => {
    if (isEditing && !hasMovedRef.current && !isDragging) {
      // It was a click, not a drag
      const timeSinceDown = Date.now() - mouseDownRef.current.time;
      // Only treat as click if it was quick (< 300ms) and no movement
      if (timeSinceDown < 300 && mouseDownRef.current.time > 0) {
        e.preventDefault();
        e.stopPropagation();
        // Use setTimeout to ensure the event has fully propagated before opening modal
        setTimeout(() => {
          onEdit(link);
        }, 0);
        return;
      }
    }
    // Reset
    mouseDownRef.current = { x: 0, y: 0, time: 0 };
    hasMovedRef.current = false;
  };

  const commonProps = {
    ref: setNodeRef,
    style: transform ? {
      transform: CSS.Transform.toString(transform),
      transition,
    } : undefined,
    ...(isEditing ? attributes : {}),
    ...(isEditing ? {
      ...listeners,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    } : listeners)
  };

  const LinkComponent = styleType === 'icon' ? IconLink : PillLink;
  return (
    <LinkComponent
      link={link}
      commonProps={commonProps}
      isEditing={isEditing}
      onEdit={() => onEdit(link)}
    />
  );
};

export default SortableLink;
