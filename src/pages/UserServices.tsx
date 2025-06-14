
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { UserServicesCatalog } from '../components/services/UserServicesCatalog';

const UserServices = () => {
  return (
    <ClientDashboardLayout>
      <UserServicesCatalog />
    </ClientDashboardLayout>
  );
};

export default UserServices;
