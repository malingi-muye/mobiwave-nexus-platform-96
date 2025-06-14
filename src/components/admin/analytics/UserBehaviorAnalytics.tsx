
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MousePointer, Clock, Activity } from 'lucide-react';

export function UserBehaviorAnalytics() {
  // Mock user behavior data
  const sessionData = [
    { hour: '00:00', sessions: 12 },
    { hour: '04:00', sessions: 5 },
    { hour: '08:00', sessions: 45 },
    { hour: '12:00', sessions: 78 },
    { hour: '16:00', sessions: 92 },
    { hour: '20:00', sessions: 65 },
    { hour: '23:00', sessions: 28 }
  ];

  const featureUsage = [
    { name: 'SMS Campaigns', usage: 45, color: '#3B82F6' },
    { name: 'Email Campaigns', usage: 32, color: '#10B981' },
    { name: 'Contacts Management', usage: 28, color: '#8B5CF6' },
    { name: 'Analytics', usage: 18, color: '#F59E0B' },
    { name: 'USSD Apps', usage: 12, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* User Behavior Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                <p className="text-2xl font-bold text-gray-900">12m 34s</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views/Session</p>
                <p className="text-2xl font-bold text-gray-900">7.2</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">23%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavior Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Sessions by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="usage"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {featureUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Journey */}
      <Card>
        <CardHeader>
          <CardTitle>Common User Journeys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">New User Onboarding</h4>
                <span className="text-sm text-gray-500">34% of new users</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Sign Up</span>
                <span>→</span>
                <span>Dashboard</span>
                <span>→</span>
                <span>Contacts</span>
                <span>→</span>
                <span>Create SMS Campaign</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Power User Flow</h4>
                <span className="text-sm text-gray-500">18% of active users</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Dashboard</span>
                <span>→</span>
                <span>Analytics</span>
                <span>→</span>
                <span>Campaigns</span>
                <span>→</span>
                <span>Bulk Operations</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Service Explorer</h4>
                <span className="text-sm text-gray-500">28% of users</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Services</span>
                <span>→</span>
                <span>USSD Apps</span>
                <span>→</span>
                <span>M-Pesa Integration</span>
                <span>→</span>
                <span>Subscription</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
