import React from 'react';
import { RowData } from '../../types';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  Edit2,
  ExternalLink,
  FilterX,
  Play,
  Table as TableIcon,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { CompanyLogo } from '../common/CompanyLogo';

interface SortConfig {
  key: keyof RowData;
  direction: 'asc' | 'desc';
}

interface GridTableProps {
  displayRows: RowData[];
  selectedRows: Set<number>;
  sortConfig: SortConfig | null;
  editingRowId: number | null;
  editBuffer: RowData | null;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: number) => void;
  onSort: (key: keyof RowData) => void;
  onStartEditing: (row: RowData) => void;
  onUpdateEditBuffer: (field: keyof RowData, value: string) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onDeleteRow: (id: number) => void;
  onAddRecord: () => void;
}

const SortIndicator = ({ column, sortConfig }: { column: keyof RowData; sortConfig: SortConfig | null }) => {
  if (sortConfig?.key !== column) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
  return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="ml-1 text-blue-600" /> : <ArrowDown size={12} className="ml-1 text-blue-600" />;
};

export const GridTable: React.FC<GridTableProps> = ({
  displayRows,
  selectedRows,
  sortConfig,
  editingRowId,
  editBuffer,
  onSelectAll,
  onSelectRow,
  onSort,
  onStartEditing,
  onUpdateEditBuffer,
  onSaveEditing,
  onCancelEditing,
  onDeleteRow,
  onAddRecord,
}) => {
  return (
    <div className="flex-1 overflow-auto custom-scrollbar relative">
      <table className="w-full border-separate border-spacing-0 bg-white table-fixed min-w-[1800px]">
        <thead className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md text-gray-500 text-[11px] font-black uppercase tracking-wider shadow-sm">
          <tr>
            <th className="w-12 px-3 py-4 text-center border-b border-r border-gray-200 sticky left-0 z-30 bg-gray-50">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={selectedRows.size === displayRows.length && displayRows.length > 0}
                aria-label="Select all rows"
              />
            </th>
            <th className="w-12 px-3 py-4 text-center border-b border-r border-gray-200 bg-gray-50">#</th>
            <th
              className="w-64 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('importedData')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-1 rounded text-blue-700"><TableIcon size={14} /></div>
                  <span>Imported Data</span>
                </div>
                <SortIndicator column="importedData" sortConfig={sortConfig} />
              </div>
            </th>
            <th
              className="w-64 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('lastUpdated')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TableIcon size={14} className="text-gray-400" />
                  <span>Last Updated</span>
                </div>
                <SortIndicator column="lastUpdated" sortConfig={sortConfig} />
              </div>
            </th>
            <th
              className="w-80 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('companyName')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="font-mono text-lg leading-none">ƒ</span>
                  <span>Company Name & Logo</span>
                </div>
                <SortIndicator column="companyName" sortConfig={sortConfig} />
              </div>
            </th>
            <th
              className="w-64 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onSort('companyWebsite')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="font-mono text-lg leading-none">ƒ</span>
                  <span>Website URL</span>
                </div>
                <SortIndicator column="companyWebsite" sortConfig={sortConfig} />
              </div>
            </th>
            <th className="w-64 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 text-blue-600">
                <span className="font-mono text-lg leading-none">ƒ</span>
                <span>LinkedIn Page</span>
              </div>
            </th>
            <th className="w-64 px-4 py-4 text-left border-b border-r border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-1 rounded text-gray-500"><TableIcon size={14} /></div>
                <span>Enrichment Status</span>
              </div>
            </th>
            <th className="w-32 px-4 py-4 text-center border-b sticky right-0 z-30 bg-gray-50 border-l border-gray-200">
              <span>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayRows.length > 0 ? displayRows.map((row, idx) => {
            const isEditing = editingRowId === row.id;
            const displayRow = isEditing ? editBuffer! : row;
            const isGreenSkeleton = !displayRow.companyName && displayRow.importedData !== '' && !isEditing && !row.companyWebsite;

            return (
              <tr
                key={row.id}
                className={`group transition-all duration-200 ${selectedRows.has(row.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50/70'} ${isEditing ? 'bg-indigo-50/60 ring-1 ring-inset ring-indigo-200' : ''}`}
              >
                  <td className="px-3 py-3 text-center border-r border-gray-100 sticky left-0 z-10 bg-inherit transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      checked={selectedRows.has(row.id)}
                      onChange={() => onSelectRow(row.id)}
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                <td className="px-3 py-3 text-center text-gray-400 text-[11px] font-bold border-r border-gray-100 bg-inherit transition-colors">{idx + 1}</td>

                  {/* Imported Data */}
                  <td
                    className="px-4 py-3 border-r border-gray-100 cursor-pointer bg-inherit transition-colors hover:bg-blue-50/30 focus-within:bg-blue-50/30"
                    onClick={() => onStartEditing(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onStartEditing(row);
                      }
                    }}
                    aria-label={`Edit row ${idx + 1}: ${row.importedData || 'New record'}`}
                  >
                  {isEditing ? (
                    <input
                      className="w-full text-xs font-semibold bg-white border border-blue-400 rounded-md px-3 py-1.5 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                      value={displayRow.importedData}
                      onChange={(e) => onUpdateEditBuffer('importedData', e.target.value)}
                      autoFocus
                    />
                  ) : displayRow.importedData ? (
                    <div className="flex items-center justify-between group/cell">
                      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all ${isGreenSkeleton ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        {isGreenSkeleton ? <Building size={12} className="opacity-70" /> : <User size={12} className="opacity-70" />}
                        <span className="flex-1 truncate">{displayRow.importedData}</span>
                        <ChevronRight size={12} className="ml-1 opacity-30" />
                      </div>
                      <Play size={12} className="text-gray-300 opacity-0 group-hover/cell:opacity-100 transition-all cursor-pointer hover:text-blue-500 active:scale-90" />
                    </div>
                  ) : <div className="h-4 w-32 bg-gray-50/50 rounded animate-pulse" />}
                </td>

                {/* Last Updated */}
                <td className="px-4 py-3 border-r border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-inherit transition-colors">
                  {displayRow.lastUpdated || (isGreenSkeleton ? <div className="h-6 w-full bg-gray-100 rounded-full opacity-60 max-w-[180px]" /> : <div className="h-4 w-40 bg-gray-50/50 rounded" />)}
                </td>

                  {/* Company Name + LOGO */}
                  <td
                    className="px-4 py-3 border-r border-gray-100 cursor-pointer bg-inherit transition-colors hover:bg-blue-50/30 focus-within:bg-blue-50/30"
                    onClick={() => onStartEditing(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onStartEditing(row);
                      }
                    }}
                  >
                  {isEditing ? (
                    <div className="flex items-center space-x-3">
                      <CompanyLogo name={displayRow.companyName} website={displayRow.companyWebsite} />
                      <input
                        className="flex-1 text-xs font-semibold bg-white border border-blue-400 rounded-md px-3 py-1.5 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                        value={displayRow.companyName}
                        onChange={(e) => onUpdateEditBuffer('companyName', e.target.value)}
                        placeholder="e.g. Google"
                      />
                    </div>
                  ) : displayRow.companyName ? (
                    <div className="flex items-center space-x-3">
                      <CompanyLogo name={displayRow.companyName} logoUrl={displayRow.companyLogo} website={displayRow.companyWebsite} />
                      <span className="text-sm text-gray-900 font-bold">{displayRow.companyName}</span>
                    </div>
                  ) : (isGreenSkeleton ? <div className="h-6 w-full bg-gray-100 rounded-full opacity-60 max-w-[140px]" /> : <div className="h-4 w-24 bg-gray-50/50 rounded" />)}
                </td>

                  {/* Company Website */}
                  <td
                    className="px-4 py-3 border-r border-gray-100 cursor-pointer bg-inherit transition-colors hover:bg-blue-50/30 focus-within:bg-blue-50/30"
                    onClick={() => onStartEditing(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onStartEditing(row);
                      }
                    }}
                  >
                  {isEditing ? (
                    <input
                      className="w-full text-xs font-semibold bg-white border border-blue-400 rounded-md px-3 py-1.5 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                      value={displayRow.companyWebsite}
                      onChange={(e) => onUpdateEditBuffer('companyWebsite', e.target.value)}
                      placeholder="https://google.com"
                    />
                  ) : displayRow.companyWebsite ? (
                    <div className="flex items-center justify-between group/cell">
                      <div className="flex items-center space-x-2">
                        <ExternalLink size={12} className="text-gray-400" />
                        <a
                          href={displayRow.companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-200 underline-offset-4 truncate max-w-[160px] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {displayRow.companyWebsite}
                        </a>
                      </div>
                    </div>
                  ) : (isGreenSkeleton ? <div className="h-6 w-full bg-gray-100 rounded-full opacity-60 max-w-[180px]" /> : <div className="h-4 w-48 bg-gray-50/50 rounded" />)}
                </td>

                  {/* LinkedIn URL */}
                  <td
                    className="px-4 py-3 border-r border-gray-100 cursor-pointer bg-inherit transition-colors hover:bg-blue-50/30 focus-within:bg-blue-50/30"
                    onClick={() => onStartEditing(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onStartEditing(row);
                      }
                    }}
                  >
                  {isEditing ? (
                    <input
                      className="w-full text-xs font-semibold bg-white border border-blue-400 rounded-md px-3 py-1.5 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                      value={displayRow.linkedinUrl}
                      onChange={(e) => onUpdateEditBuffer('linkedinUrl', e.target.value)}
                      placeholder="LinkedIn Profile URL"
                    />
                  ) : displayRow.linkedinUrl ? (
                    <div className="flex items-center justify-between group/cell">
                      <div className="flex items-center space-x-2">
                        <ExternalLink size={12} className="text-gray-400" />
                        <a
                          href={displayRow.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-200 underline-offset-4 truncate max-w-[160px] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {displayRow.linkedinUrl}
                        </a>
                      </div>
                    </div>
                  ) : (isGreenSkeleton ? <div className="h-6 w-full bg-gray-100 rounded-full opacity-60 max-w-[180px]" /> : <div className="h-4 w-48 bg-gray-50/50 rounded" />)}
                </td>

                {/* Email Status */}
                <td className="px-4 py-3 border-r border-gray-100 bg-inherit transition-colors">
                  {displayRow.emailWaterfall === 'Found' && (
                    <div className="flex items-center justify-between space-x-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 text-[11px] font-black uppercase shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-500 rounded p-0.5 text-white">
                          <Check size={10} strokeWidth={4} />
                        </div>
                        <span>Email Found</span>
                      </div>
                      <ChevronRight size={12} className="ml-1 opacity-40" />
                    </div>
                  )}
                  {displayRow.emailWaterfall === 'Not Met' && (
                    <div className="flex items-center space-x-2 text-orange-600 px-3 py-1.5 italic text-[11px] font-semibold opacity-80">
                      <AlertTriangle size={12} />
                      <span>Run condition not met</span>
                    </div>
                  )}
                  {displayRow.emailWaterfall === 'None' && displayRow.companyName && (
                    <div className="h-8 w-24 bg-gray-50/50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Ready
                    </div>
                  )}
                </td>

                {/* Row Actions */}
                <td className="px-4 py-3 text-center sticky right-0 z-10 bg-inherit border-l border-gray-100 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); onSaveEditing(); }}
                          className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all active:scale-90"
                          title="Save Changes"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onCancelEditing(); }}
                          className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-all active:scale-90"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onStartEditing(row); }}
                          className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 rounded-lg active:scale-90"
                          title="Edit Row"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRow(row.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-lg active:scale-90"
                          title="Delete Row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={9} className="py-20 text-center">
                <div className="flex flex-col items-center text-gray-400">
                  <FilterX size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No matching records found</p>
                  <button
                    onClick={() => onAddRecord()}
                    className="mt-4 text-blue-600 font-bold text-xs uppercase hover:underline"
                  >
                    Add a new record
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Floating Add Button */}
      <div className="p-8 flex items-center justify-start">
        <button
          onClick={onAddRecord}
          className="group flex items-center space-x-3 px-6 py-2.5 text-sm font-black text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-2xl transition-all border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md active:scale-95"
        >
          <span className="text-xl font-black text-blue-500 group-hover:scale-125 transition-transform">+</span>
          <span className="uppercase tracking-widest text-xs">Add New Record</span>
        </button>
      </div>
    </div>
  );
};

export default GridTable;
