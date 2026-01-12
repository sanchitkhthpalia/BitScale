import React, { useState } from 'react';
import { Modal } from './Modal';
import { Bell, FileText, Globe, Shield, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const settings = [
    {
      category: 'General',
      icon: <User size={18} className="text-gray-400" />,
      items: [
        {
          label: 'Auto-save changes',
          description: 'Automatically save changes to your workbook',
          value: autoSave,
          onChange: setAutoSave,
        },
        {
          label: 'Email notifications',
          description: 'Receive email updates about your data',
          value: emailNotifications,
          onChange: setEmailNotifications,
        },
      ],
    },
    {
      category: 'Appearance',
      icon: <Globe size={18} className="text-gray-400" />,
      items: [
        {
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          value: theme === 'dark',
          onChange: (val: boolean) => setTheme(val ? 'dark' : 'light'),
          type: 'theme' as const,
        },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
        {settings.map((section) => (
          <div key={section.category} className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
              {section.icon}
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{section.category}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-900 block mb-1">{item.label}</label>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {item.type === 'theme' ? (
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setTheme('light')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                          theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                          theme === 'dark' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => item.onChange(!item.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        item.value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={item.value}
                      aria-label={item.label}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};
