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

export default function LinksSection({ isEditing, styleType }) {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('linkOrder');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [editingLink, setEditingLink] = useState(null);
  const linksContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  useEffect(() => {
    localStorage.setItem('linkOrder', JSON.stringify(links));
  }, [links]);

  // Add effect to measure height when style, links, or isEditing changes
  useEffect(() => {
    const updateHeight = () => {
      if (linksContainerRef.current) {
        setContainerHeight(`${linksContainerRef.current.scrollHeight}px`);
      }
    };
    
    // Use ResizeObserver for more reliable height updates
    let resizeObserver;
    if (linksContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      resizeObserver.observe(linksContainerRef.current);
    }
    
    // Initial update
    updateHeight();
    
    // Also update on window resize as fallback
    window.addEventListener('resize', updateHeight);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateHeight);
    };
  }, [styleType, links, isEditing]);

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
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="transition-[height] duration-300 ease-spring min-w-0 w-full" style={{ height: containerHeight }}>
          <div ref={linksContainerRef} className="links mt-8 flex flex-wrap gap-4 justify-center min-w-0 w-full">
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