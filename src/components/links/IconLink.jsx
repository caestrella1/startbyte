import React from 'react';

export default function IconLink({ link, commonProps, isEditing, onEdit }) {
  return (
    <div className="relative group w-24 h-full flex items-start justify-center">
      {isEditing ? (
        <div
          {...commonProps}
          className="flex flex-col items-center justify-start gap-2 px-4 py-3 rounded-xl hover:bg-black/30 hover:dark:bg-white/40 w-full h-full cursor-pointer"
        >
          <img src={link.icon} alt={link.label} className="w-[50%] h-[50%] max-w-14 max-h-14 object-contain flex-shrink-0" />
          <span className="text-xs text-center font-medium line-clamp-2 w-full leading-tight">
            {link.label}
          </span>
        </div>
      ) : (
        <a
          {...commonProps}
          href={link.href}
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-start gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-black/30 hover:dark:bg-white/40 w-full h-full"
        >
          <img src={link.icon} alt={link.label} className="w-[50%] h-[50%] max-w-14 max-h-14 object-contain flex-shrink-0" />
          <span className="text-xs text-center font-medium line-clamp-2 w-full leading-tight">
            {link.label}
          </span>
        </a>
      )}
    </div>
  );
}
