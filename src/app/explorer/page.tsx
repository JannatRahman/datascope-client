import React, { Suspense } from 'react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { DataExplorerView } from '../features/explorer/DataExplorerView';

export default function ExplorerPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <AppNavbar />
      <main className="flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <span className="text-xs font-medium text-slate-500">
                  Loading Data Explorer...
                </span>
              </div>
            </div>
          }
        >
          <DataExplorerView />
        </Suspense>
      </main>
    </div>
  );
}
