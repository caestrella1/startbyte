import React, { useRef } from 'react';

export default function ResetSection({
  onExportSettings,
  onImportSettings,
  onResetBackground,
  onResetAll,
  onBack,
}) {
  const importFileInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">Export Settings</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Download all your settings, widgets, and wallpaper configuration as a JSON file.
        </p>
        <button
          onClick={() => {
            onExportSettings();
          }}
          className="w-full px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-700
            bg-blue-50 dark:bg-blue-900/20
            text-blue-700 dark:text-blue-400
            hover:bg-blue-100 dark:hover:bg-blue-900/30
            transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Settings
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">Import Settings</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Import settings from a previously exported JSON file. This will replace your current settings.
        </p>
        <button
          onClick={() => {
            importFileInputRef.current?.click();
          }}
          className="w-full px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-700
            bg-blue-50 dark:bg-blue-900/20
            text-blue-700 dark:text-blue-400
            hover:bg-blue-100 dark:hover:bg-blue-900/30
            transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import Settings
        </button>
        <input
          ref={importFileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                if (window.confirm('Are you sure you want to import these settings? This will replace all your current settings. This action cannot be undone.')) {
                  await onImportSettings(file);
                  // Reload the page to apply all changes
                  window.location.reload();
                }
              } catch (error) {
                alert(`Failed to import settings: ${error.message}`);
              }
              // Reset the input so the same file can be selected again
              e.target.value = '';
            }
          }}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">Reset Wallpaper</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Reset the wallpaper to the default solid black color.
        </p>
        <button
          onClick={() => {
            onResetBackground();
            onBack();
          }}
          className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700
            bg-red-50 dark:bg-red-900/20
            text-red-700 dark:text-red-400
            hover:bg-red-100 dark:hover:bg-red-900/30
            transition-colors font-medium"
        >
          Reset Wallpaper
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">Reset All Settings</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Reset all settings including wallpaper and widgets to their default values. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all settings? This will remove all widgets and reset your wallpaper. This action cannot be undone.')) {
              onResetAll();
              onBack();
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-red-500 dark:border-red-600
            bg-red-600 dark:bg-red-700
            text-white
            hover:bg-red-700 dark:hover:bg-red-600
            transition-colors font-medium"
        >
          Reset All Settings
        </button>
      </div>
    </div>
  );
}

