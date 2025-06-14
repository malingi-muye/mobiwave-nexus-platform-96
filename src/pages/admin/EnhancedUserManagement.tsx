
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { UserManagementDashboard } from '../../components/admin/users/UserManagementDashboard';

const EnhancedUserManagement = () => {
  return (
    <AdminDashboardLayout>
      <UserManagementDashboard />
    </AdminDashboardLayout>
  );
};

export default EnhancedUserManagement;
