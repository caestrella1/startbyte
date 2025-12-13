import React from 'react';

export default function PillLink({ link, commonProps, isEditing, onEdit }) {
    return (
        <div className="relative group">
            {isEditing ? (
                <div 
                    {...commonProps} 
                    className="sortable-link cursor-pointer"
                >
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
        </div>
    );
}
