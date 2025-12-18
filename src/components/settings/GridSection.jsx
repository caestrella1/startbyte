import React from 'react';
import SegmentedControl from '../ui/SegmentedControl';

export default function GridSection({
  gridColumnsSmall,
  onGridColumnsSmallChange,
  gridColumnsMedium,
  onGridColumnsMediumChange,
  gridColumnsLarge,
  onGridColumnsLargeChange,
  widgetAlignmentHorizontal,
  onWidgetAlignmentHorizontalChange,
  widgetAlignmentVertical,
  onWidgetAlignmentVerticalChange,
}) {
  const smallCols = gridColumnsSmall || 1;
  const mediumCols = gridColumnsMedium || 2;
  const largeCols = gridColumnsLarge || 6;
  const horizontal = widgetAlignmentHorizontal || 'left';
  const vertical = widgetAlignmentVertical || 'center';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Grid Columns (Small: &lt;640px): {smallCols}
        </label>
        <p className="text-xs text-secondary mb-4">
          Number of columns for small screens (mobile devices).
        </p>
        <input
          type="range"
          min="1"
          max="4"
          step="1"
          value={smallCols}
          onChange={(e) => onGridColumnsSmallChange(parseInt(e.target.value))}
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
          <span>4</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Grid Columns (Medium: 640px-1023px): {mediumCols}
        </label>
        <p className="text-xs text-secondary mb-4">
          Number of columns for medium screens (tablets).
        </p>
        <input
          type="range"
          min="2"
          max="6"
          step="1"
          value={mediumCols}
          onChange={(e) => onGridColumnsMediumChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>2</span>
          <span>6</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Grid Columns (Large: ≥1024px): {largeCols}
        </label>
        <p className="text-xs text-secondary mb-4">
          Number of columns for large screens (desktops). Widgets will be square (height equals width).
        </p>
        <input
          type="range"
          min="3"
          max="10"
          step="1"
          value={largeCols}
          onChange={(e) => onGridColumnsLargeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>3</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-black dark:text-white">
          Horizontal Alignment
        </label>
        <p className="text-xs text-secondary mb-4">
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
        <p className="text-xs text-secondary mb-4">
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

