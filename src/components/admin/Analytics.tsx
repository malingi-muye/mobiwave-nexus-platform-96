
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart as BarChartIcon, TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';

export function Analytics() {
  const messageData = [
    { month: 'Jan', sms: 12500, email: 8900, whatsapp: 4200 },
    { month: 'Feb', sms: 15200, email: 9800, whatsapp: 5100 },
    { month: 'Mar', sms: 18700, email: 11200, whatsapp: 6800 },
    { month: 'Apr', sms: 22100, email: 12500, whatsapp: 7900 },
    { month: 'May', sms: 19800, email: 10900, whatsapp: 6500 },
  ];

  const userGrowth = [
    { month: 'Jan', users: 1050 },
    { month: 'Feb', users: 1120 },
    { month: 'Mar', users: 1180 },
    { month: 'Apr', users: 1247 },
    { month: 'May', users: 1289 },
  ];

  const campaignTypes = [
    { name: 'SMS', value: 45, color: '#3B82F6' },
    { name: 'Email', value: 35, color: '#10B981' },
    { name: 'WhatsApp', value: 20, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Comprehensive analytics and insights for platform performance and user engagement.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">89.2K</p>
                <p className="text-sm text-green-600 font-medium">+12.5% this month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">1,289</p>
                <p className="text-sm text-green-600 font-medium">+3.4% this month</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-3xl font-bold text-gray-900">98.7%</p>
                <p className="text-sm text-green-600 font-medium">+0.2% this month</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Response</p>
                <p className="text-3xl font-bold text-gray-900">2.3s</p>
                <p className="text-sm text-red-600 font-medium">+0.1s this month</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Message Volume Chart */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="w-5 h-5 text-purple-600" />
              Message Volume by Type
            </CardTitle>
            <CardDescription>
              Monthly breakdown of messages sent by channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sms" fill="#3B82F6" name="SMS" />
                <Bar dataKey="email" fill="#10B981" name="Email" />
                <Bar dataKey="whatsapp" fill="#F59E0B" name="WhatsApp" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              User Growth Trend
            </CardTitle>
            <CardDescription>
              Monthly active user growth over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Distribution */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Campaign Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of campaigns by message type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={campaignTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {campaignTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {campaignTypes.map((type) => (
                  <div key={type.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm font-medium">{type.name}</span>
                    <Badge variant="secondary">{type.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators and benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">Email Open Rate</span>
                <Badge className="bg-green-100 text-green-800">24.8%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">SMS Response Rate</span>
                <Badge className="bg-blue-100 text-blue-800">18.2%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">Click-through Rate</span>
                <Badge className="bg-purple-100 text-purple-800">3.7%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">Bounce Rate</span>
                <Badge className="bg-yellow-100 text-yellow-800">1.3%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium">Unsubscribe Rate</span>
                <Badge className="bg-red-100 text-red-800">0.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
