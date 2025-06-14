
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { AdvancedAnalyticsHub } from '../../components/admin/analytics/AdvancedAnalyticsHub';

const AdvancedAnalytics = () => {
  return (
    <AdminDashboardLayout>
      <AdvancedAnalyticsHub />
    </AdminDashboardLayout>
  );
};

export default AdvancedAnalytics;
