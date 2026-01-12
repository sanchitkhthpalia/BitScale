import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Download, Upload, Copy, Trash2 } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const ActionDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { icon: <Download size={14} />, label: 'Export CSV', onClick: () => alert('Export CSV functionality would open here') },
    { icon: <Upload size={14} />, label: 'Import Data', onClick: () => alert('Import data functionality would open here') },
    { icon: <Copy size={14} />, label: 'Duplicate Workbook', onClick: () => alert('Duplicate workbook functionality would open here') },
    { icon: <Trash2 size={14} />, label: 'Delete Selected', onClick: () => alert('Delete selected records functionality would open here') },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="More actions" position="bottom">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-1.5 bg-white text-gray-700 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="More actions"
          aria-expanded={isOpen}
        >
          <span>Action</span>
          <MoreHorizontal size={14} />
        </button>
      </Tooltip>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
