import React, { useState, useEffect, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import EditLinkModal from '../EditLinkModal';
import SortableLink from '../SortableLink';
import SegmentedControl from '../ui/SegmentedControl';
import AlignmentPicker from '../ui/AlignmentPicker';
import Switch from '../ui/Switch';
import defaultConfig from '../../config/defaults.json';

const linkStyles = [
  { id: 'pill', label: 'Pill' },
  { id: 'icon', label: 'Icon' }
];

export default function LinksWidget({ settings = {}, onSettingsChange, isEditing = false }) {
  const widgetId = settings.id || 'links';
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem(`linkOrder-${widgetId}`);
    let linkList;
    if (saved) {
      linkList = JSON.parse(saved);
    } else {
      // Get default links from widget settings or fallback to defaults.json
      linkList = settings.defaultLinks || defaultConfig.widgets.find(w => w.type === 'links')?.settings?.defaultLinks || [];
    }
    // Ensure all links have a unique ID (for backward compatibility)
    return linkList.map((link, index) => ({
      ...link,
      id: link.id || `${link.href}-${index}-${Date.now()}`
    }));
  });
  const [editingLink, setEditingLink] = useState(null);
  const linksContainerRef = useRef(null);
  const widgetContainerRef = useRef(null);
  const [shouldScrollHorizontally, setShouldScrollHorizontally] = useState(false);
  const styleType = settings.styleType || 'icon';
  const widgetWidth = settings.width || 1;
  const widgetHeight = settings.height || 1;
  const title = settings.title || '';
  const showTitle = settings.showTitle !== false && title; // Show title if enabled and title exists

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  useEffect(() => {
    localStorage.setItem(`linkOrder-${widgetId}`, JSON.stringify(links));
  }, [links, widgetId]);


  useEffect(() => {
    const updateLayout = () => {
      if (!linksContainerRef.current || !widgetContainerRef.current) return;
      
      const container = widgetContainerRef.current;
      
      // Get the available height for links (excluding title if shown)
      const titleHeight = showTitle ? 48 : 0; // mb-4 = 16px + text height ~32px
      const availableHeight = container.offsetHeight - titleHeight;
      
      // Calculate row height based on style type
      // For icon style: each icon container is w-24 (96px) height
      // For pill style: depends on content, but roughly ~40px height
      const rowHeight = styleType === 'icon' ? 96 : 40;
      
      // Use configured link rows, defaulting to widgetHeight
      const targetRows = settings.linkRows || widgetHeight;
      
      // Calculate how many icons fit per row based on container width
      const containerWidth = container.offsetWidth;
      const iconWidth = styleType === 'icon' ? 96 : 120; // Approximate width per icon/pill
      const gap = 16; // gap-4 = 16px
      const iconsPerRow = Math.max(1, Math.floor((containerWidth + gap) / (iconWidth + gap)));
      
      // Total icons that can fit in the target number of rows
      const totalIconsThatFit = targetRows * iconsPerRow;
      
      // Total icons including the "Add Link" button if in edit mode
      const totalItems = links.length + (isEditing ? 1 : 0);
      
      // Enable horizontal scrolling if we have more items than can fit in target rows
      setShouldScrollHorizontally(totalItems > totalIconsThatFit);
    };
    
    let resizeObserver;
    let widgetResizeObserver;
    
    // Observe the links container for content changes
    if (linksContainerRef.current) {
      resizeObserver = new ResizeObserver(updateLayout);
      resizeObserver.observe(linksContainerRef.current);
    }
    
    // Observe the widget container for size changes (when widget is resized)
    if (widgetContainerRef.current) {
      widgetResizeObserver = new ResizeObserver(updateLayout);
      widgetResizeObserver.observe(widgetContainerRef.current);
    }
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (widgetResizeObserver) {
        widgetResizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateLayout);
    };
  }, [styleType, links, isEditing, widgetWidth, widgetHeight, showTitle, settings.linkRows]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleSaveLink = (updatedLink) => {
    if (editingLink) {
      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? { ...updatedLink, id: link.id } : link
      ));
    } else {
      // Generate a unique ID for new links
      const newLink = {
        ...updatedLink,
        id: `${updatedLink.href}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setLinks(prev => [...prev, newLink]);
    }
    setEditingLink(null);
  };

  const handleDeleteLink = (linkToDelete) => {
    setLinks(prev => prev.filter(link => link.id !== linkToDelete.id));
  };

  const horizontalAlign = settings.horizontalAlign || 'center';
  const titleAlignClass = horizontalAlign === 'left' ? 'text-left' : 
                         horizontalAlign === 'right' ? 'text-right' : 'text-center';
  const linksJustifyClass = horizontalAlign === 'left' ? 'justify-start' : 
                            horizontalAlign === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div ref={widgetContainerRef} className="w-full h-full flex flex-col min-w-0">
      {showTitle && (
        <div className={`text-lg font-semibold dark:text-white mb-4 ${titleAlignClass} flex-shrink-0`}>
          {title}
        </div>
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={`transition-all duration-300 ease-spring min-w-0 w-full flex-1 ${
          shouldScrollHorizontally 
            ? 'overflow-x-auto overflow-y-hidden' 
            : 'overflow-x-hidden overflow-y-hidden'
        }`}>
          <div 
            ref={linksContainerRef} 
            className={`links flex gap-4 ${linksJustifyClass} ${
              shouldScrollHorizontally ? 'flex-nowrap min-w-max' : 'flex-wrap w-full'
            } items-start`}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: shouldScrollHorizontally ? 'nowrap' : 'wrap',
              maxHeight: '100%'
            }}
          >
            <SortableContext items={links.map(link => link.id)}>
              {links.map(link => (
                <SortableLink 
                  key={link.id}
                  link={link}
                  isEditing={isEditing}
                  styleType={styleType}
                  onEdit={(link) => setEditingLink(link)}
                />
              ))}
            </SortableContext>
            {isEditing && (
              styleType === 'icon' ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingLink(false);
                  }}
                  className="relative group w-24 h-full flex items-start justify-center"
                >
                  <div className="flex flex-col items-center justify-start gap-2 px-4 py-3 rounded-xl hover:bg-black/30 hover:dark:bg-white/40 w-full h-full cursor-pointer">
                    <div className="w-[50%] h-[50%] max-w-14 max-h-14 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs text-center font-medium line-clamp-2 w-full leading-tight text-secondary">
                      Add Link
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingLink(false);
                  }}
                  className="sortable-link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Link
                </button>
              )
            )}
          </div>
        </div>
      </DndContext>
      <EditLinkModal
        isOpen={editingLink !== null}
        link={editingLink || { href: '', label: '', icon: '', iconType: 'favicon' }}
        onClose={() => {
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
        onDelete={editingLink ? handleDeleteLink : undefined}
      />
    </div>
  );
}

LinksWidget.Settings = function LinksSettings({ settings = {}, onSettingsChange, onRemove }) {
  const styleType = settings.styleType || 'pill';
  const widgetHeight = settings.height || 1;
  const linkRows = settings.linkRows || widgetHeight;
  const showTitle = settings.showTitle !== false;

  // Clamp linkRows to widgetHeight if widget was resized smaller
  useEffect(() => {
    if (linkRows > widgetHeight) {
      onSettingsChange({ ...settings, linkRows: Math.min(linkRows, widgetHeight) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetHeight]);

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Links Settings</h2>
      <div className="space-y-4">
        <div>
          <Switch
            checked={showTitle}
            onChange={(checked) => onSettingsChange({ ...settings, showTitle: checked })}
            label="Show title"
          />
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showTitle ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              Widget Title
            </label>
            <input
              type="text"
              value={settings.title || ''}
              onChange={(e) => onSettingsChange({ ...settings, title: e.target.value })}
              placeholder="Enter widget title"
              className="form-input"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Link Rows: {linkRows}
          </label>
          <input
            type="range"
            min="1"
            max={widgetHeight}
            value={linkRows}
            onChange={(e) => {
              const newRows = parseInt(e.target.value, 10);
              onSettingsChange({ ...settings, linkRows: newRows });
            }}
            className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>1</span>
            <span>{widgetHeight}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Alignment
          </label>
          <AlignmentPicker
            horizontalAlign={settings.horizontalAlign || 'center'}
            verticalAlign={settings.verticalAlign || 'center'}
            onChange={({ horizontalAlign, verticalAlign }) => 
              onSettingsChange({ ...settings, horizontalAlign, verticalAlign })
            }
          />
        </div>
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
          <Switch
            checked={settings.showBackground !== false}
            onChange={(checked) => onSettingsChange({ ...settings, showBackground: checked })}
            label="Show background"
          />
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

