
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Users, 
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function SecurityMonitor() {
  const { data: auditLogs } = useQuery({
    queryKey: ['recent-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  const securityMetrics = [
    {
      title: 'Failed Login Attempts',
      value: '12',
      status: 'warning',
      icon: Lock,
      description: 'Last 24 hours'
    },
    {
      title: 'Active Sessions',
      value: '156',
      status: 'healthy',
      icon: Users,
      description: 'Currently online'
    },
    {
      title: 'Security Incidents',
      value: '2',
      status: 'error',
      icon: AlertTriangle,
      description: 'Requiring attention'
    },
    {
      title: 'System Uptime',
      value: '99.8%',
      status: 'healthy',
      icon: Activity,
      description: 'Last 30 days'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent">
          Security Monitor
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Real-time security monitoring and threat detection for the platform.
        </p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-500">{metric.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${getStatusColor(metric.status)}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Security Events */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security-related activities and audit log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs?.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-500">
                      {log.resource_type} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={log.status === 'success' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {log.status}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      log.severity === 'critical' ? 'border-red-500 text-red-600' :
                      log.severity === 'high' ? 'border-orange-500 text-orange-600' :
                      log.severity === 'medium' ? 'border-yellow-500 text-yellow-600' :
                      'border-gray-500 text-gray-600'
                    }
                  >
                    {log.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">
              View All Security Events
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Security Recommendations
          </CardTitle>
          <CardDescription>
            Suggested actions to improve platform security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Enable Two-Factor Authentication</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Require 2FA for all admin users to enhance account security.
                  </p>
                  <Button size="sm" className="mt-2">
                    Configure 2FA
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Review API Rate Limits</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Current rate limits may be too permissive for production use.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Review Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">SSL/TLS Configuration</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your SSL configuration is properly set up and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
