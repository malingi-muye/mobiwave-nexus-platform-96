
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { BulkSMS } from '../components/messaging/BulkSMS';

const SMS = () => {
  return (
    <ClientDashboardLayout>
      <BulkSMS />
    </ClientDashboardLayout>
  );
};

export default SMS;
