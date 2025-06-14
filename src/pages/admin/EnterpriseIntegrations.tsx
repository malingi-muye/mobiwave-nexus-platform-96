
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { EnterpriseIntegrationHub } from '../../components/admin/enterprise/EnterpriseIntegrationHub';

const EnterpriseIntegrations = () => {
  return (
    <AdminDashboardLayout>
      <EnterpriseIntegrationHub />
    </AdminDashboardLayout>
  );
};

export default EnterpriseIntegrations;
