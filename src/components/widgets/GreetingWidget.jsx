import React from 'react';
import AlignmentPicker from 'ui/AlignmentPicker';
import Switch from 'ui/Switch';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
};

export default function GreetingWidget({ settings = {} }) {
  const name = settings.name || 'Carlos';
  const horizontalAlign = settings.horizontalAlign || 'center';
  const textAlignClass = horizontalAlign === 'left' ? 'text-left' : 
                         horizontalAlign === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={textAlignClass}>
      <div className="text-xl font-normal tracking-wide text-primary">
        {getGreeting()}, {name}
      </div>
    </div>
  );
}

GreetingWidget.Settings = function GreetingSettings({ settings = {}, onSettingsChange, onRemove }) {
  return (
    <div className="w-full md:w-96">
      <h2 className="text-lg font-bold mb-4">Greeting Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
            Name
          </label>
          <input
            type="text"
            value={settings.name || 'Carlos'}
            onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
            placeholder="Enter your name"
            className="form-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-primary">
            Alignment
          </label>
          <AlignmentPicker
            horizontalAlign={settings.horizontalAlign || 'center'}
            verticalAlign={settings.verticalAlign || 'center'}
            onChange={({ horizontalAlign, verticalAlign }) => 
              onSettingsChange({ ...settings, horizontalAlign, verticalAlign })
            }
          />
        </div>
        <div>
          <Switch
            checked={settings.showBackground !== false}
            onChange={(checked) => onSettingsChange({ ...settings, showBackground: checked })}
            label="Show background"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn-danger w-full mt-4"
          >
            Remove Widget
          </button>
        )}
      </div>
    </div>
  );
};

