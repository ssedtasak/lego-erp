'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h1>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          โหลดหน้าใหม่
        </button>
      </div>
    </div>
  );
}

export function ErrorBoundaryClient({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
