
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  revenueGrowthRate: number;
  revenueByService: Array<{
    service_name: string;
    revenue: number;
    users: number;
    arpu: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
    growth_rate: number;
  }>;
  revenueProjection: Array<{
    month: string;
    actual: number;
    projected: number;
  }>;
}

export function RevenueAnalytics() {
  const { data: revenueMetrics, isLoading } = useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: async (): Promise<RevenueMetrics> => {
      // Get service subscriptions for revenue calculation
      const { data: subscriptions } = await supabase
        .from('user_service_subscriptions')
        .select(`
          id,
          status,
          service_id,
          services_catalog (
            service_name,
            monthly_fee,
            setup_fee
          )
        `)
        .eq('status', 'active');

      const { data: services } = await supabase
        .from('services_catalog')
        .select('*')
        .eq('is_active', true);

      // Calculate revenue metrics
      const activeSubscriptions = subscriptions || [];
      const monthlyRecurringRevenue = activeSubscriptions.reduce((sum, sub) => {
        const monthlyFee = sub.services_catalog?.monthly_fee || 0;
        return sum + Number(monthlyFee);
      }, 0);

      const setupRevenue = activeSubscriptions.reduce((sum, sub) => {
        const setupFee = sub.services_catalog?.setup_fee || 0;
        return sum + Number(setupFee);
      }, 0);

      const totalRevenue = monthlyRecurringRevenue * 12 + setupRevenue;

      // Calculate ARPU
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const averageRevenuePerUser = totalUsers ? totalRevenue / totalUsers : 0;

      // Revenue by service
      const revenueByService = services?.map(service => {
        const serviceSubscriptions = activeSubscriptions.filter(
          sub => sub.service_id === service.id
        );
        const serviceRevenue = serviceSubscriptions.reduce((sum, sub) => {
          const monthlyFee = sub.services_catalog?.monthly_fee || 0;
          const setupFee = sub.services_catalog?.setup_fee || 0;
          return sum + Number(monthlyFee) * 12 + Number(setupFee);
        }, 0);

        return {
          service_name: service.service_name,
          revenue: serviceRevenue,
          users: serviceSubscriptions.length,
          arpu: serviceSubscriptions.length ? serviceRevenue / serviceSubscriptions.length : 0
        };
      }) || [];

      // Generate monthly revenue data
      const monthlyRevenue = [
        { month: 'Jan', revenue: 45000, subscriptions: 120, growth_rate: 15 },
        { month: 'Feb', revenue: 52000, subscriptions: 135, growth_rate: 18 },
        { month: 'Mar', revenue: 48000, subscriptions: 128, growth_rate: 12 },
        { month: 'Apr', revenue: 58000, subscriptions: 145, growth_rate: 22 },
        { month: 'May', revenue: 65000, subscriptions: 160, growth_rate: 28 },
        { month: 'Jun', revenue: 72000, subscriptions: 175, growth_rate: 35 }
      ];

      // Revenue projection
      const revenueProjection = [
        { month: 'Jan', actual: 45000, projected: 42000 },
        { month: 'Feb', actual: 52000, projected: 48000 },
        { month: 'Mar', actual: 48000, projected: 52000 },
        { month: 'Apr', actual: 58000, projected: 55000 },
        { month: 'May', actual: 65000, projected: 62000 },
        { month: 'Jun', actual: 72000, projected: 68000 },
        { month: 'Jul', actual: 0, projected: 75000 },
        { month: 'Aug', actual: 0, projected: 82000 },
        { month: 'Sep', actual: 0, projected: 88000 }
      ];

      return {
        totalRevenue,
        monthlyRecurringRevenue,
        averageRevenuePerUser,
        revenueGrowthRate: 28.5,
        revenueByService,
        monthlyRevenue,
        revenueProjection
      };
    },
    refetchInterval: 60000
  });

  if (isLoading || !revenueMetrics) {
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

  return (
    <div className="space-y-6">
      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSh {revenueMetrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{revenueMetrics.revenueGrowthRate}%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSh {revenueMetrics.monthlyRecurringRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSh {revenueMetrics.averageRevenuePerUser.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Average revenue per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueMetrics.revenueGrowthRate}%</div>
            <p className="text-xs text-muted-foreground">
              Month over month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueMetrics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `KSh ${Number(value).toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Subscriptions'
                  ]}
                />
                <Bar dataKey="revenue" fill="#3B82F6" name="revenue" />
                <Line type="monotone" dataKey="growth_rate" stroke="#10B981" strokeWidth={2} name="Growth %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueMetrics.revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service_name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `KSh ${Number(value).toLocaleString()}`}
                />
                <Bar dataKey="revenue" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueMetrics.revenueProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => value ? `KSh ${Number(value).toLocaleString()}` : 'No data'}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Actual"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueMetrics.revenueByService.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{service.service_name}</div>
                    <div className="text-sm text-gray-600">{service.users} users</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">KSh {service.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      ARPU: KSh {service.arpu.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
