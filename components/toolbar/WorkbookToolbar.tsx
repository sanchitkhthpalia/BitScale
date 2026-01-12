import React from 'react';
import { ArrowUpDown, Filter, Layers, Plus, Sparkles, Table as TableIcon } from 'lucide-react';
import { ActionDropdown } from './ActionDropdown';

interface WorkbookToolbarProps {
  rowCount: number;
  selectedCount: number;
  onEnrich: () => void;
  onAddRecord: () => void;
  onToggleSort: () => void;
  onToggleFilter: () => void;
  isSortActive: boolean;
  isFilterActive: boolean;
}

export const WorkbookToolbar: React.FC<WorkbookToolbarProps> = ({
  rowCount,
  selectedCount,
  onEnrich,
  onAddRecord,
  onToggleSort,
  onToggleFilter,
  isSortActive,
  isFilterActive,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddRecord}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
        >
          <Plus size={14} className="text-blue-600" />
          <span>Add Record</span>
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1" />
        <div className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 border border-gray-100 rounded-lg bg-gray-50 font-medium">
          <TableIcon size={14} className="text-gray-400" />
          <span>{rowCount} Rows</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 border border-gray-100 rounded-lg bg-gray-50 font-medium">
          <Layers size={14} className="text-gray-400" />
          <span>16/20 Columns</span>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
            <span>{selectedCount} selected</span>
          </div>
        )}
        <button
          onClick={onToggleSort}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold border rounded-lg transition-all active:scale-95 ${isSortActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
        >
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
        <button
          onClick={onToggleFilter}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-semibold border rounded-lg transition-all active:scale-95 ${isFilterActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
        >
          <Filter size={14} />
          <span>Filter</span>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <ActionDropdown />
        <button
          onClick={onEnrich}
          className="flex items-center space-x-2 px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-all shadow-md active:scale-95"
        >
          <Sparkles size={14} className="text-blue-400" />
          <span>Enrichment</span>
        </button>
      </div>
    </div>
  );
};

export default WorkbookToolbar;
