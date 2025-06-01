
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { SecurityConfiguration } from '../../components/admin/SecurityConfiguration';

const SecurityConfig = () => {
  return (
    <AdminDashboardLayout>
      <SecurityConfiguration />
    </AdminDashboardLayout>
  );
};

export default SecurityConfig;
