import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import EditLinkModal from '../EditLinkModal';
import SortableLink from '../SortableLink';
import SegmentedControl from '../ui/SegmentedControl';

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

export default function LinksWidget({ settings = {}, onSettingsChange, isEditing = false }) {
  const widgetId = settings.id || 'links';
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem(`linkOrder-${widgetId}`);
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [editingLink, setEditingLink] = useState(null);
  const linksContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('auto');
  const styleType = settings.styleType || 'pill';

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  useEffect(() => {
    localStorage.setItem(`linkOrder-${widgetId}`, JSON.stringify(links));
  }, [links, widgetId]);


  useEffect(() => {
    const updateHeight = () => {
      if (linksContainerRef.current) {
        setContainerHeight(`${linksContainerRef.current.scrollHeight}px`);
      }
    };
    
    let resizeObserver;
    if (linksContainerRef.current) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(linksContainerRef.current);
    }
    
    updateHeight();
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
  };

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

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="transition-[height] duration-300 ease-spring min-w-0 w-full" style={{ height: containerHeight }}>
          <div ref={linksContainerRef} className="links flex flex-wrap gap-4 justify-center min-w-0 w-full">
            <SortableContext items={links.map(link => link.href)}>
              {links.map(link => (
                <SortableLink 
                  key={link.href}
                  link={link}
                  isEditing={isEditing}
                  styleType={styleType}
                  onEdit={(link) => setEditingLink(link)}
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

LinksWidget.Settings = function LinksSettings({ settings = {}, onSettingsChange, onRemove }) {
  const styleType = settings.styleType || 'pill';

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Links Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Link Style
          </label>
          <SegmentedControl
            options={linkStyles}
            value={styleType}
            onChange={(value) => onSettingsChange({ ...settings, styleType: value })}
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showBackground !== false}
              onChange={(e) => onSettingsChange({ ...settings, showBackground: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show background</span>
          </label>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn-danger w-full mt-4"
          >
            Remove Widget
          </button>
        )}
      </div>
    </div>
  );
};

