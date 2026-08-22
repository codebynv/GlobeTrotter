import React from 'react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400" />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
      <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded-md mb-2" />
      <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
    </div>
  );
}
