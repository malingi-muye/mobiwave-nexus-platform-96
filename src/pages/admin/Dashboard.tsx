
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { AdminDashboard as AdminDashboardComponent } from '../../components/admin/AdminDashboard';

const Dashboard = () => {
  return (
    <AdminDashboardLayout>
      <AdminDashboardComponent />
    </AdminDashboardLayout>
  );
};

export default Dashboard;
