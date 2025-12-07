import React from 'react';

export default function GridSection({
  gridColumns,
  onGridColumnsChange,
}) {
  const cols = gridColumns || 3;

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
    </div>
  );
}

