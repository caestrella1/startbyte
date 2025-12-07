import React, { useState } from 'react';
import AlignmentPicker from '../ui/AlignmentPicker';

export default function TextWidget({ settings = {} }) {
  const text = settings.text || '';
  const horizontalAlign = settings.horizontalAlign || 'center';
  const textAlignClass = horizontalAlign === 'left' ? 'text-left' : 
                         horizontalAlign === 'right' ? 'text-right' : 'text-center';

  if (!text) {
    return (
      <div className={textAlignClass}>
        <div className="text-sm text-neutral-400 dark:text-neutral-500 italic">
          Click to edit text
        </div>
      </div>
    );
  }

  return (
    <div className={textAlignClass}>
      <div className="text-lg dark:text-white whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  );
}

TextWidget.Settings = function TextSettings({ settings = {}, onSettingsChange, onRemove }) {
  const [text, setText] = useState(settings.text || '');

  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Text Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-black dark:text-white">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onSettingsChange({ ...settings, text: e.target.value });
            }}
            placeholder="Enter your text here..."
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700
              bg-white dark:bg-neutral-800
              text-black dark:text-white
              text-sm resize-y"
          />
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

