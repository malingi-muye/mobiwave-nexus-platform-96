
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AdminDashboard as AdminDashboardComponent } from '../components/admin/AdminDashboard';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <AdminDashboardComponent />
    </DashboardLayout>
  );
};

export default AdminDashboard;
