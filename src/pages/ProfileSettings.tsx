
import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ProfileSettings as ProfileSettingsComponent } from '../components/dashboard/ProfileSettings';

const ProfileSettings = () => {
  return (
    <DashboardLayout>
      <ProfileSettingsComponent />
    </DashboardLayout>
  );
};

export default ProfileSettings;
