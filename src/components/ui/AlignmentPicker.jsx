import React from 'react';

const positions = [
  { h: 'left', v: 'top', icon: '↖' },
  { h: 'center', v: 'top', icon: '↑' },
  { h: 'right', v: 'top', icon: '↗' },
  { h: 'left', v: 'center', icon: '←' },
  { h: 'center', v: 'center', icon: '○' },
  { h: 'right', v: 'center', icon: '→' },
  { h: 'left', v: 'bottom', icon: '↙' },
  { h: 'center', v: 'bottom', icon: '↓' },
  { h: 'right', v: 'bottom', icon: '↘' },
];

export default function AlignmentPicker({ horizontalAlign = 'center', verticalAlign = 'center', onChange }) {
  const handleClick = (h, v) => {
    onChange({ horizontalAlign: h, verticalAlign: v });
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-2">
        {positions.map((pos, index) => {
          const isSelected = horizontalAlign === pos.h && verticalAlign === pos.v;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(pos.h, pos.v)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                isSelected
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'surface border-neutral-300 dark:border-neutral-600 text-icon hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
              aria-label={`${pos.v} ${pos.h}`}
            >
              {pos.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

