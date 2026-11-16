'use client';

import React from 'react';
import { Share2, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import {
  useGetSharedViewsQuery,
  useUpdateSharedViewMutation,
  useDeleteSharedViewMutation,
} from '../../../api/endpoints/admin.api';

export function SharedViewsTab() {
  const { data, refetch, isLoading } = useGetSharedViewsQuery();
  const [updateSharedView] = useUpdateSharedViewMutation();
  const [deleteSharedView] = useDeleteSharedViewMutation();

  const handleToggle = async (viewId: string, isShared: boolean) => {
    try {
      await updateSharedView({ viewId, isShared: !isShared }).unwrap();
      refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update sharing');
    }
  };

  const handleDelete = async (viewId: string) => {
    if (!confirm('Delete this shared saved view? This cannot be undone.')) return;

    try {
      await deleteSharedView(viewId).unwrap();
      refetch();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete saved view');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Shared Views Management</h2>
        <p className="text-xs text-slate-500">
          Review saved views across the platform, enable or disable cross-team visibility, and
          remove stale shared views.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Saved View</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Dataset</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Shares</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Loading saved views...
                </td>
              </tr>
            ) : (data?.data ?? []).length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  No saved views have been created yet.
                </td>
              </tr>
            ) : (
              (data?.data ?? []).map((view) => (
                <tr key={view.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-3.5 w-3.5 text-indigo-500" />
                      <div>
                        <div className="font-semibold text-slate-900">{view.name}</div>
                        <div className="line-clamp-1 text-[11px] text-slate-500">
                          {view.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700">{view.ownerName}</div>
                    <div className="text-[11px] text-slate-500">{view.ownerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{view.datasetName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        view.isShared
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {view.isShared ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {view.isShared ? 'Shared' : 'Private'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Users className="h-3 w-3 text-slate-400" />
                      {view.shareCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">
                    {new Date(view.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggle(view.id, view.isShared)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        {view.isShared ? 'Make Private' : 'Enable Sharing'}
                      </button>
                      <button
                        onClick={() => handleDelete(view.id)}
                        className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete saved view"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
