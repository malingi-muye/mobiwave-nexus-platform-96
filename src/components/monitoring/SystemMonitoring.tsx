
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  services: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    responseTime: number;
    cpu: number;
    memory: number;
  }>;
  alerts: Array<{
    id: string;
    service: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
  performanceMetrics: Array<{
    time: string;
    cpu: number;
    memory: number;
    network: number;
    disk: number;
  }>;
}

export function SystemMonitoring() {
  const { data: systemHealth, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async (): Promise<SystemHealth> => {
      // Get recent audit logs to simulate system activity
      const { data: recentLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Simulate service health data
      const services = [
        {
          name: 'SMS Gateway',
          status: 'healthy' as const,
          uptime: 99.9,
          responseTime: 120,
          cpu: 45,
          memory: 68
        },
        {
          name: 'WhatsApp Service',
          status: 'healthy' as const,
          uptime: 99.8,
          responseTime: 95,
          cpu: 32,
          memory: 55
        },
        {
          name: 'M-Pesa Integration',
          status: 'warning' as const,
          uptime: 98.5,
          responseTime: 180,
          cpu: 78,
          memory: 85
        },
        {
          name: 'Database',
          status: 'healthy' as const,
          uptime: 99.99,
          responseTime: 25,
          cpu: 55,
          memory: 72
        },
        {
          name: 'USSD Service',
          status: 'healthy' as const,
          uptime: 99.7,
          responseTime: 110,
          cpu: 38,
          memory: 62
        }
      ];

      // Generate alerts based on service status
      const alerts = [
        {
          id: '1',
          service: 'M-Pesa Integration',
          message: 'High memory usage detected (85%)',
          severity: 'medium' as const,
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          service: 'SMS Gateway',
          message: 'Response time spike detected',
          severity: 'low' as const,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          service: 'Database',
          message: 'Scheduled maintenance completed',
          severity: 'low' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Generate performance metrics for the last 24 hours
      const performanceMetrics = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        performanceMetrics.push({
          time: time.toISOString(),
          cpu: Math.floor(Math.random() * 30) + 40,
          memory: Math.floor(Math.random() * 25) + 60,
          network: Math.floor(Math.random() * 20) + 70,
          disk: Math.floor(Math.random() * 15) + 25
        });
      }

      return {
        services,
        alerts,
        performanceMetrics
      };
    },
    refetchInterval: 30000
  });

  if (isLoading || !systemHealth) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const healthyServices = systemHealth.services.filter(s => s.status === 'healthy').length;
  const avgResponseTime = systemHealth.services.reduce((sum, s) => sum + s.responseTime, 0) / systemHealth.services.length;
  const avgUptime = systemHealth.services.reduce((sum, s) => sum + s.uptime, 0) / systemHealth.services.length;

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {healthyServices}/{systemHealth.services.length}
            </div>
            <p className="text-xs text-muted-foreground">Services healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {systemHealth.alerts.length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.services.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Response:</span>
                    <span className="font-medium">{service.responseTime}ms</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU:</span>
                      <span>{service.cpu}%</span>
                    </div>
                    <Progress value={service.cpu} className="h-1" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Memory:</span>
                      <span>{service.memory}%</span>
                    </div>
                    <Progress value={service.memory} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemHealth.performanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                formatter={(value, name) => [`${value}%`, name.toUpperCase()]}
              />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="cpu" />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="memory" />
              <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} name="network" />
              <Line type="monotone" dataKey="disk" stroke="#EF4444" strokeWidth={2} name="disk" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="font-medium">{alert.service}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
