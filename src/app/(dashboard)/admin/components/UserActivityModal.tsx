'use client';

import React from 'react';
import { X, Activity, Search, Download, Bookmark, Clock } from 'lucide-react';
import { useGetUserActivityQuery } from '../../../api/endpoints/admin.api';

interface UserActivityModalProps {
  userId: string;
  name: string;
  onClose: () => void;
}

export function UserActivityModal({ userId, name, onClose }: UserActivityModalProps) {
  const { data, isLoading } = useGetUserActivityQuery({ userId, page: 1, pageSize: 25 });
  const summary = data?.summary;
  const logs = data?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Activity: {name}</h3>
            <p className="text-xs text-slate-500">
              {data?.user?.email ?? ''} {data?.user?.roleName ? `• ${data.user.roleName}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard
                icon={<Activity className="h-3.5 w-3.5 text-indigo-500" />}
                label="Actions"
                value={summary?.totalActions ?? 0}
              />
              <SummaryCard
                icon={<Clock className="h-3.5 w-3.5 text-emerald-500" />}
                label="Sessions"
                value={summary?.activeSessions ?? 0}
              />
              <SummaryCard
                icon={<Search className="h-3.5 w-3.5 text-amber-500" />}
                label="Searches"
                value={summary?.totalSearches ?? 0}
              />
              <SummaryCard
                icon={<Download className="h-3.5 w-3.5 text-purple-500" />}
                label="Exports"
                value={summary?.totalExports ?? 0}
              />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
                Saved views: <strong>{summary?.totalSavedViews ?? 0}</strong>
              </span>
              <span>
                Last active:{' '}
                <strong>
                  {summary?.lastActiveAt
                    ? new Date(summary.lastActiveAt).toLocaleString()
                    : 'No activity recorded'}
                </strong>
              </span>
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-slate-200">
              {logs.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No activity has been recorded for this user.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{log.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600">{log.description}</div>
                      <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-500">
                        {log.activityType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5">
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}
