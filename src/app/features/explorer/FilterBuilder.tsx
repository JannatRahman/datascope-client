'use client';

import React, { useState } from 'react';
import { Plus, Trash2, X, Filter, Check } from 'lucide-react';
import { DatasetFieldItem } from '../../api/endpoints/datasets.api';
import { FilterRule, FilterOperator } from '../../api/endpoints/records.api';

interface FilterBuilderProps {
  fields: DatasetFieldItem[];
  activeFilters: FilterRule[];
  filterLogic: 'AND' | 'OR';
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterRule[], logic: 'AND' | 'OR') => void;
}

export function FilterBuilder({
  fields,
  activeFilters,
  filterLogic: initialLogic,
  isOpen,
  onClose,
  onApply,
}: FilterBuilderProps) {
  const [rules, setRules] = useState<FilterRule[]>(() => {
    return activeFilters.length > 0
      ? JSON.parse(JSON.stringify(activeFilters))
      : [{ field: fields[0]?.fieldKey ?? '', operator: 'equals', value: '' }];
  });

  const [logic, setLogic] = useState<'AND' | 'OR'>(initialLogic);

  if (!isOpen) return null;

  const fieldMap = new Map(fields.map((f) => [f.fieldKey, f]));

  const getOperatorsForType = (dataType: string): { label: string; value: FilterOperator }[] => {
    switch (dataType) {
      case 'number':
        return [
          { label: 'equals (=)', value: 'equals' },
          { label: 'not equals (≠)', value: 'not_equals' },
          { label: 'greater than (>)', value: 'gt' },
          { label: 'greater or equal (≥)', value: 'gte' },
          { label: 'less than (<)', value: 'lt' },
          { label: 'less or equal (≤)', value: 'lte' },
          { label: 'between', value: 'between' },
          { label: 'is empty / null', value: 'is_null' },
          { label: 'is not empty', value: 'is_not_null' },
        ];
      case 'date':
        return [
          { label: 'on date (=)', value: 'equals' },
          { label: 'after date (>)', value: 'gt' },
          { label: 'on or after (≥)', value: 'gte' },
          { label: 'before date (<)', value: 'lt' },
          { label: 'on or before (≤)', value: 'lte' },
          { label: 'between dates', value: 'between' },
          { label: 'is empty / null', value: 'is_null' },
          { label: 'is not empty', value: 'is_not_null' },
        ];
      case 'boolean':
        return [
          { label: 'is', value: 'equals' },
          { label: 'is empty / null', value: 'is_null' },
          { label: 'is not empty', value: 'is_not_null' },
        ];
      default:
        return [
          { label: 'contains', value: 'contains' },
          { label: 'equals', value: 'equals' },
          { label: 'not equals', value: 'not_equals' },
          { label: 'does not contain', value: 'not_contains' },
          { label: 'starts with', value: 'starts_with' },
          { label: 'ends with', value: 'ends_with' },
          { label: 'is empty / null', value: 'is_null' },
          { label: 'is not empty', value: 'is_not_null' },
        ];
    }
  };

  const handleFieldChange = (index: number, newFieldKey: string) => {
    const fDef = fieldMap.get(newFieldKey);
    const newRules = [...rules];
    const defaultOp = fDef?.dataType === 'number' ? 'equals' : 'contains';
    newRules[index] = {
      field: newFieldKey,
      operator: defaultOp,
      value: '',
    };
    setRules(newRules);
  };

  const handleOperatorChange = (index: number, newOp: FilterOperator) => {
    const newRules = [...rules];
    const isBetween = newOp === 'between';
    newRules[index] = {
      ...newRules[index],
      operator: newOp,
      value: isBetween ? ['', ''] : '',
    };
    setRules(newRules);
  };

  const handleValueChange = (index: number, newVal: unknown) => {
    const newRules = [...rules];
    newRules[index] = {
      ...newRules[index],
      value: newVal,
    };
    setRules(newRules);
  };

  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      {
        field: fields[0]?.fieldKey ?? '',
        operator: 'contains',
        value: '',
      },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    // Sanitize rules: keep rules that either don't require value or have non-empty value
    const valid = rules.filter((r) => {
      if (r.operator === 'is_null' || r.operator === 'is_not_null') return true;
      if (r.operator === 'between') {
        return (
          Array.isArray(r.value) &&
          r.value[0] !== '' &&
          r.value[0] !== undefined &&
          r.value[1] !== '' &&
          r.value[1] !== undefined
        );
      }
      return r.value !== '' && r.value !== undefined && r.value !== null;
    });

    onApply(valid, logic);
    onClose();
  };

  const handleClearAll = () => {
    setRules([]);
    onApply([], 'AND');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Advanced Filter Builder</h2>
              <p className="text-xs text-slate-500">
                Filter live records with multi-condition rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Logic Toggle */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Condition Match:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setLogic('AND')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  logic === 'AND'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Match ALL (AND)
              </button>
              <button
                type="button"
                onClick={() => setLogic('OR')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  logic === 'OR'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Match ANY (OR)
              </button>
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule, idx) => {
              const currentField = fieldMap.get(rule.field);
              const dataType = currentField?.dataType ?? 'text';
              const availableOps = getOperatorsForType(dataType);

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:flex-row sm:items-center"
                >
                  {/* Field Selector */}
                  <div className="flex-1 min-w-[140px]">
                    <select
                      value={rule.field}
                      onChange={(e) => handleFieldChange(idx, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                    >
                      {fields.map((f) => (
                        <option key={f.fieldKey} value={f.fieldKey}>
                          {f.fieldLabel} ({f.dataType})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operator Selector */}
                  <div className="w-full sm:w-40">
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleOperatorChange(idx, e.target.value as FilterOperator)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                    >
                      {availableOps.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value Input */}
                  {rule.operator !== 'is_null' && rule.operator !== 'is_not_null' && (
                    <div className="flex-1">
                      {rule.operator === 'between' ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type={dataType === 'date' ? 'date' : 'text'}
                            placeholder="Min"
                            value={(rule.value as [string, string])?.[0] ?? ''}
                            onChange={(e) =>
                              handleValueChange(idx, [
                                e.target.value,
                                (rule.value as [string, string])?.[1] ?? '',
                              ])
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                          />
                          <span className="text-xs text-slate-400">to</span>
                          <input
                            type={dataType === 'date' ? 'date' : 'text'}
                            placeholder="Max"
                            value={(rule.value as [string, string])?.[1] ?? ''}
                            onChange={(e) =>
                              handleValueChange(idx, [
                                (rule.value as [string, string])?.[0] ?? '',
                                e.target.value,
                              ])
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                          />
                        </div>
                      ) : dataType === 'boolean' ? (
                        <select
                          value={String(rule.value)}
                          onChange={(e) =>
                            handleValueChange(idx, e.target.value === 'true')
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                        >
                          <option value="true">True / Active</option>
                          <option value="false">False / Inactive</option>
                        </select>
                      ) : dataType === 'date' ? (
                        <input
                          type="date"
                          value={typeof rule.value === 'string' ? rule.value : ''}
                          onChange={(e) => handleValueChange(idx, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                        />
                      ) : (
                        <input
                          type={dataType === 'number' ? 'number' : 'text'}
                          placeholder="Filter value..."
                          value={typeof rule.value === 'string' || typeof rule.value === 'number' ? rule.value : ''}
                          onChange={(e) => handleValueChange(idx, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
                        />
                      )}
                    </div>
                  )}

                  {/* Delete Rule */}
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="self-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-rose-600 transition-colors"
                    title="Remove Rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add condition button */}
          <button
            type="button"
            onClick={handleAddRule}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Condition</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 rounded-b-2xl">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-slate-500 hover:text-rose-600"
          >
            Clear All
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
