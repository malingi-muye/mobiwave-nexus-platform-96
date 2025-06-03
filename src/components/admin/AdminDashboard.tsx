
import React, { Suspense, lazy } from 'react';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';

// Lazy load heavy components
const AdminMetrics = lazy(() => import('../dashboard/AdminMetrics').then(module => ({ default: module.AdminMetrics })));

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-red-800 to-purple-800 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor system health, manage services, and oversee platform operations with comprehensive administrative tools.
        </p>
      </div>
      
      <Suspense fallback={
        <LoadingWrapper 
          isLoading={true} 
          skeletonRows={4}
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          }
        >
          <div />
        </LoadingWrapper>
      }>
        <AdminMetrics />
      </Suspense>
    </div>
  );
}
