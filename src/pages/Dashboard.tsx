
import React from 'react';
import { UserProfile } from '../components/dashboard/UserProfile';
import { MessageInterface } from '../components/messaging/MessageInterface';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserProfile />
          </div>
          <div className="lg:col-span-2">
            <MessageInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
