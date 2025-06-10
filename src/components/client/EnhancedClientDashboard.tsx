import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { useSMSService } from '@/hooks/useSMSService';
import { 
  Users, 
  Campaign, 
  Mail, 
  MessageSquare, 
  TrendingUp,
  Activity,
  Server
} from 'lucide-react';

export function EnhancedClientDashboard() {
  const { data: userCredits } = useUserCredits();
  const { data: systemMetrics } = useSystemMetrics();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* User Statistics */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">{systemMetrics?.totalUsers || 0}</div>
          <p className="text-sm text-blue-700">Registered users on the platform</p>
        </div>
      </div>

      {/* Campaign Statistics */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-900">Active Campaigns</h3>
          <Campaign className="w-6 h-6 text-green-600" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-green-600">{systemMetrics?.activeCampaigns || 0}</div>
          <p className="text-sm text-green-700">Currently running campaigns</p>
        </div>
      </div>

      {/* Messages Sent */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Total Messages</h3>
          <MessageSquare className="w-6 h-6 text-purple-600" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-600">{systemMetrics?.totalMessages || 0}</div>
          <p className="text-sm text-purple-700">Total messages sent across all campaigns</p>
        </div>
      </div>

      {/* Credit Balance */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-yellow-900">Credit Balance</h3>
          <CreditCard className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-yellow-600">${userCredits?.credits_remaining?.toFixed(2) || '0.00'}</div>
          <p className="text-sm text-yellow-700">Remaining credits for sending messages</p>
        </div>
      </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-900">Credits Used</h3>
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                ${((userCredits?.total_purchased || 0) - (userCredits?.credits_remaining || 0)).toFixed(2)}
              </div>
              <p className="text-sm text-orange-700">Total spent on campaigns</p>
            </div>
          </div>

      {/* System Health */}
      <div className="bg-gradient-to-br from-gray-50 to-zinc-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <Server className="w-6 h-6 text-gray-600" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-600">{systemMetrics?.systemHealth || 'N/A'}</div>
          <p className="text-sm text-gray-700">Overall system status</p>
        </div>
      </div>
    </div>
  );
}
