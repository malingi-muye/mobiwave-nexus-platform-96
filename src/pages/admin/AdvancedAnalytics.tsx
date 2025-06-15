
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { AdminAnalyticsDashboard } from '../../components/analytics/AdminAnalyticsDashboard';

const AdvancedAnalytics = () => {
  return (
    <AdminDashboardLayout>
      <AdminAnalyticsDashboard />
    </AdminDashboardLayout>
  );
};

export default AdvancedAnalytics;
