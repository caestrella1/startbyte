import React from 'react';

export default function RenderedIcon({ 
  iconType,
  icon,
  href,
  label,
  isDragging,
  iconError,
  onDrag,
  onDrop,
  onPaste,
  onIconUpdate
}) {
  switch (iconType) {
    case 'none':
      return null;
    case 'favicon':
      return href ? (
        <img
          src={`${new URL(href).origin}/favicon.ico`}
          alt="Favicon preview"
          className="w-12 h-12 object-contain"
        />
      ) : (
        <span className="text-sm text-neutral-500">
          Enter URL first
        </span>
      );
    case 'image':
      return (
        <div
          onDragEnter={(e) => { onDrag(e); setIsDragging(true); }}
          onDragOver={onDrag}
          onDragLeave={(e) => { onDrag(e); setIsDragging(false); }}
          onDrop={onDrop}
          onPaste={onPaste}
          className={`flex flex-col justify-center items-center w-16 h-16 border-2 border-dashed rounded-lg
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : iconError
                ? 'border-red-500'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-blue-500/50'}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onIconUpdate(e.target.files[0])}
            className="hidden"
            id="icon-upload"
          />
          {icon ? (
            <img src={icon} alt={label || 'Icon preview'} className="w-12 h-12 object-contain" />
          ) : (
            <label htmlFor="icon-upload" className="cursor-pointer text-center text-sm text-neutral-500">
              Drop image here
            </label>
          )}
          {iconError && (
            <span className="text-xs text-red-500 mt-1">{iconError}</span>
          )}
        </div>
      );
    case 'url':
      return (
        <input
          type="url"
          value={icon || ''}
          onChange={(e) => onIconUpdate(e.target.value)}
          placeholder="Enter icon URL"
          className="input"
        />
      );
  }
}
