
import React from 'react';
import { ClientDashboardLayout } from '../components/client/ClientDashboardLayout';
import { ContactsManager } from '../components/contacts/ContactsManager';

const Contacts = () => {
  return (
    <ClientDashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Contact Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Manage your contact database, create groups, and organize your messaging campaigns.
          </p>
        </div>
        <ContactsManager />
      </div>
    </ClientDashboardLayout>
  );
};

export default Contacts;
