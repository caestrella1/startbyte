import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import EditLinkModal from './EditLinkModal';
import SortableLink from './SortableLink';
import SegmentedControl from './ui/SegmentedControl';

const defaultLinks = [
  { href: "https://mail.google.com/", label: "Gmail", icon: "https://www.google.com/favicon.ico" },
  { href: "https://calendar.google.com/", label: "Calendar", icon: "https://calendar.google.com/favicon.ico" },
  { href: "https://github.com/", label: "GitHub", icon: "https://github.com/favicon.ico" },
  { href: "https://www.reddit.com/", label: "Reddit", icon: "https://www.reddit.com/favicon.ico" },
];

const linkStyles = [
  { id: 'pill', label: 'Pill' },
  { id: 'icon', label: 'Icon' }
];

export default function LinksSection({ isEditing }) {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('linkOrder');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [editingLink, setEditingLink] = useState(null);
  const [styleType, setStyleType] = useState(() => {
    return localStorage.getItem('linkStyle') || 'pill';
  });

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  useEffect(() => {
    localStorage.setItem('linkOrder', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('linkStyle', styleType);
  }, [styleType]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.href === active.id);
        const newIndex = items.findIndex((item) => item.href === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSaveLink = (updatedLink) => {
    if (editingLink) {
      setLinks(prev => prev.map(link => 
        link.href === editingLink.href ? updatedLink : link
      ));
    } else {
      setLinks(prev => [...prev, updatedLink]);
    }
    setEditingLink(null);
  };

  const handleDeleteLink = (linkToDelete) => {
    setLinks(prev => prev.filter(link => link.href !== linkToDelete.href));
  };

  const onEditLink = (link) => {
    setEditingLink(link);
  };

  return (
    <>
      {isEditing && (
        <SegmentedControl
          className="mt-4"
          options={linkStyles}
          value={styleType}
          onChange={setStyleType}
        />
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="links mt-8 flex flex-wrap gap-4 justify-center">
          <SortableContext items={links.map(link => link.href)}>
            {links.map(link => (
              <SortableLink 
                key={link.href}
                link={link}
                isEditing={isEditing}
                styleType={styleType}
                onEdit={onEditLink}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      {isEditing && (
        <button
          onClick={() => setEditingLink(false)}
          className="sortable-link mx-auto mt-4">
            + Add Link
        </button>
      )}
      <EditLinkModal
        isOpen={editingLink !== null}
        link={editingLink || { href: '', label: '', icon: '' }}
        onClose={() => setEditingLink(null)}
        onSave={handleSaveLink}
        onDelete={editingLink ? handleDeleteLink : undefined}
      />
    </>
  );
}