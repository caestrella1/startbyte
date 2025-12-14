import React from 'react';
import SegmentedControl from '../ui/SegmentedControl';

export default function GridSection({
  gridColumns,
  onGridColumnsChange,
  widgetAlignmentHorizontal,
  onWidgetAlignmentHorizontalChange,
  widgetAlignmentVertical,
  onWidgetAlignmentVerticalChange,
}) {
  const cols = gridColumns || 6;
  const horizontal = widgetAlignmentHorizontal || 'left';
  const vertical = widgetAlignmentVertical || 'center';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Grid Columns: {cols}
        </label>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Choose how many columns the widget grid should have. Widgets will be square (height equals width).
        </p>
        <input
          type="range"
          min="3"
          max="10"
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
          <span>3</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Horizontal Alignment
        </label>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Align widgets to the left or right of the grid container.
        </p>
        <SegmentedControl
          options={[
            { id: 'left', label: 'Left' },
            { id: 'right', label: 'Right' },
          ]}
          value={horizontal}
          onChange={onWidgetAlignmentHorizontalChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Vertical Alignment
        </label>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
          Align widgets to the top, center, or bottom of the grid container.
        </p>
        <SegmentedControl
          options={[
            { id: 'top', label: 'Top' },
            { id: 'center', label: 'Center' },
            { id: 'bottom', label: 'Bottom' },
          ]}
          value={vertical}
          onChange={onWidgetAlignmentVerticalChange}
        />
      </div>
    </div>
  );
}

