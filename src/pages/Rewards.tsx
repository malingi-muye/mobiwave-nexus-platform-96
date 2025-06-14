
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { RewardsDashboard } from '../components/rewards/RewardsDashboard';

const Rewards = () => {
  return (
    <ClientDashboardLayout>
      <RewardsDashboard />
    </ClientDashboardLayout>
  );
};

export default Rewards;
