
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { DevOpsPipeline as DevOpsPipelineComponent } from '../../components/admin/devops/DevOpsPipeline';

const DevOpsPipeline = () => {
  return (
    <AdminDashboardLayout>
      <DevOpsPipelineComponent />
    </AdminDashboardLayout>
  );
};

export default DevOpsPipeline;
