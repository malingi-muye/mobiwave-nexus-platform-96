
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ClientAnalyticsData {
  serviceUsage: Array<{
    date: string;
    sms_sent: number;
    cost: number;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
    services: number;
  }>;
  serviceBreakdown: Array<{
    name: string;
    usage: number;
    cost: number;
    color: string;
  }>;
  usagePatterns: Array<{
    hour: number;
    activity: number;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function ClientAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['client-analytics', timeRange],
    queryFn: async (): Promise<ClientAnalyticsData> => {
      // Generate sample service usage data
      const serviceUsage = [];
      const daysToShow = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        serviceUsage.push({
          date: date.toISOString().split('T')[0],
          sms_sent: Math.floor(Math.random() * 100) + 20,
          cost: (Math.random() * 500) + 100
        });
      }

      // Monthly spending data
      const monthlySpending = [
        { month: 'Jan', amount: 15000, services: 3 },
        { month: 'Feb', amount: 18500, services: 4 },
        { month: 'Mar', amount: 22000, services: 4 },
        { month: 'Apr', amount: 19500, services: 5 },
        { month: 'May', amount: 25000, services: 5 },
        { month: 'Jun', amount: 28000, services: 6 }
      ];

      // Service breakdown
      const serviceBreakdown = [
        { name: 'SMS', usage: 65, cost: 18500, color: COLORS[0] },
        { name: 'WhatsApp', usage: 25, cost: 7500, color: COLORS[1] },
        { name: 'USSD', usage: 8, cost: 2400, color: COLORS[2] },
        { name: 'M-Pesa', usage: 2, cost: 600, color: COLORS[3] }
      ];

      // Usage patterns by hour
      const usagePatterns = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.floor(Math.random() * 50) + 10
      }));

      return {
        serviceUsage,
        monthlySpending,
        serviceBreakdown,
        usagePatterns
      };
    },
    refetchInterval: 30000
  });

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalCost = analyticsData.monthlySpending.reduce((sum, month) => sum + month.amount, 0);
  const totalMessages = analyticsData.serviceUsage.reduce((sum, day) => sum + day.sms_sent, 0);
  const averageDailyCost = analyticsData.serviceUsage.reduce((sum, day) => sum + day.cost, 0) / analyticsData.serviceUsage.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Analytics</h2>
          <p className="text-gray-600">Track your service usage and spending</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {averageDailyCost.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage & Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.serviceUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        name === 'cost' ? `KSh ${Number(value).toLocaleString()}` : value,
                        name === 'cost' ? 'Cost' : 'Messages'
                      ]}
                    />
                    <Line type="monotone" dataKey="sms_sent" stroke="#3B82F6" strokeWidth={2} name="sms_sent" />
                    <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} name="cost" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Usage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="usage"
                      label={({ name, usage }) => `${name}: ${usage}%`}
                    >
                      {analyticsData.serviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `KSh ${Number(value).toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.serviceBreakdown.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: service.color }}
                        />
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-600">{service.usage}% usage</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">KSh {service.cost.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.usagePatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="activity" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
