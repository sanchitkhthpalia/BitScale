import React from 'react';
import { Modal } from './Modal';
import { MessageSquare, Mail, Book, ExternalLink } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const supportOptions = [
    {
      icon: <MessageSquare size={20} className="text-blue-600" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      onClick: () => {
        alert('Live chat would open here. This is a demo.');
      },
    },
    {
      icon: <Mail size={20} className="text-blue-600" />,
      title: 'Email Support',
      description: 'support@bitscale.com',
      action: 'Send Email',
      onClick: () => {
        window.location.href = 'mailto:support@bitscale.com';
      },
    },
    {
      icon: <Book size={20} className="text-blue-600" />,
      title: 'Documentation',
      description: 'Browse guides and tutorials',
      action: 'View Docs',
      onClick: () => {
        alert('Documentation would open here. This is a demo.');
      },
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Support" size="md">
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Need help? Choose the option that works best for you.
        </p>
        <div className="space-y-3">
          {supportOptions.map((option) => (
            <button
              key={option.title}
              onClick={option.onClick}
              className="w-full flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all text-left group"
            >
              <div className="mt-0.5">{option.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-1">{option.title}</h4>
                <p className="text-xs text-gray-600">{option.description}</p>
              </div>
              <div className="flex items-center space-x-1 text-blue-600 text-xs font-medium group-hover:text-blue-700">
                <span>{option.action}</span>
                <ExternalLink size={14} />
              </div>
            </button>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Average response time: &lt; 2 hours
          </p>
        </div>
      </div>
    </Modal>
  );
};
