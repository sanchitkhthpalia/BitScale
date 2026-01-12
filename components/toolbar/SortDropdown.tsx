import React from 'react';
import { ArrowDown, ArrowUp, XCircle } from 'lucide-react';
import { RowData } from '../../types';

interface SortDropdownProps {
  sortConfig: { key: keyof RowData; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof RowData) => void;
  onClear: () => void;
  anchorLeft?: number;
}

const SORTABLE_COLUMNS: Array<{ label: string; key: keyof RowData }> = [
  { label: 'Imported Data', key: 'importedData' },
  { label: 'Last Updated', key: 'lastUpdated' },
  { label: 'Company Name', key: 'companyName' },
  { label: 'Website URL', key: 'companyWebsite' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortConfig, onSort, onClear, anchorLeft = 192 }) => {
  return (
    <div
      className="absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-2 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ left: anchorLeft }}
    >
      <div className="px-3 py-2 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 mb-1">Sort Columns</div>
      {SORTABLE_COLUMNS.map((col) => (
        <button
          key={col.key}
          onClick={() => onSort(col.key)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${sortConfig?.key === col.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <span>{col.label}</span>
          {sortConfig?.key === col.key && (
            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
          )}
        </button>
      ))}
      {sortConfig && (
        <button
          onClick={onClear}
          className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
        >
          <XCircle size={12} />
          <span>Clear Sorting</span>
        </button>
      )}
    </div>
  );
};

export default SortDropdown;
