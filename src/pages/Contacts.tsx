
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { ContactManager } from '../components/messaging/sms/ContactManager';

const Contacts = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Contact Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Manage your contact lists, import contacts, and organize your audience for targeted campaigns.
          </p>
        </div>
        <ContactManager />
      </div>
    </ClientDashboardLayout>
  );
};

export default Contacts;
