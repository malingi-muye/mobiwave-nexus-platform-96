
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { EnhancedServicesManagement } from '../../components/admin/services/EnhancedServicesManagement';

const Services = () => {
  return (
    <AdminDashboardLayout>
      <EnhancedServicesManagement />
    </AdminDashboardLayout>
  );
};

export default Services;
