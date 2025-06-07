import React from 'react';
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
  } = useSortable({
    id: link.href,
    disabled: !isEditing,
    // animateLayoutChanges: () => true,
  });

  const commonProps = {
    ref: setNodeRef,
    style: transform ? {
      transform: CSS.Transform.toString(transform),
      transition,
    } : undefined,
    ...(isEditing ? attributes : {}),
    ...(isEditing ? listeners : {})
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
