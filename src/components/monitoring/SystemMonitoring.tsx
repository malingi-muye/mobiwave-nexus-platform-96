
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  errorRate: number;
  uptime: string;
  lastUpdated: string;
  performanceData: Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    network: number;
  }>;
  serviceStatus: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    lastCheck: string;
  }>;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export function SystemMonitoring() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async (): Promise<SystemMetrics> => {
      // Simulate API call - replace with actual monitoring data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate performance data for the last 24 hours
      const performanceData = [];
      for (let i = 23; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        performanceData.push({
          timestamp: date.toISOString(),
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 30) + 50,
          network: Math.floor(Math.random() * 20) + 10
        });
      }

      return {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 34.5,
        networkLatency: 23,
        activeConnections: 1247,
        errorRate: 0.12,
        uptime: '99.98%',
        lastUpdated: new Date().toISOString(),
        performanceData,
        serviceStatus: [
          { name: 'API Gateway', status: 'healthy', uptime: 99.99, lastCheck: '2 minutes ago' },
          { name: 'SMS Service', status: 'healthy', uptime: 99.95, lastCheck: '1 minute ago' },
          { name: 'Database', status: 'warning', uptime: 99.87, lastCheck: '30 seconds ago' },
          { name: 'Authentication', status: 'healthy', uptime: 99.98, lastCheck: '1 minute ago' },
          { name: 'File Storage', status: 'healthy', uptime: 99.92, lastCheck: '3 minutes ago' },
          { name: 'Analytics Engine', status: 'critical', uptime: 98.45, lastCheck: '5 minutes ago' }
        ]
      };
    },
    refetchInterval: 30000
  });

  if (isLoading || !metrics) {
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const healthyServices = metrics.serviceStatus.filter(s => s.status === 'healthy').length;
  const warningServices = metrics.serviceStatus.filter(s => s.status === 'warning').length;
  const criticalServices = metrics.serviceStatus.filter(s => s.status === 'critical').length;

  const serviceHealthData = [
    { name: 'Healthy', value: healthyServices, color: COLORS[0] },
    { name: 'Warning', value: warningServices, color: COLORS[1] },
    { name: 'Critical', value: criticalServices, color: COLORS[2] }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${metrics.cpuUsage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${metrics.memoryUsage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.diskUsage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${metrics.diskUsage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.networkLatency}ms</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeConnections} active connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value, name) => [`${value}%`, String(name).toUpperCase()]}
                />
                <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU" />
                <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} name="Memory" />
                <Line type="monotone" dataKey="network" stroke="#8B5CF6" strokeWidth={2} name="Network" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Health Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceHealthData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {serviceHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Service</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Uptime</th>
                  <th className="text-center p-2">Last Check</th>
                </tr>
              </thead>
              <tbody>
                {metrics.serviceStatus.map((service, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      {service.name}
                    </td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center p-2 font-mono">
                      {service.uptime}%
                    </td>
                    <td className="text-center p-2 text-muted-foreground">
                      {service.lastCheck}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
