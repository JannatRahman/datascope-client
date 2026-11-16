import { AppNavbar } from '../components/layout/AppNavbar';
import { ClientOnly } from '../components/ClientOnly';
import { DatasetLibrary } from '../features/datasets/DatasetLibrary';

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar />
      <main className="flex-1">
        <ClientOnly
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          }
        >
          <DatasetLibrary />
        </ClientOnly>
      </main>
    </div>
  );
}
