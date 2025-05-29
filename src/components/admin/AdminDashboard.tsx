
import React from 'react';
import { AdminMetrics } from '../dashboard/AdminMetrics';

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
      
      <AdminMetrics />
    </div>
  );
}
