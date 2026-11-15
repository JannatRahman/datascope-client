import { AppNavbar } from '../components/layout/AppNavbar';
import { DatasetLibrary } from '../features/datasets/DatasetLibrary';

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNavbar />
      <main className="flex-1">
        <DatasetLibrary />
      </main>
    </div>
  );
}
