
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  Activity,
  Shield,
  Database,
  Server,
  AlertTriangle,
  TrendingUp,
  Settings,
  Eye,
  CheckCircle
} from 'lucide-react';

export function AdminDashboard() {
  const { data: dashboardStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      return {
        totalUsers: 1247,
        activeUsers: 892,
        totalMessages: 45678,
        systemHealth: 98.5,
        securityScore: 92,
        criticalAlerts: 2,
        revenueThisMonth: 12450
      };
    }
  });

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Security Center',
      description: 'Advanced security monitoring',
      icon: Shield,
      href: '/admin/security-center',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'System Health',
      description: 'Monitor system performance',
      icon: Activity,
      href: '/admin/system-health',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Database Admin',
      description: 'Database management and monitoring',
      icon: Database,
      href: '/admin/database',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High memory usage detected on server',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'Scheduled backup completed successfully',
      time: '1 hour ago'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Comprehensive system administration and monitoring dashboard with advanced security and performance analytics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats?.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">System Health</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats?.systemHealth}%</p>
                <p className="text-sm text-green-600 mt-1">All systems operational</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Security Score</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardStats?.securityScore}%</p>
                <p className="text-sm text-blue-600 mt-1">Excellent security</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-green-600">${dashboardStats?.revenueThisMonth.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+8% this month</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Fast access to key administrative functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className={`p-3 rounded-full ${action.color} w-fit mb-3`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Recent system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest administrative actions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-1 rounded-full bg-green-100">
                  <Users className="w-3 h-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">New user registration: john@example.com</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-1 rounded-full bg-blue-100">
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Campaign "Welcome Series" completed</p>
                  <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
