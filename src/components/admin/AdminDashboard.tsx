
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
  CheckCircle,
  Cloud,
  GitBranch,
  Lock,
  Zap
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
        securityScore: 94,
        criticalAlerts: 1,
        revenueThisMonth: 12450,
        enterpriseIntegrations: 8,
        pipelineSuccessRate: 96.2,
        complianceScore: 92
      };
    }
  });

  const quickActions = [
    {
      title: 'User Management',
      description: 'Enhanced user management with advanced analytics',
      icon: Users,
      href: '/admin/enhanced-users',
      color: 'bg-blue-50 text-blue-600',
      badge: 'Enhanced'
    },
    {
      title: 'Security Center',
      description: 'Advanced security monitoring and threat detection',
      icon: Shield,
      href: '/admin/security-center',
      color: 'bg-red-50 text-red-600',
      badge: 'Critical'
    },
    {
      title: 'System Health',
      description: 'Comprehensive system diagnostics and monitoring',
      icon: Activity,
      href: '/admin/system-diagnostics',
      color: 'bg-green-50 text-green-600',
      badge: 'Live'
    },
    {
      title: 'Enterprise Hub',
      description: 'Enterprise integrations and API management',
      icon: Cloud,
      href: '/admin/enterprise-integrations',
      color: 'bg-purple-50 text-purple-600',
      badge: 'New'
    },
    {
      title: 'DevOps Pipeline',
      description: 'CI/CD pipeline monitoring and deployment',
      icon: GitBranch,
      href: '/admin/devops-pipeline',
      color: 'bg-orange-50 text-orange-600',
      badge: 'Live'
    },
    {
      title: 'Production Security',
      description: 'Enterprise-grade security suite and compliance',
      icon: Lock,
      href: '/admin/production-security',
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Enterprise'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'info',
      message: 'Enterprise integration sync completed successfully',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'Production deployment pipeline executed successfully',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Security scan detected minor vulnerability in dependency',
      time: '1 hour ago'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      icon: Cloud,
      message: 'Salesforce integration synchronized 2,500 contacts',
      time: '5 minutes ago',
      type: 'integration'
    },
    {
      id: 2,
      icon: GitBranch,
      message: 'Production deployment completed successfully',
      time: '12 minutes ago',
      type: 'deployment'
    },
    {
      id: 3,
      icon: Shield,
      message: 'Security compliance audit passed with 94% score',
      time: '25 minutes ago',
      type: 'security'
    },
    {
      id: 4,
      icon: Users,
      message: 'New enterprise user account created: john@enterprise.com',
      time: '45 minutes ago',
      type: 'user'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Enterprise Admin Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Comprehensive enterprise administration with advanced security, DevOps automation, and real-time monitoring.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-900">{dashboardStats?.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-200">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">System Health</p>
                <p className="text-3xl font-bold text-green-900">{dashboardStats?.systemHealth}%</p>
                <p className="text-sm text-green-600 mt-1">All systems operational</p>
              </div>
              <div className="p-3 rounded-full bg-green-200">
                <Activity className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Security Score</p>
                <p className="text-3xl font-bold text-purple-900">{dashboardStats?.securityScore}%</p>
                <p className="text-sm text-purple-600 mt-1">Enterprise security</p>
              </div>
              <div className="p-3 rounded-full bg-purple-200">
                <Shield className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Pipeline Success</p>
                <p className="text-3xl font-bold text-orange-900">{dashboardStats?.pipelineSuccessRate}%</p>
                <p className="text-sm text-orange-600 mt-1">DevOps automation</p>
              </div>
              <div className="p-3 rounded-full bg-orange-200">
                <GitBranch className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 5 Features Showcase */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            Phase 5: Enterprise Features
          </CardTitle>
          <CardDescription>
            Advanced enterprise capabilities for production-ready deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold">Enterprise Integration Hub</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {dashboardStats?.enterpriseIntegrations} active integrations with CRM, marketing, and productivity tools
              </p>
              <Link to="/admin/enterprise-integrations">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Integrations
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold">DevOps Pipeline</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automated CI/CD with {dashboardStats?.pipelineSuccessRate}% success rate and advanced monitoring
              </p>
              <Link to="/admin/devops-pipeline">
                <Button variant="outline" size="sm" className="w-full">
                  View Pipelines
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold">Production Security</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Enterprise-grade security with {dashboardStats?.complianceScore}% compliance score
              </p>
              <Link to="/admin/production-security">
                <Button variant="outline" size="sm" className="w-full">
                  Security Suite
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Enterprise Admin Actions
          </CardTitle>
          <CardDescription>
            Fast access to critical administrative functions and monitoring tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-md transition-all duration-200 hover:scale-105">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-full ${action.color} w-fit`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
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
              System Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Recent system notifications and enterprise alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' : 
                    alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    ) : alert.type === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
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

        {/* Recent Enterprise Activity */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Enterprise Activity Feed
            </CardTitle>
            <CardDescription>
              Latest enterprise operations and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.type === 'integration' ? 'bg-purple-100' :
                    activity.type === 'deployment' ? 'bg-green-100' :
                    activity.type === 'security' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <activity.icon className={`w-3 h-3 ${
                      activity.type === 'integration' ? 'text-purple-600' :
                      activity.type === 'deployment' ? 'text-green-600' :
                      activity.type === 'security' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
