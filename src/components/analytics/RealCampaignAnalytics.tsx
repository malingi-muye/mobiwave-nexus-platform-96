
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Send, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';

interface CampaignAnalytics {
  totalCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalCost: number;
  campaignsByStatus: Array<{ name: string; value: number; color: string }>;
  dailyStats: Array<{ date: string; sent: number; delivered: number; cost: number }>;
  monthlyTrends: Array<{ month: string; campaigns: number; success_rate: number }>;
}

export function RealCampaignAnalytics() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['campaign-analytics'],
    queryFn: async (): Promise<CampaignAnalytics> => {
      // Get campaigns data
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*');

      if (campaignsError) throw campaignsError;

      // Get message history data
      const { data: messages, error: messagesError } = await supabase
        .from('message_history')
        .select('*');

      if (messagesError) throw messagesError;

      const totalCampaigns = campaigns?.length || 0;
      const totalSent = messages?.filter(m => m.status === 'sent' || m.status === 'delivered').length || 0;
      const totalDelivered = messages?.filter(m => m.status === 'delivered').length || 0;
      const totalFailed = messages?.filter(m => m.status === 'failed').length || 0;
      const totalCost = messages?.reduce((sum, m) => sum + (m.cost || 0), 0) || 0;

      // Campaign status distribution
      const statusCounts = campaigns?.reduce((acc, campaign) => {
        acc[campaign.status] = (acc[campaign.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const campaignsByStatus = [
        { name: 'Active', value: statusCounts.active || 0, color: '#10B981' },
        { name: 'Completed', value: statusCounts.completed || 0, color: '#3B82F6' },
        { name: 'Draft', value: statusCounts.draft || 0, color: '#F59E0B' },
        { name: 'Failed', value: statusCounts.failed || 0, color: '#EF4444' }
      ];

      // Daily stats for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyStats = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayMessages = messages?.filter(m => 
          m.created_at.startsWith(dateStr)
        ) || [];

        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sent: dayMessages.filter(m => m.status === 'sent' || m.status === 'delivered').length,
          delivered: dayMessages.filter(m => m.status === 'delivered').length,
          cost: dayMessages.reduce((sum, m) => sum + (m.cost || 0), 0)
        };
      });

      // Monthly trends for the last 6 months
      const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthCampaigns = campaigns?.filter(c => {
          const campaignDate = new Date(c.created_at);
          return campaignDate >= monthStart && campaignDate <= monthEnd;
        }) || [];

        const monthMessages = messages?.filter(m => {
          const messageDate = new Date(m.created_at);
          return messageDate >= monthStart && messageDate <= monthEnd;
        }) || [];

        const sent = monthMessages.filter(m => m.status === 'sent' || m.status === 'delivered').length;
        const delivered = monthMessages.filter(m => m.status === 'delivered').length;
        const success_rate = sent > 0 ? (delivered / sent) * 100 : 0;

        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          campaigns: monthCampaigns.length,
          success_rate: Math.round(success_rate)
        };
      });

      return {
        totalCampaigns,
        totalSent,
        totalDelivered,
        totalFailed,
        totalCost,
        campaignsByStatus,
        dailyStats,
        monthlyTrends
      };
    },
    staleTime: 300000 // 5 minutes
  });

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalCampaigns || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Messages Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalSent || 0}</p>
                </div>
                <Send className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalDelivered || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Failed</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics?.totalFailed || 0}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
                  <p className="text-3xl font-bold text-gray-900">${analytics?.totalCost?.toFixed(2) || '0.00'}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Status Distribution */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Campaign Status Distribution</CardTitle>
              <CardDescription>Breakdown of campaigns by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.campaignsByStatus || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {analytics?.campaignsByStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Monthly Success Rate</CardTitle>
              <CardDescription>Campaign performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.monthlyTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="success_rate" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Statistics */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Daily Message Statistics</CardTitle>
            <CardDescription>Messages sent and delivered over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics?.dailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                <Bar dataKey="delivered" fill="#10B981" name="Delivered" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </LoadingWrapper>
  );
}
