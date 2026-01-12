import React from 'react';
import { AlertTriangle, Building2, CheckCircle2, FilterX } from 'lucide-react';

interface FilterDropdownProps {
  activeFilters: Set<string>;
  onToggle: (status: string) => void;
  onClear: () => void;
  anchorLeft?: number;
}

const FILTER_OPTIONS: Array<{ label: string; value: string; iconType: 'found' | 'notMet' | 'ready' }> = [
  { label: 'Email Found', value: 'Found', iconType: 'found' },
  { label: 'Condition Not Met', value: 'Not Met', iconType: 'notMet' },
  { label: 'Ready', value: 'None', iconType: 'ready' },
];

const getFilterIcon = (iconType: 'found' | 'notMet' | 'ready') => {
  switch (iconType) {
    case 'found':
      return <CheckCircle2 size={14} className="text-green-500" />;
    case 'notMet':
      return <AlertTriangle size={14} className="text-orange-500" />;
    case 'ready':
      return <Building2 size={14} className="text-gray-400" />;
  }
};

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ activeFilters, onToggle, onClear, anchorLeft = 256 }) => {
  return (
    <div
      className="absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-2 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ left: anchorLeft }}
    >
      <div className="px-3 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 mb-1">Filter by Status</div>
      {FILTER_OPTIONS.map((f) => (
        <label
          key={f.value}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeFilters.has(f.value) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={activeFilters.has(f.value)}
            onChange={() => onToggle(f.value)}
          />
          <div className="flex items-center space-x-2">
            {getFilterIcon(f.iconType)}
            <span className="text-sm font-semibold text-gray-700">{f.label}</span>
          </div>
        </label>
      ))}
      {activeFilters.size > 0 && (
        <button
          onClick={onClear}
          className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
        >
          <FilterX size={12} />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
};

export default FilterDropdown;
