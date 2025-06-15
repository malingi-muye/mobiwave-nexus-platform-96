
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { EnhancedUserManagement } from '../../components/admin/EnhancedUserManagement';

const Users = () => {
  return (
    <AdminDashboardLayout>
      <EnhancedUserManagement />
    </AdminDashboardLayout>
  );
};

export default Users;
