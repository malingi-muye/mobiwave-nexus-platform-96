
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { UserSubscriptionsManager } from '../components/services/UserSubscriptionsManager';

const MySubscriptions = () => {
  return (
    <ClientDashboardLayout>
      <UserSubscriptionsManager />
    </ClientDashboardLayout>
  );
};

export default MySubscriptions;
