import React from 'react';

export default function Widget({ id, type, component: Component, settings, onSettingsChange, isEditing = false }) {
  // LinksWidget should remain interactive in edit mode for its internal drag-and-drop
  const shouldDisablePointerEvents = isEditing && type !== 'links';
  
  return (
    <div className={`${shouldDisablePointerEvents ? 'pointer-events-none' : ''} w-full`}>
      <Component settings={settings} onSettingsChange={onSettingsChange} isEditing={isEditing} />
    </div>
  );
}

