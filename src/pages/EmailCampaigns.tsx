
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { EmailCampaignManager } from '../components/messaging/email/EmailCampaignManager';

const EmailCampaigns = () => {
  return (
    <DashboardLayout>
      <EmailCampaignManager />
    </DashboardLayout>
  );
};

export default EmailCampaigns;
