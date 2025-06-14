
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign, 
  AlertTriangle,
  Zap,
  BarChart3,
  Clock,
  Globe
} from 'lucide-react';

interface RealTimeMetric {
  timestamp: string;
  activeUsers: number;
  messagesPerMinute: number;
  revenue: number;
  systemLoad: number;
  responseTime: number;
  errorRate: number;
}

export function RealTimeMetricsDashboard() {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const generateMetric = (): RealTimeMetric => ({
      timestamp: new Date().toLocaleTimeString(),
      activeUsers: Math.floor(Math.random() * 500) + 100,
      messagesPerMinute: Math.floor(Math.random() * 1000) + 200,
      revenue: Math.random() * 1000 + 500,
      systemLoad: Math.random() * 100,
      responseTime: Math.random() * 500 + 100,
      errorRate: Math.random() * 5
    });

    const interval = setInterval(() => {
      if (isLive) {
        setMetrics(prev => {
          const newMetrics = [...prev, generateMetric()];
          return newMetrics.slice(-50); // Keep last 50 points
        });
      }
    }, 3000);

    // Initialize with some data
    if (metrics.length === 0) {
      const initialData = Array.from({ length: 20 }, generateMetric);
      setMetrics(initialData);
    }

    return () => clearInterval(interval);
  }, [isLive, metrics.length]);

  const currentMetrics = metrics[metrics.length - 1] || {
    activeUsers: 0,
    messagesPerMinute: 0,
    revenue: 0,
    systemLoad: 0,
    responseTime: 0,
    errorRate: 0
  };

  const getSystemHealthStatus = () => {
    if (currentMetrics.systemLoad > 80 || currentMetrics.errorRate > 3) return 'critical';
    if (currentMetrics.systemLoad > 60 || currentMetrics.errorRate > 1) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'healthy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Real-Time Analytics</h3>
          <p className="text-gray-600">Live system performance and user activity monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(value: '1h' | '6h' | '24h' | '7d') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            System Health Status
            <Badge className={getStatusColor(getSystemHealthStatus())}>
              {getSystemHealthStatus().toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentMetrics.activeUsers}</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentMetrics.messagesPerMinute}</div>
              <div className="text-sm text-gray-500">Messages/Min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${currentMetrics.revenue.toFixed(0)}</div>
              <div className="text-sm text-gray-500">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{currentMetrics.systemLoad.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">System Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{currentMetrics.responseTime.toFixed(0)}ms</div>
              <div className="text-sm text-gray-500">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{currentMetrics.errorRate.toFixed(2)}%</div>
              <div className="text-sm text-gray-500">Error Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Active Users
            </CardTitle>
            <CardDescription>Real-time user activity tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Message Throughput */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Message Throughput
            </CardTitle>
            <CardDescription>Messages processed per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="messagesPerMinute" 
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              System Performance
            </CardTitle>
            <CardDescription>CPU load and response times</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="systemLoad" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="System Load (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Response Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Revenue Tracking
            </CardTitle>
            <CardDescription>Real-time revenue generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
