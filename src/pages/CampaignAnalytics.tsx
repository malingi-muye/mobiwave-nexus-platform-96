
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { RealCampaignAnalytics } from '../components/analytics/RealCampaignAnalytics';

const CampaignAnalytics = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Campaign Analytics
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Track your campaign performance with detailed analytics and insights.
          </p>
        </div>
        <RealCampaignAnalytics />
      </div>
    </ClientDashboardLayout>
  );
};

export default CampaignAnalytics;
