import React from 'react';
import Modal from 'ui/Modal';
import { widgetRegistry } from 'widgets/widgetRegistry';

export default function WidgetPicker({ isOpen, onClose, onAddWidget }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-96">
        <h2 className="text-lg font-bold mb-4">Add Widget</h2>
        <div className="space-y-2">
          {Object.entries(widgetRegistry)
            .filter(([_, widget]) => !widget.hidden)
            .map(([id, widget]) => (
              <button
                key={id}
                onClick={() => {
                  onAddWidget(id);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-lg
                  bg-white/70 dark:bg-neutral-800/70 hover:bg-white dark:hover:bg-neutral-700
                  border border-neutral-200 dark:border-neutral-700
                  transition-colors"
              >
                <div className="font-semibold text-primary">{widget.name}</div>
                {widget.description && (
                  <div className="text-sm text-secondary mt-1">
                    {widget.description}
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>
    </Modal>
  );
}

