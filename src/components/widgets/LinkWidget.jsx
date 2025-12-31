import React, { useState, useEffect } from 'react';
import AlignmentPicker from 'ui/AlignmentPicker';
import Switch from 'ui/Switch';
import SegmentedControl from 'ui/SegmentedControl';
import { PlusIcon } from 'assets/icons';

const iconTypes = [
  { id: 'none', label: 'None' },
  { id: 'favicon', label: 'Favicon' },
  { id: 'url', label: 'URL' }
];

export default function LinkWidget({ settings = {}, isEditing = false }) {
  const [iconError, setIconError] = useState(false);
  const link = settings.link || null;
  const horizontalAlign = settings.horizontalAlign || 'center';
  
  const alignClass = horizontalAlign === 'left' ? 'justify-start' : 
                     horizontalAlign === 'right' ? 'justify-end' : 'justify-center';

  // Reset error state when link changes
  useEffect(() => {
    setIconError(false);
  }, [link?.icon]);

  // Empty state when no link is configured
  if (!link || !link.href) {
    return (
      <div className={`w-full h-full flex items-center ${alignClass}`}>
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-3">
          <PlusIcon className="w-8 h-8 text-secondary" />
          <span className="text-xs text-center font-medium text-secondary">
            Configure link in settings
          </span>
        </div>
      </div>
    );
  }

  // Render the icon link inline
  return (
    <div className={`w-full h-full flex items-center ${alignClass}`}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-24 h-full flex items-start justify-center"
      >
        <div className="flex flex-col items-center justify-start gap-2 px-4 py-3 w-full h-full">
          <div className="w-full flex items-center justify-center flex-shrink-0">
            {link.icon && !iconError ? (
              <img
                src={link.icon}
                alt={link.label}
                className="w-12 max-w-full h-12 max-h-full object-contain rounded-lg"
                onError={() => setIconError(true)}
              />
            ) : (
              <div className="w-full h-full aspect-square rounded-2xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-primary text-lg font-bold">
                {link.label?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <span className="text-sm text-center font-medium line-clamp-2 w-full leading-tight text-primary">
            {link.label || 'Link'}
          </span>
        </div>
      </a>
    </div>
  );
}

LinkWidget.Settings = function LinkSettings({ settings = {}, onSettingsChange, onRemove }) {
  const link = settings.link || { href: '', label: '', icon: '', iconType: 'favicon' };
  // Use settings as a stable reference to detect when we're editing a different widget
  const settingsRef = React.useRef(settings);

  const [label, setLabel] = useState(link.label || '');
  const [href, setHref] = useState(link.href || '');
  const [icon, setIcon] = useState(link.icon || '');
  const [iconType, setIconType] = useState(link.iconType || 'favicon');

  // Update local state when we're editing a different widget or when settings change
  useEffect(() => {
    // Reset state if settings object changed (different widget being edited)
    if (settingsRef.current !== settings) {
      settingsRef.current = settings;
      setLabel(settings.link?.label || '');
      setHref(settings.link?.href || '');
      setIcon(settings.link?.icon || '');
      setIconType(settings.link?.iconType || 'favicon');
      return;
    }

    if (settings.link) {
      setLabel(settings.link.label || '');
      setHref(settings.link.href || '');
      setIcon(settings.link.icon || '');
      
      // Use iconType from link if provided, otherwise detect it
      if (settings.link.iconType) {
        setIconType(settings.link.iconType);
      } else if (!settings.link.icon && !settings.link.href) {
        setIconType('favicon');
      } else if (!settings.link.icon) {
        setIconType('none');
      } else if (settings.link.href) {
        try {
          const origin = new URL(settings.link.href).origin;
          const faviconUrl = `${origin}/favicon.ico`;
          if (settings.link.icon === faviconUrl) {
            setIconType('favicon');
          } else {
            setIconType('url');
          }
        } catch (err) {
          setIconType('url');
        }
      } else {
        setIconType('url');
      }
    }
  }, [settings]);

  // Auto-save link changes (only when this specific widget's values change)
  useEffect(() => {
    // Skip auto-save if we're still initializing from settings
    if (settingsRef.current !== settings) {
      return;
    }

    const finalIcon = iconType === 'favicon'
      ? href ? (() => {
          try {
            return `${new URL(href).origin}/favicon.ico`;
          } catch {
            return '';
          }
        })() : ''
      : iconType === 'none' ? null : icon;

    const updatedLink = href ? {
      label,
      href,
      icon: finalIcon,
      iconType
    } : null;

    // Only update if there's a real change
    if (JSON.stringify(settings.link) !== JSON.stringify(updatedLink)) {
      onSettingsChange({
        ...settings,
        link: updatedLink
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, href, icon, iconType, settings]);

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Link Settings</h2>
      <div className="space-y-4">
        {/* Link Configuration */}
        <div>
          <label className="block text-sm font-medium mb-1 text-primary">Name</label>
          <input
            type="text"
            value={label}
            placeholder="Google"
            onChange={(e) => setLabel(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-primary">URL</label>
          <input
            type="url"
            value={href}
            placeholder="https://www.google.com"
            onChange={(e) => setHref(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <p className="text-left text-sm font-medium mb-3 text-primary">Icon Type</p>
          <SegmentedControl
            options={iconTypes}
            value={iconType}
            onChange={setIconType}
          />
          {iconType === 'url' && (
            <div className="pt-3">
              <input
                type="url"
                value={icon}
                placeholder="https://example.com/icon.png"
                onChange={(e) => setIcon(e.target.value)}
                className="input"
              />
            </div>
          )}
        </div>

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* Display Settings */}
        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
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
