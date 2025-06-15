
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { ClientAnalyticsDashboard } from '../components/analytics/ClientAnalyticsDashboard';

const ClientAnalytics = () => {
  return (
    <ClientDashboardLayout>
      <ClientAnalyticsDashboard />
    </ClientDashboardLayout>
  );
};

export default ClientAnalytics;
