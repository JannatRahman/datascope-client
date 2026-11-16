'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
      <p className="max-w-md text-sm text-slate-600">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-slate-400">Reference: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  );
}
