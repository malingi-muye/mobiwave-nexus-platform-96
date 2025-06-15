
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { SystemSettings } from '../../components/admin/SystemSettings';

const Settings = () => {
  return (
    <AdminDashboardLayout>
      <SystemSettings />
    </AdminDashboardLayout>
  );
};

export default Settings;
