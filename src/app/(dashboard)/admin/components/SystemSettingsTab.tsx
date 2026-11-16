'use client';

import React, { useState } from 'react';
import { Save, RotateCcw, Trash2, Server, Search, ShieldCheck, Settings2 } from 'lucide-react';
import {
  SystemSettings,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useResetSystemSettingsMutation,
  useClearSystemCacheMutation,
} from '../../../api/endpoints/admin.api';

export function SystemSettingsTab() {
  const { data, refetch } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSystemSettingsMutation();
  const [resetSettings] = useResetSystemSettingsMutation();
  const [clearCache, { isLoading: isClearing }] = useClearSystemCacheMutation();
  const [draft, setDraft] = useState<Partial<SystemSettings>>({});
  const form: SystemSettings | null = data?.data ? { ...data.data, ...draft } : null;

  if (!form) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const setValue = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateSettings(form).unwrap();
      setDraft({});
      alert('Platform settings saved successfully.');
      refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all platform settings to their defaults?')) return;

    try {
      await resetSettings().unwrap();
      setDraft({});
      alert('Platform settings reset to defaults.');
      refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to reset settings');
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Clear every cached dataset, analytics and session entry?')) return;

    try {
      await clearCache().unwrap();
      alert('Distributed cache cleared successfully.');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">System Settings</h2>
          <p className="text-xs text-slate-500">
            Configure platform identity, pagination defaults, cache behaviour, search limits and
            access policies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SettingsCard
          icon={<Settings2 className="h-4 w-4 text-indigo-500" />}
          title="Platform Configuration"
        >
          <TextInput
            label="Platform Name"
            value={form.platformName}
            onChange={(value) => setValue('platformName', value)}
          />
          <TextInput
            label="Support Email"
            type="email"
            value={form.supportEmail}
            onChange={(value) => setValue('supportEmail', value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label="Timezone"
              value={form.timezone}
              onChange={(value) => setValue('timezone', value)}
            />
            <TextInput
              label="Date Format"
              value={form.dateFormat}
              onChange={(value) => setValue('dateFormat', value)}
            />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Server className="h-4 w-4 text-emerald-500" />}
          title="Pagination Defaults"
        >
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Default Page Size"
              value={form.defaultPageSize}
              min={1}
              max={1000}
              onChange={(value) => setValue('defaultPageSize', value)}
            />
            <NumberInput
              label="Maximum Page Size"
              value={form.maxPageSize}
              min={1}
              max={5000}
              onChange={(value) => setValue('maxPageSize', value)}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Applied to dataset tables, record explorers and administrative listings.
          </p>
        </SettingsCard>

        <SettingsCard
          icon={<Server className="h-4 w-4 text-amber-500" />}
          title="Cache Configuration"
        >
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.cacheEnabled}
              onChange={(e) => setValue('cacheEnabled', e.target.checked)}
            />
            Enable distributed Redis caching
          </label>
          <NumberInput
            label="Cache TTL (seconds)"
            value={form.cacheTtlSeconds}
            min={0}
            max={86400}
            onChange={(value) => setValue('cacheTtlSeconds', value)}
          />
          <button
            type="button"
            onClick={handleClearCache}
            disabled={isClearing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
          >
            <Trash2 className="h-3 w-3" />
            {isClearing ? 'Clearing...' : 'Clear Cache Now'}
          </button>
        </SettingsCard>

        <SettingsCard
          icon={<Search className="h-4 w-4 text-purple-500" />}
          title="Search Configuration"
        >
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Minimum Query Length"
              value={form.searchMinLength}
              min={1}
              max={20}
              onChange={(value) => setValue('searchMinLength', value)}
            />
            <NumberInput
              label="Maximum Results"
              value={form.searchMaxResults}
              min={1}
              max={10000}
              onChange={(value) => setValue('searchMaxResults', value)}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Controls validation for full-text searches across all dataset records.
          </p>
        </SettingsCard>

        <SettingsCard
          icon={<ShieldCheck className="h-4 w-4 text-rose-500" />}
          title="Access & Maintenance"
        >
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.allowUserRegistration}
              onChange={(e) => setValue('allowUserRegistration', e.target.checked)}
            />
            Allow self-service user registration
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setValue('maintenanceMode', e.target.checked)}
            />
            Enable maintenance mode
          </label>
          <NumberInput
            label="Session Timeout (minutes)"
            value={form.sessionTimeoutMinutes}
            min={5}
            max={10080}
            onChange={(value) => setValue('sessionTimeoutMinutes', value)}
          />
        </SettingsCard>
      </div>
    </form>
  );
}

function SettingsCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[11px] font-semibold text-slate-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block text-[11px] font-semibold text-slate-600">
      {label}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden"
      />
    </label>
  );
}
