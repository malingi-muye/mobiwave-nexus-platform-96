
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { AvailableServicesGrid } from '../components/services/AvailableServicesGrid';

const ServiceRequests = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <AvailableServicesGrid />
      </div>
    </ClientDashboardLayout>
  );
};

export default ServiceRequests;
