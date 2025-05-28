
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { ClientDashboard } from '../components/client/ClientDashboard';

const Dashboard = () => {
  return (
    <ClientDashboardLayout>
      <ClientDashboard />
    </ClientDashboardLayout>
  );
};

export default Dashboard;
