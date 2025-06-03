
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Activity,
  Target,
  Zap
} from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: campaignStats } = useQuery({
    queryKey: ['campaign-analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('status, type, created_at, recipient_count, delivered_count, failed_count')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const totalCampaigns = data?.length || 0;
      const activeCampaigns = data?.filter(c => c.status === 'active').length || 0;
      const completedCampaigns = data?.filter(c => c.status === 'completed').length || 0;
      const totalRecipients = data?.reduce((sum, c) => sum + (c.recipient_count || 0), 0) || 0;
      const totalDelivered = data?.reduce((sum, c) => sum + (c.delivered_count || 0), 0) || 0;

      return {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalRecipients,
        totalDelivered,
        deliveryRate: totalRecipients > 0 ? (totalDelivered / totalRecipients) * 100 : 0
      };
    }
  });

  const { data: userGrowth } = useQuery({
    queryKey: ['user-growth', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (error) throw error;

      // Group by day
      const growthData = [];
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toISOString().split('T')[0],
          count: 0
        });
      }

      data?.forEach(user => {
        const userDate = new Date(user.created_at).toISOString().split('T')[0];
        const dayData = last7Days.find(d => d.date === userDate);
        if (dayData) {
          dayData.count++;
        }
      });

      return last7Days.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: day.count
      }));
    }
  });

  const campaignTypeData = [
    { name: 'SMS', value: 65, color: '#3B82F6' },
    { name: 'Email', value: 25, color: '#10B981' },
    { name: 'WhatsApp', value: 10, color: '#F59E0B' }
  ];

  const performanceMetrics = [
    {
      title: "Total Campaigns",
      value: campaignStats?.totalCampaigns || 0,
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Messages Sent",
      value: campaignStats?.totalDelivered || 0,
      change: "+23%",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-green-900 via-green-800 to-green-700 bg-clip-text text-transparent">
              Analytics Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Comprehensive analytics and insights into platform performance and user engagement.
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              User Growth
            </CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Campaign Distribution
            </CardTitle>
            <CardDescription>
              Campaign types by usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {campaignTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {campaignTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Campaign Performance Summary
          </CardTitle>
          <CardDescription>
            Key performance indicators for recent campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                {campaignStats?.deliveryRate.toFixed(1) || 0}%
              </h3>
              <p className="text-blue-700 font-medium">Delivery Rate</p>
              <p className="text-sm text-blue-600 mt-1">Average across all campaigns</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                {campaignStats?.activeCampaigns || 0}
              </h3>
              <p className="text-green-700 font-medium">Active Campaigns</p>
              <p className="text-sm text-green-600 mt-1">Currently running</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">
                {((campaignStats?.totalDelivered || 0) / 1000).toFixed(1)}K
              </h3>
              <p className="text-purple-700 font-medium">Messages Delivered</p>
              <p className="text-sm text-purple-600 mt-1">This period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
