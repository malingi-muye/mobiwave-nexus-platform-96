
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, Activity, BarChart3, PieChart, Download } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const { events, getRevenueMetrics, getServiceMetrics, isLoading } = useAnalytics();

  const { totalRevenue, monthlyRevenue } = getRevenueMetrics();
  const serviceBreakdown = getServiceMetrics();

  // Mock data for demonstration
  const revenueData = [
    { date: '2024-01-01', revenue: 1250, transactions: 45 },
    { date: '2024-01-02', revenue: 1800, transactions: 62 },
    { date: '2024-01-03', revenue: 920, transactions: 38 },
    { date: '2024-01-04', revenue: 2100, transactions: 71 },
    { date: '2024-01-05', revenue: 1650, transactions: 53 },
    { date: '2024-01-06', revenue: 1900, transactions: 58 },
    { date: '2024-01-07', revenue: 2300, transactions: 84 }
  ];

  const serviceData = Object.entries(serviceBreakdown).map(([service, count]) => ({
    name: service,
    value: count,
    color: getServiceColor(service)
  }));

  const userGrowthData = [
    { month: 'Jan', users: 120, newUsers: 25 },
    { month: 'Feb', users: 145, newUsers: 32 },
    { month: 'Mar', users: 189, newUsers: 44 },
    { month: 'Apr', users: 234, newUsers: 45 },
    { month: 'May', users: 287, newUsers: 53 },
    { month: 'Jun', users: 342, newUsers: 55 }
  ];

  function getServiceColor(service: string) {
    const colors = {
      'sms': '#3b82f6',
      'whatsapp': '#10b981',
      'ussd': '#f59e0b',
      'mpesa': '#8b5cf6',
      'survey': '#ef4444',
      'servicedesk': '#06b6d4',
      'rewards': '#f97316'
    };
    return colors[service as keyof typeof colors] || '#6b7280';
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-gray-600">Cross-service analytics and performance insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-xs text-green-600">
              <Users className="w-3 h-3 mr-1" />
              +15.3% growth
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Service Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Activity className="w-3 h-3 mr-1" />
              Total events
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="services">Service Breakdown</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Number of transactions per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Usage Distribution</CardTitle>
                <CardDescription>Breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Revenue by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(serviceBreakdown).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getServiceColor(service) }}
                        ></div>
                        <span className="capitalize">{service}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{count} events</div>
                        <div className="text-sm text-gray-500">
                          KES {(count * 50).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user acquisition and total users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" name="Total Users" />
                  <Bar dataKey="newUsers" fill="#10b981" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>API Response Time</span>
                  <span className="font-medium">245ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-600">99.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error Rate</span>
                  <span className="font-medium text-red-600">0.8%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Health</CardTitle>
                <CardDescription>Real-time service status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['SMS Service', 'WhatsApp Service', 'USSD Service', 'M-Pesa Service'].map((service) => (
                  <div key={service} className="flex justify-between items-center">
                    <span>{service}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
