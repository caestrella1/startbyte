import React from 'react';

export default function PillLink({ link, commonProps, isEditing, onEdit }) {
    const content = (
        <div className="relative group">
            {isEditing ? (
                <div {...commonProps} className="sortable-link">
                    {link.icon && (<img src={link.icon} alt={link.label} className="w-5 h-5" />)}
                    {link.label}
                </div>
            ) : (
                <a {...commonProps}
                    href={link.href}
                    rel="noopener noreferrer"
                    className="sortable-link"
                >
                    {link.icon && (<img src={link.icon} alt={link.label} className="w-5 h-5" />)}
                    {link.label}
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
