
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ClientDashboard } from '../components/client/ClientDashboard';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ClientDashboard />
    </DashboardLayout>
  );
};

export default Dashboard;
