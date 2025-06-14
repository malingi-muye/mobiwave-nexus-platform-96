
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceLoadingWrapperProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  fallbackRows?: number;
}

export function ServiceLoadingWrapper({ 
  isLoading, 
  error, 
  children, 
  fallbackRows = 3 
}: ServiceLoadingWrapperProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error Loading Services</h3>
            <p className="text-sm text-gray-600 mt-2">{error.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: fallbackRows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return <>{children}</>;
}
