'use client';

import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Database,
  Layers,
  X,
  Wand2,
  Upload,
  Save,
} from 'lucide-react';
import {
  DatasetField,
  DatasetWithMembers,
  useGetAdminDatasetsQuery,
  useCreateDatasetMutation,
  useUpdateDatasetMutation,
  useDeleteDatasetMutation,
  useGetAdminDatasetFieldsQuery,
  useCreateDatasetFieldMutation,
  useUpdateDatasetFieldMutation,
  useDeleteDatasetFieldMutation,
  useGenerateDatasetRecordsMutation,
  useImportDatasetRecordsMutation,
} from '../../../api/endpoints/admin.api';

const DATA_TYPES: Array<DatasetField['dataType']> = [
  'text',
  'number',
  'boolean',
  'date',
  'email',
  'url',
];

const emptyCreateForm = {
  name: '',
  description: '',
  category: '',
  dataSource: '',
};

const emptyFieldForm = {
  fieldKey: '',
  fieldLabel: '',
  dataType: 'text' as DatasetField['dataType'],
  isRequired: false,
  isSearchable: false,
  isFilterable: false,
  isSortable: false,
};

export function DatasetManagementTab() {
  const { data: datasetsData, refetch: refetchDatasets } = useGetAdminDatasetsQuery();
  const [createDataset] = useCreateDatasetMutation();
  const [updateDataset] = useUpdateDatasetMutation();
  const [deleteDataset] = useDeleteDatasetMutation();
  const [createDatasetField] = useCreateDatasetFieldMutation();
  const [updateDatasetField] = useUpdateDatasetFieldMutation();
  const [deleteDatasetField] = useDeleteDatasetFieldMutation();
  const [generateRecords] = useGenerateDatasetRecordsMutation();
  const [importRecords] = useImportDatasetRecordsMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editTarget, setEditTarget] = useState<DatasetWithMembers | null>(null);
  const [editForm, setEditForm] = useState(emptyCreateForm);
  const [fieldsTarget, setFieldsTarget] = useState<DatasetWithMembers | null>(null);
  const [fieldForm, setFieldForm] = useState(emptyFieldForm);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [generateCount, setGenerateCount] = useState(100);
  const [generateClear, setGenerateClear] = useState(false);
  const [importJson, setImportJson] = useState('[\n  {}\n]');
  const [importClear, setImportClear] = useState(false);

  const { data: fieldsData } = useGetAdminDatasetFieldsQuery(fieldsTarget?.id ?? '', {
    skip: !fieldsTarget,
  });

  const fields = fieldsData?.data ?? [];

  const openCreate = () => {
    setCreateForm(emptyCreateForm);
    setIsCreateOpen(true);
  };

  const openEdit = (dataset: DatasetWithMembers) => {
    setEditTarget(dataset);
    setEditForm({
      name: dataset.name,
      description: dataset.description ?? '',
      category: dataset.category ?? '',
      dataSource: dataset.dataSource ?? '',
    });
  };

  const openFields = (dataset: DatasetWithMembers) => {
    setFieldsTarget(dataset);
    setEditingFieldId(null);
    setFieldForm(emptyFieldForm);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createForm.name.trim()) return;

    try {
      await createDataset({
        name: createForm.name.trim(),
        description: createForm.description.trim() || undefined,
        category: createForm.category.trim() || undefined,
        dataSource: createForm.dataSource.trim() || undefined,
      }).unwrap();
      setIsCreateOpen(false);
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create dataset');
    }
  };

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTarget) return;

    try {
      await updateDataset({
        datasetId: editTarget.id,
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        category: editForm.category.trim(),
        dataSource: editForm.dataSource.trim(),
      }).unwrap();
      setEditTarget(null);
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update dataset');
    }
  };

  const handleDelete = async (dataset: DatasetWithMembers) => {
    if (
      !confirm(
        `Delete '${dataset.name}' and all of its records, fields and memberships? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteDataset(dataset.id).unwrap();
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete dataset');
    }
  };

  const startEditField = (field: DatasetField) => {
    setEditingFieldId(field.id);
    setFieldForm({
      fieldKey: field.fieldKey,
      fieldLabel: field.fieldLabel,
      dataType: field.dataType,
      isRequired: field.isRequired,
      isSearchable: field.isSearchable,
      isFilterable: field.isFilterable,
      isSortable: field.isSortable,
    });
  };

  const handleSaveField = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fieldsTarget) return;
    if (!fieldForm.fieldKey.trim() || !fieldForm.fieldLabel.trim()) return;

    try {
      if (editingFieldId) {
        await updateDatasetField({
          datasetId: fieldsTarget.id,
          fieldId: editingFieldId,
          ...fieldForm,
        }).unwrap();
      } else {
        await createDatasetField({
          datasetId: fieldsTarget.id,
          ...fieldForm,
        }).unwrap();
      }

      setFieldForm(emptyFieldForm);
      setEditingFieldId(null);
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save field');
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!fieldsTarget) return;
    if (!confirm('Delete this field definition?')) return;

    try {
      await deleteDatasetField({ datasetId: fieldsTarget.id, fieldId }).unwrap();
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete field');
    }
  };

  const handleGenerate = async () => {
    if (!fieldsTarget) return;
    if (fields.length === 0) {
      alert('Add at least one field before generating records.');
      return;
    }

    try {
      const result = await generateRecords({
        datasetId: fieldsTarget.id,
        count: generateCount,
        clearExisting: generateClear,
      }).unwrap();
      alert(`Generated ${result.generated} records.`);
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to generate records');
    }
  };

  const handleImport = async () => {
    if (!fieldsTarget) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(importJson);
    } catch {
      alert('Import payload must be valid JSON.');
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      alert('Import payload must be a non-empty JSON array of records.');
      return;
    }

    try {
      const result = await importRecords({
        datasetId: fieldsTarget.id,
        records: parsed as Record<string, unknown>[],
        clearExisting: importClear,
      }).unwrap();
      alert(`Imported ${result.imported} records.`);
      refetchDatasets();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to import records');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Dataset Management</h2>
          <p className="text-xs text-slate-500">
            Create datasets, configure fields, generate or import records, and archive/delete
            catalogs.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Dataset
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Dataset</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Data Source</th>
              <th className="px-4 py-3">Records</th>
              <th className="px-4 py-3">Fields</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {(datasetsData?.data ?? []).map((dataset) => (
              <tr key={dataset.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                      <Database className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{dataset.name}</div>
                      <div className="line-clamp-1 text-[11px] text-slate-500">
                        {dataset.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{dataset.category || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{dataset.dataSource || '—'}</td>
                <td className="px-4 py-3 font-mono">{dataset.recordCount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono">{dataset.fieldCount}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                    {dataset.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(dataset)}
                      className="rounded p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      title="Edit metadata"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openFields(dataset)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <Layers className="h-3 w-3" />
                      Fields
                    </button>
                    <button
                      onClick={() => handleDelete(dataset)}
                      className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete dataset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <DatasetFormModal
          title="Create Dataset"
          form={createForm}
          setForm={setCreateForm}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
          submitLabel="Create Dataset"
        />
      )}

      {editTarget && (
        <DatasetFormModal
          title="Edit Dataset"
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
          submitLabel="Save Changes"
        />
      )}

      {fieldsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Fields &amp; Records: {fieldsTarget.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {fields.length} field definitions • {fieldsTarget.recordCount.toLocaleString()}{' '}
                  records
                </p>
              </div>
              <button
                onClick={() => setFieldsTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto py-4 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Field Definitions
                </h4>
                <div className="space-y-2">
                  {fields.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
                      No fields configured yet.
                    </div>
                  ) : (
                    fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                            {field.fieldLabel}
                            <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-mono uppercase text-slate-500 border border-slate-200">
                              {field.dataType}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {field.fieldKey}
                            {field.isRequired ? ' • required' : ''}
                            {field.isSearchable ? ' • searchable' : ''}
                            {field.isFilterable ? ' • filterable' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditField(field)}
                            className="rounded p-1 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit field"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete field"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <form
                  onSubmit={handleSaveField}
                  className="rounded-lg border border-slate-200 p-3 text-xs"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {editingFieldId ? 'Edit Field' : 'Add Field'}
                    </h4>
                    {editingFieldId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFieldId(null);
                          setFieldForm(emptyFieldForm);
                        }}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-700"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={fieldForm.fieldKey}
                      onChange={(e) =>
                        setFieldForm((prev) => ({ ...prev, fieldKey: e.target.value }))
                      }
                      placeholder="field_key"
                      required
                      className="rounded-lg border border-slate-300 p-2 font-mono text-[11px]"
                    />
                    <input
                      value={fieldForm.fieldLabel}
                      onChange={(e) =>
                        setFieldForm((prev) => ({ ...prev, fieldLabel: e.target.value }))
                      }
                      placeholder="Field Label"
                      required
                      className="rounded-lg border border-slate-300 p-2 text-[11px]"
                    />
                  </div>
                  <select
                    value={fieldForm.dataType}
                    onChange={(e) =>
                      setFieldForm((prev) => ({
                        ...prev,
                        dataType: e.target.value as DatasetField['dataType'],
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-[11px]"
                  >
                    {DATA_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={fieldForm.isRequired}
                        onChange={(e) =>
                          setFieldForm((prev) => ({ ...prev, isRequired: e.target.checked }))
                        }
                      />
                      Required
                    </label>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={fieldForm.isSearchable}
                        onChange={(e) =>
                          setFieldForm((prev) => ({ ...prev, isSearchable: e.target.checked }))
                        }
                      />
                      Searchable
                    </label>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={fieldForm.isFilterable}
                        onChange={(e) =>
                          setFieldForm((prev) => ({ ...prev, isFilterable: e.target.checked }))
                        }
                      />
                      Filterable
                    </label>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={fieldForm.isSortable}
                        onChange={(e) =>
                          setFieldForm((prev) => ({ ...prev, isSortable: e.target.checked }))
                        }
                      />
                      Sortable
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700"
                  >
                    <Save className="h-3 w-3" />
                    {editingFieldId ? 'Update Field' : 'Add Field'}
                  </button>
                </form>

                <div className="rounded-lg border border-slate-200 p-3 text-xs">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
                    Generate Sample Records
                  </h4>
                  <div className="flex items-end gap-2">
                    <label className="flex-1 text-[10px] font-semibold text-slate-600">
                      Count
                      <input
                        type="number"
                        min={1}
                        max={5000}
                        value={generateCount}
                        onChange={(e) => setGenerateCount(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-[11px]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-700"
                    >
                      Generate
                    </button>
                  </div>
                  <label className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={generateClear}
                      onChange={(e) => setGenerateClear(e.target.checked)}
                    />
                    Clear existing records first
                  </label>
                </div>

                <div className="rounded-lg border border-slate-200 p-3 text-xs">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Upload className="h-3.5 w-3.5 text-indigo-500" />
                    Import JSON Records
                  </h4>
                  <textarea
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-[10px]"
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 text-[10px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={importClear}
                        onChange={(e) => setImportClear(e.target.checked)}
                      />
                      Clear existing records first
                    </label>
                    <button
                      type="button"
                      onClick={handleImport}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700"
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setFieldsTarget(null)}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DatasetFormModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  submitLabel,
}: {
  title: string;
  form: { name: string; description: string; category: string; dataSource: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; description: string; category: string; dataSource: string }>
  >;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700">Dataset Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Finance"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Data Source</label>
              <input
                value={form.dataSource}
                onChange={(e) => setForm((prev) => ({ ...prev, dataSource: e.target.value }))}
                placeholder="e.g. ERP / API"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
