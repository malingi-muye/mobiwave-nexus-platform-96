
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useServiceStatus } from '@/hooks/useSystemMetrics';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  HardDrive,
  Wifi,
  RefreshCw
} from 'lucide-react';

export function SystemHealthDashboard() {
  const { data: services, isLoading } = useServiceStatus();

  const systemMetrics = [
    { time: '00:00', cpu: 45, memory: 68, network: 23 },
    { time: '04:00', cpu: 52, memory: 71, network: 34 },
    { time: '08:00', cpu: 78, memory: 85, network: 67 },
    { time: '12:00', cpu: 65, memory: 79, network: 45 },
    { time: '16:00', cpu: 71, memory: 82, network: 56 },
    { time: '20:00', cpu: 58, memory: 74, network: 38 }
  ];

  const alerts = [
    { id: '1', type: 'warning', message: 'High memory usage on database server', time: '5 minutes ago' },
    { id: '2', type: 'info', message: 'Scheduled maintenance completed successfully', time: '1 hour ago' },
    { id: '3', type: 'error', message: 'Failed to connect to external API', time: '2 hours ago' }
  ];

  const getHealthScore = () => {
    if (!services?.length) return 0;
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    return Math.round((healthyServices / services.length) * 100);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return <div>Loading system health data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Health Dashboard</h2>
          <p className="text-gray-600">Real-time monitoring of system performance and health</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-600 mb-2">{getHealthScore()}%</div>
            <p className="text-lg text-gray-600">Overall System Health</p>
            <p className="text-sm text-gray-500 mt-2">
              {services?.filter(s => s.status === 'healthy').length || 0} of {services?.length || 0} services healthy
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                <p className="text-3xl font-bold">67%</p>
                <p className="text-sm text-green-600">Normal</p>
              </div>
              <Cpu className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className="text-3xl font-bold">82%</p>
                <p className="text-sm text-yellow-600">High</p>
              </div>
              <HardDrive className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network I/O</p>
                <p className="text-3xl font-bold">45%</p>
                <p className="text-sm text-green-600">Normal</p>
              </div>
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Performance
          </CardTitle>
          <CardDescription>
            Real-time system metrics over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={systemMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#8B5CF6" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="network" stroke="#10B981" strokeWidth={2} name="Network %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Service Status
            </CardTitle>
            <CardDescription>
              Current status of all system services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services?.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-medium">{service.service_name}</h3>
                      <p className="text-sm text-gray-500">Version {service.version}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.uptime_percentage}% uptime</p>
                    <p className="text-xs text-gray-500">{service.instances} instances</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Latest system alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge className={getAlertColor(alert.type)}>
                    {alert.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
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
