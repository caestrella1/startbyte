import React from 'react';
import SegmentedControl from '../ui/SegmentedControl';

const ROW_HEIGHT_PRESETS = {
  compact: 100,
  normal: 120,
  cozy: 180,
};

const ROW_HEIGHT_TO_PRESET = {
  100: 'compact',
  120: 'normal',
  180: 'cozy',
};

export default function GridSection({
  gridColumns,
  onGridColumnsChange,
  rowHeight,
  onRowHeightChange,
}) {
  const cols = gridColumns || 3;
  const height = rowHeight || 120;
  
  // Get current preset or default to 'normal'
  const currentPreset = ROW_HEIGHT_TO_PRESET[height] || 'normal';
  
  const handlePresetChange = (presetId) => {
    onRowHeightChange(ROW_HEIGHT_PRESETS[presetId]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Grid Columns: {cols}
        </label>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Choose how many columns the widget grid should have. This affects how widgets are arranged on the page.
        </p>
        <input
          type="range"
          min="1"
          max="8"
          step="1"
          value={cols}
          onChange={(e) => onGridColumnsChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          <span>1</span>
          <span>8</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Row Height
        </label>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Choose the spacing between widget rows. This determines how tall each widget row will be.
        </p>
        <SegmentedControl
          options={[
            { id: 'compact', label: 'Compact' },
            { id: 'normal', label: 'Normal' },
            { id: 'cozy', label: 'Cozy' },
          ]}
          value={currentPreset}
          onChange={handlePresetChange}
        />
      </div>
    </div>
  );
}

