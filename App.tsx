
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RowData } from './types';
import { INITIAL_ROWS } from './data/initialRows';
import { enrichCompanyData } from './services/geminiService';
import Header from './components/layout/Header';
import Banner from './components/layout/Banner';
import Footer from './components/layout/Footer';
import WorkbookToolbar from './components/toolbar/WorkbookToolbar';
import SortDropdown from './components/toolbar/SortDropdown';
import FilterDropdown from './components/toolbar/FilterDropdown';
import EnrichmentDialog from './components/common/EnrichmentDialog';
import GridTable from './components/table/GridTable';
import { ToastContainer, Toast } from './components/common/Toast';
import { PlanUsageModal } from './components/common/PlanUsageModal';
import { SettingsModal } from './components/common/SettingsModal';
import { SupportModal } from './components/common/SupportModal';

const formatTimestamp = () =>
  new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

export default function App() {
  const [rows, setRows] = useState<RowData[]>(INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [enriching, setEnriching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof RowData; direction: 'asc' | 'desc' } | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<RowData | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'engagement' | 'insights'>('grid');
  const [isAutoRunActive, setIsAutoRunActive] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayRows = useMemo(() => {
    let result = [...rows];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((r) =>
        [r.importedData, r.companyName, r.companyWebsite, r.linkedinUrl].some((value) =>
          value?.toLowerCase().includes(lower),
        ),
      );
    }

    if (activeFilters.size > 0) {
      result = result.filter((r) => activeFilters.has(r.emailWaterfall));
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, searchTerm, sortConfig, activeFilters]);

  const handleSort = (key: keyof RowData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleAddRecord = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    const newRow: RowData = {
      id: newId,
      importedData: 'New Prospect',
      lastUpdated: formatTimestamp(),
      companyName: '',
      companyWebsite: '',
      linkedinUrl: '',
      emailWaterfall: 'None',
    };
    setRows((prev) => [newRow, ...prev]);
    setEditingRowId(newId);
    setEditBuffer(newRow);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(displayRows.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const startEditing = (row: RowData) => {
    if (editingRowId === row.id) return;
    setEditingRowId(row.id);
    setEditBuffer({ ...row });
  };

  const cancelEditing = () => {
    setEditingRowId(null);
    setEditBuffer(null);
  };

  const saveEditing = () => {
    if (editBuffer && editingRowId !== null) {
      const domain = editBuffer.companyWebsite?.replace(/https?:\/\//, '').split('/')[0];
      const updatedLogo = domain ? `https://logo.clearbit.com/${domain}` : editBuffer.companyLogo;
      
      const updatedBuffer = { 
        ...editBuffer, 
        companyLogo: updatedLogo,
        lastUpdated: formatTimestamp(),
      };

      setRows((prev) => prev.map((r) => (r.id === editingRowId ? updatedBuffer : r)));
      setEditingRowId(null);
      setEditBuffer(null);
    }
  };

  const updateEditBuffer = (field: keyof RowData, value: string) => {
    if (editBuffer) {
      setEditBuffer({ ...editBuffer, [field]: value });
    }
  };

  const runEnrichment = async () => {
    if (selectedRows.size === 0) {
      showToast('Please select rows to enrich', 'warning');
      return;
    }

    setEnriching(true);
    setProgress(0);

    const ids = Array.from(selectedRows);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const row = rows.find((r) => r.id === id);
      if (row && (row.companyName || row.importedData)) {
        const query = row.companyName || row.importedData;
        const result = await enrichCompanyData(query);
        if (result) {
          setRows((prev) =>
            prev.map((r) =>
              r.id === id
                ? {
                    ...r,
                    companyName: result.companyName || r.companyName || query,
                    companyWebsite: result.website,
                    linkedinUrl: result.linkedin,
                    emailWaterfall: result.emailStatus,
                    lastUpdated: formatTimestamp(),
                    companyLogo: `https://logo.clearbit.com/${result.domain}`,
                  }
                : r,
            ),
          );
        }
      }
      setProgress(Math.round(((i + 1) / ids.length) * 100));
    }
    
    setEnriching(false);
    setProgress(0);
    showToast(`Successfully enriched ${ids.length} record${ids.length > 1 ? 's' : ''}`, 'success');
  };

  const toggleFilter = (status: string) => {
    const next = new Set(activeFilters);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    setActiveFilters(next);
  };

  const handleDeleteRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast('Record deleted successfully', 'success');
  };

  const handlePlanClick = () => {
    setShowPlanModal(true);
  };

  const handleUpgrade = () => {
    showToast('Upgrade initiated. Redirecting to billing...', 'info');
  };

  const handleKillRun = () => {
    if (enriching) {
      setEnriching(false);
      setProgress(0);
      showToast('Enrichment operation cancelled', 'warning');
    } else {
      showToast('No active operations to stop', 'info');
    }
  };

  const handleAutoRun = () => {
    setIsAutoRunActive(!isAutoRunActive);
    showToast(
      `Auto run ${!isAutoRunActive ? 'enabled' : 'disabled'}`,
      !isAutoRunActive ? 'success' : 'info',
    );
  };

  const handleDedupe = () => {
    const duplicates = rows.length - new Set(rows.map((r) => r.companyName || r.importedData)).size;
    if (duplicates > 0) {
      showToast(`Found ${duplicates} potential duplicate${duplicates > 1 ? 's' : ''}`, 'info');
    } else {
      showToast('No duplicates found', 'success');
    }
  };

  const handleViewChange = (view: 'grid' | 'engagement' | 'insights') => {
    setActiveView(view);
    if (view !== 'grid') {
      showToast(`${view === 'engagement' ? 'User Engagement' : 'Customer Insights'} view coming soon`, 'info');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden select-none">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onPlanClick={handlePlanClick}
        onSettingsClick={() => setShowSettingsModal(true)}
        onNotificationClick={() => showToast('Notifications dropdown opened', 'info', 2000)}
      />
      {showBanner && <Banner onDismiss={() => setShowBanner(false)} />}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {enriching && <EnrichmentDialog progress={progress} />}

      <PlanUsageModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} onUpgrade={handleUpgrade} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />

      <div className="relative">
        <WorkbookToolbar
          rowCount={displayRows.length}
          selectedCount={selectedRows.size}
          onEnrich={runEnrichment}
          onAddRecord={handleAddRecord}
          onToggleSort={() => setIsSortOpen(!isSortOpen)}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          isSortActive={!!sortConfig}
          isFilterActive={activeFilters.size > 0}
        />

        {isSortOpen && (
          <div ref={sortRef}>
            <SortDropdown
              sortConfig={sortConfig}
              onSort={handleSort}
              onClear={() => setSortConfig(null)}
              anchorLeft={192}
            />
          </div>
        )}

        {isFilterOpen && (
          <div ref={filterRef}>
            <FilterDropdown
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={() => setActiveFilters(new Set())}
              anchorLeft={256}
            />
          </div>
        )}
      </div>

      {activeView === 'grid' && (
        <GridTable
          displayRows={displayRows}
          selectedRows={selectedRows}
          sortConfig={sortConfig}
          editingRowId={editingRowId}
          editBuffer={editBuffer}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onSort={handleSort}
          onStartEditing={startEditing}
          onUpdateEditBuffer={updateEditBuffer}
          onSaveEditing={() => {
            saveEditing();
            showToast('Changes saved successfully', 'success');
          }}
          onCancelEditing={cancelEditing}
          onDeleteRow={handleDeleteRow}
          onAddRecord={handleAddRecord}
        />
      )}

      {activeView !== 'grid' && (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {activeView === 'engagement' ? 'User Engagement' : 'Customer Insights'}
            </h2>
            <p className="text-gray-600">This view is coming soon</p>
          </div>
        </div>
      )}

      <Footer
        activeView={activeView}
        onViewChange={handleViewChange}
        onKillRun={handleKillRun}
        onAutoRun={handleAutoRun}
        onDedupe={handleDedupe}
        onSupport={() => setShowSupportModal(true)}
        isAutoRunActive={isAutoRunActive}
      />
    </div>
  );
}
