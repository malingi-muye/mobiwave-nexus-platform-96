
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { CampaignPerformanceDashboard } from '../components/analytics/CampaignPerformanceDashboard';

const CampaignAnalytics = () => {
  return (
    <DashboardLayout>
      <CampaignPerformanceDashboard />
    </DashboardLayout>
  );
};

export default CampaignAnalytics;
