import React from 'react';

export default function IconLink({ link, commonProps, isEditing, onEdit }) {
  const content = (
    <div className="relative group w-20">
      {isEditing ? (
        <div
          {...commonProps}
          className="is-editing flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-black/30 hover:dark:bg-white/40"
        >
          <img src={link.icon} alt={link.label} className="w-12 h-12" />
          <span className="text-xs text-center font-medium truncate w-full">
            {link.label}
          </span>
        </div>
      ) : (
        <a
          {...commonProps}
          href={link.href}
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-black/30 hover:dark:bg-white/40"
        >
          <img src={link.icon} alt={link.label} className="w-12 h-12" />
          <span className="text-xs text-center font-medium truncate w-full">
            {link.label}
          </span>
        </a>
      )}

      {isEditing && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute -top-2 -right-2 sortable-link__edit-button"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </div>
  );

  return content;
}
