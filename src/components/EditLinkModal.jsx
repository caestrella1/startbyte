import React, { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import SegmentedControl from './ui/SegmentedControl';
import RenderedIcon from './RenderedIcon';

const iconTypes = [
    { id: 'none', label: 'None' },
    { id: 'favicon', label: 'Favicon' },
    { id: 'image', label: 'Image' },
    { id: 'url', label: 'URL' }
];

export default function EditLinkModal({ isOpen, link, onClose, onSave, onDelete }) {
    const [label, setLabel] = useState(null);
    const [href, setHref] = useState(null);
    const [icon, setIcon] = useState(null);
    const [iconType, setIconType] = useState('favicon');
    const [isDragging, setIsDragging] = useState(false);
    const [iconError, setIconError] = useState(null);

    useEffect(() => {
        if (!link) return;
        setLabel(link.label);
        setHref(link.href);
        setIcon(link.icon);
        setIconType(link.icon ? 'url' : 'none');
    }, [link]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleIconUpdate = async (input) => {
        setIconError(null);

        if (typeof input === 'string') {
            try {
                const response = await fetch(input);
                if (!response.ok || !response.headers.get('content-type')?.includes('image/')) {
                    throw new Error('Invalid image URL');
                }
                setIcon(input);
            } catch (err) {
                setIconError('Invalid image URL');
            }
            return;
        }

        if (input instanceof File && input.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setIcon(reader.result);
            reader.readAsDataURL(input);
            return;
        }

        setIconError('Please provide a valid image file or URL');
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const url = e.dataTransfer.getData('text/plain');
        if (url) {
            handleIconUpdate(url);
            return;
        }

        const file = e.dataTransfer.files[0];
        if (file) {
            handleIconUpdate(file);
        }
    }, []);

    const handlePaste = useCallback((e) => {
        const url = e.clipboardData.getData('text/plain');
        if (url) {
            e.preventDefault();
            handleIconUpdate(url);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...link,
            label,
            href,
            icon: iconType === 'favicon'
                ? `${new URL(href).origin}/favicon.ico`
                : iconType === 'none' ? null : icon
        });
        onClose();
    };

    const renderIconInput = () => {
        switch (iconType) {
            case 'favicon':
                return null;
            case 'none':
                return null;
            case 'image':
            case 'url':
                return (
                    <RenderedIcon
                        iconType={iconType}
                        icon={icon}
                        href={href}
                        label={label}
                        isDragging={isDragging}
                        iconError={iconError}
                        onDrag={handleDrag}
                        onDrop={handleDrop}
                        onPaste={handlePaste}
                        onIconUpdate={handleIconUpdate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-96">
                <h2 className="text-lg font-bold mb-4">Edit Link</h2>
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <p className="text-left text-sm font-medium mb-1">Icon</p>
                        <div className="flex flex-col items-center w-full gap-3 mb-4">
                            <div className="flex flex-col items-center w-full">
                                <SegmentedControl
                                    options={iconTypes}
                                    value={iconType}
                                    onChange={setIconType}
                                />
                                {renderIconInput()}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={label}
                                placeholder="Google"
                                onChange={(e) => setLabel(e.target.value)}
                                className="input"
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <input
                                    type="url"
                                    value={href}
                                    placeholder="https://www.google.com"
                                    onChange={(e) => setHref(e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(link);
                                    onClose();
                                }}
                                className="btn-danger"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
