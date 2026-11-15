'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  X,
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

import {
  useGetDatasetsQuery,
  useGetDatasetFieldsQuery,
  DatasetItem,
} from '../../api/endpoints/datasets.api';
import {
  useGetRecordsQuery,
  FilterRule,
  RecordItem,
} from '../../api/endpoints/records.api';
import { useGetMeQuery } from '../../api/endpoints/auth.api';

import { ExplorerHeader } from './ExplorerHeader';
import { DataTable } from './DataTable';
import { PaginationControls } from './PaginationControls';
import { FilterBuilder } from './FilterBuilder';
import { ColumnVisibilityModal } from './ColumnVisibilityModal';
import { RecordDetailDrawer } from './RecordDetailDrawer';
import ExportModal from '../exports/ExportModal';

export function DataExplorerView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Fetch all accessible datasets
  const {
    data: datasetsResponse,
    isLoading: datasetsLoading,
    isError: datasetsError,
  } = useGetDatasetsQuery();

  const datasets = datasetsResponse?.data ?? [];

  // 2. Derive current dataset ID from URL or pick first available
  const urlDatasetId = searchParams.get('datasetId');
  const currentDatasetId = useMemo(() => {
    if (urlDatasetId && datasets.some((d) => d.id === urlDatasetId)) {
      return urlDatasetId;
    }
    return datasets[0]?.id ?? '';
  }, [urlDatasetId, datasets]);

  const currentDataset = useMemo(
    () => datasets.find((d) => d.id === currentDatasetId),
    [datasets, currentDatasetId],
  );

  // 3. Fetch schema fields for current dataset
  const { data: fieldsResponse, isLoading: fieldsLoading } = useGetDatasetFieldsQuery(
    currentDatasetId,
    { skip: !currentDatasetId },
  );

  const fields = fieldsResponse?.data ?? [];

  // 4. URL query state parsing
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10) || 25),
  );
  const qParam = searchParams.get('q') ?? '';
  const sortBy = searchParams.get('sortBy') ?? undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') ?? undefined;
  const filterLogic = (searchParams.get('filterLogic') as 'AND' | 'OR') ?? 'AND';

  const activeFilters = useMemo<FilterRule[]>(() => {
    const raw = searchParams.get('filters');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [searchParams]);

  // 5. Local Search input with debouncing
  const [searchInput, setSearchInput] = useState(qParam);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  // Helper to update URL query params cleanly
  const updateQueryParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      router.push(`${pathname}?${current.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Debounce search update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== qParam) {
        updateQueryParams({ q: searchInput.trim(), page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, qParam, updateQueryParams]);

  // 6. Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());

  // Initialize visible columns when fields load
  useEffect(() => {
    if (fields.length > 0) {
      setVisibleColumns(new Set(fields.map((f) => f.fieldKey)));
    }
  }, [fields, currentDatasetId]);

  const handleToggleColumn = (fieldKey: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        if (next.size > 1) next.delete(fieldKey); // Prevent hiding all
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  };

  const handleSelectAllColumns = () => {
    setVisibleColumns(new Set(fields.map((f) => f.fieldKey)));
  };

  const handleResetDefaultColumns = () => {
    setVisibleColumns(new Set(fields.map((f) => f.fieldKey)));
  };

  // 7. Modals & Drawer State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Determine if user can export
  const { data: meData } = useGetMeQuery();
  const userRole = meData?.user?.roleName ?? '';
  const canExport = userRole === 'Administrator' || userRole === 'Data Analyst';

  // 8. Fetch live records from API
  const {
    data: recordsResponse,
    isLoading: recordsLoading,
    isFetching: recordsFetching,
    refetch: refetchRecords,
  } = useGetRecordsQuery(
    {
      datasetId: currentDatasetId,
      page,
      pageSize,
      q: qParam,
      sortBy,
      sortOrder,
      filters: activeFilters,
      filterLogic,
    },
    { skip: !currentDatasetId },
  );

  const records = recordsResponse?.data ?? [];
  const meta = recordsResponse?.meta ?? {
    page: 1,
    pageSize: 25,
    total: currentDataset?.recordCount ?? 0,
    totalPages: 1,
  };

  // Check if URL has a recordId to open drawer directly
  const urlRecordId = searchParams.get('recordId');
  useEffect(() => {
    if (urlRecordId && records.length > 0) {
      const match = records.find((r) => r.id === urlRecordId);
      if (match) {
        setSelectedRecord(match);
        setIsDrawerOpen(true);
      }
    }
  }, [urlRecordId, records]);

  // 9. Handlers
  const handleSelectDataset = (newId: string) => {
    updateQueryParams({
      datasetId: newId,
      page: 1,
      q: '',
      sortBy: null,
      sortOrder: null,
      filters: null,
      recordId: null,
    });
    setSearchInput('');
  };

  const handleSort = (fieldKey: string) => {
    if (sortBy === fieldKey) {
      if (sortOrder === 'asc') {
        updateQueryParams({ sortBy: fieldKey, sortOrder: 'desc', page: 1 });
      } else {
        updateQueryParams({ sortBy: null, sortOrder: null, page: 1 });
      }
    } else {
      updateQueryParams({ sortBy: fieldKey, sortOrder: 'asc', page: 1 });
    }
  };

  const handleApplyFilters = (newFilters: FilterRule[], logic: 'AND' | 'OR') => {
    updateQueryParams({
      filters: newFilters.length > 0 ? JSON.stringify(newFilters) : null,
      filterLogic: logic,
      page: 1,
    });
  };

  const handleRemoveSingleFilter = (index: number) => {
    const updated = activeFilters.filter((_, i) => i !== index);
    updateQueryParams({
      filters: updated.length > 0 ? JSON.stringify(updated) : null,
      page: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateQueryParams({
      filters: null,
      q: null,
      page: 1,
    });
    setSearchInput('');
  };

  const handleRowClick = (record: RecordItem) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedRecord(null);
    if (urlRecordId) {
      updateQueryParams({ recordId: null });
    }
  };

  const handleNavigateToRelatedRecord = (
    relatedDatasetId: string,
    relatedRecordId: string,
  ) => {
    setIsDrawerOpen(false);
    updateQueryParams({
      datasetId: relatedDatasetId,
      recordId: relatedRecordId,
      page: 1,
      q: null,
      filters: null,
    });
  };

  if (datasetsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-medium text-slate-600">
            Connecting to DataScope PostgreSQL Engine...
          </span>
        </div>
      </div>
    );
  }

  if (datasetsError || datasets.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">Dataset Access Restricted</h2>
          <p className="mt-2 text-xs text-slate-600">
            No active datasets could be loaded for your account. Please sign in with an Administrator or authorized account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">
      {/* Explorer Top Navigation & Controls */}
      <ExplorerHeader
        currentDataset={currentDataset}
        datasets={datasets}
        onSelectDataset={handleSelectDataset}
        recordCount={meta.total}
        isFetching={recordsFetching}
        onRefresh={() => refetchRecords()}
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        activeFilterCount={activeFilters.length}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        onOpenColumnModal={() => setIsColumnModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        canExport={canExport}
      />

      {/* Active Filter Chips Bar */}
      {(activeFilters.length > 0 || qParam) && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs sm:px-6 overflow-x-auto">
          <span className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider whitespace-nowrap">
            Active Filters ({filterLogic}):
          </span>

          {qParam && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-indigo-700 whitespace-nowrap">
              <span>Search: &quot;{qParam}&quot;</span>
              <button
                onClick={() => {
                  setSearchInput('');
                  updateQueryParams({ q: null, page: 1 });
                }}
                className="hover:text-indigo-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.map((f, idx) => (
            <span
              key={`chip-${idx}`}
              className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-0.5 text-slate-700 shadow-2xs whitespace-nowrap"
            >
              <span className="font-semibold text-slate-900">{f.field}</span>
              <span className="text-slate-400">{f.operator}</span>
              <span className="font-mono text-slate-800">
                {Array.isArray(f.value) ? f.value.join(' & ') : String(f.value ?? '')}
              </span>
              <button
                onClick={() => handleRemoveSingleFilter(idx)}
                className="hover:text-rose-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <button
            onClick={handleClearAllFilters}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-rose-600 hover:bg-rose-50 whitespace-nowrap ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Live Data Explorer Table */}
      <DataTable
        fields={fields}
        visibleColumns={visibleColumns}
        records={records}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSelectRecord={handleRowClick}
        selectedRecordId={selectedRecord?.id}
        isLoading={recordsLoading || fieldsLoading}
      />

      {/* Pagination Controls */}
      <PaginationControls
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={(newPage) => updateQueryParams({ page: newPage })}
        onPageSizeChange={(newSize) => updateQueryParams({ pageSize: newSize, page: 1 })}
        isLoading={recordsLoading}
      />

      {/* Filter Builder Modal */}
      <FilterBuilder
        fields={fields}
        activeFilters={activeFilters}
        filterLogic={filterLogic}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        fields={fields}
        visibleColumns={visibleColumns}
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onToggleColumn={handleToggleColumn}
        onSelectAll={handleSelectAllColumns}
        onResetDefaults={handleResetDefaultColumns}
      />

      {/* Record Details Slide-over Drawer */}
      <RecordDetailDrawer
        datasetId={currentDatasetId}
        record={selectedRecord}
        fields={fields}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onNavigateToRelatedRecord={handleNavigateToRelatedRecord}
      />

      {/* Export Modal */}
      {currentDataset && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          datasetId={currentDatasetId}
          datasetName={currentDataset.name}
          fields={fields}
          currentFilters={activeFilters}
          currentFilterLogic={filterLogic}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      )}
    </div>
  );
}
