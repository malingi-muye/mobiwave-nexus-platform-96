
import React from 'react';
import { ClientMetrics } from '../dashboard/ClientMetrics';
import { CampaignsList } from '../dashboard/CampaignsList';

export function ClientDashboard() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Welcome back
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Monitor your messaging campaigns and track performance with real-time analytics and insights.
        </p>
      </div>
      
      <ClientMetrics />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <CampaignsList />
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-100">
                <div className="font-medium text-blue-900">Create SMS Campaign</div>
                <div className="text-sm text-blue-600">Launch bulk messaging</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-100">
                <div className="font-medium text-green-900">Send Email Blast</div>
                <div className="text-sm text-green-600">Reach your audience</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-colors border border-purple-100">
                <div className="font-medium text-purple-900">View Analytics</div>
                <div className="text-sm text-purple-600">Track performance</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
