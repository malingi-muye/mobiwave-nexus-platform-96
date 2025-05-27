
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Database, 
  MessageSquare, 
  Users, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Network,
  Zap
} from "lucide-react";

export const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  const microservices = [
    {
      name: "Authentication Service",
      status: "healthy",
      instances: 3,
      cpu: 45,
      memory: 62,
      requests: "1.2K/min",
      uptime: "99.9%",
      version: "v2.1.3"
    },
    {
      name: "Message Routing Service",
      status: "healthy",
      instances: 5,
      cpu: 72,
      memory: 58,
      requests: "3.8K/min",
      uptime: "99.8%",
      version: "v1.8.2"
    },
    {
      name: "User Management Service",
      status: "warning",
      instances: 2,
      cpu: 89,
      memory: 75,
      requests: "892/min",
      uptime: "99.5%",
      version: "v3.0.1"
    },
    {
      name: "Notification Service",
      status: "healthy",
      instances: 4,
      cpu: 33,
      memory: 41,
      requests: "654/min",
      uptime: "99.9%",
      version: "v1.5.7"
    },
    {
      name: "File Storage Service",
      status: "healthy",
      instances: 3,
      cpu: 28,
      memory: 52,
      requests: "234/min",
      uptime: "99.7%",
      version: "v2.3.1"
    },
    {
      name: "Analytics Service",
      status: "maintenance",
      instances: 1,
      cpu: 15,
      memory: 22,
      requests: "156/min",
      uptime: "99.6%",
      version: "v1.2.4"
    }
  ];

  const systemMetrics = {
    totalRequests: "156.8K",
    activeUsers: "2,847",
    avgResponseTime: "42ms",
    errorRate: "0.02%",
    dataProcessed: "1.2TB",
    queueSize: "23"
  };

  const infrastructure = {
    kubernetes: {
      nodes: 12,
      pods: 48,
      services: 15,
      deployments: 18
    },
    database: {
      postgresql: { status: "healthy", connections: 234, size: "45.2GB" },
      redis: { status: "healthy", memory: "2.1GB", hits: "98.5%" }
    },
    messageQueue: {
      rabbitmq: { status: "healthy", queues: 8, messages: 23, throughput: "1.2K/s" }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "maintenance":
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      maintenance: "bg-blue-100 text-blue-800 border-blue-200",
      error: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.error}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Mobiwave Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Microservices monitoring and system management
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalRequests}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+12%</span>
                <span className="text-slate-500 ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.activeUsers}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+8%</span>
                <span className="text-slate-500 ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Response Time</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.avgResponseTime}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">-5ms</span>
                <span className="text-slate-500 ml-1">improved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Error Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.errorRate}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">-0.01%</span>
                <span className="text-slate-500 ml-1">improved</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Data Processed</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.dataProcessed}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <HardDrive className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+15%</span>
                <span className="text-slate-500 ml-1">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Queue Size</p>
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.queueSize}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs">
                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">-12</span>
                <span className="text-slate-500 ml-1">messages</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Microservices Status */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Microservices Status</span>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {microservices.filter(s => s.status === 'healthy').length} Healthy
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {microservices.filter(s => s.status === 'warning').length} Warning
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {microservices.filter(s => s.status === 'maintenance').length} Maintenance
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of all microservices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {microservices.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium text-slate-900">{service.name}</h4>
                        <p className="text-sm text-slate-500">Version {service.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(service.status)}
                      <Badge variant="outline">
                        {service.instances} instances
                      </Badge>
                      <span className="text-sm text-slate-600">{service.requests}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">CPU Usage</p>
                      <Progress value={service.cpu} className="h-2" />
                      <p className="text-xs text-slate-600 mt-1">{service.cpu}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Memory Usage</p>
                      <Progress value={service.memory} className="h-2" />
                      <p className="text-xs text-slate-600 mt-1">{service.memory}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Uptime</p>
                      <p className="text-sm font-medium text-slate-900">{service.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Requests/min</p>
                      <p className="text-sm font-medium text-slate-900">{service.requests}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Kubernetes Cluster */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Kubernetes Cluster</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Nodes</span>
                <Badge variant="outline">{infrastructure.kubernetes.nodes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Pods</span>
                <Badge variant="outline">{infrastructure.kubernetes.pods}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Services</span>
                <Badge variant="outline">{infrastructure.kubernetes.services}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Deployments</span>
                <Badge variant="outline">{infrastructure.kubernetes.deployments}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Database Cluster</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">PostgreSQL</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {infrastructure.database.postgresql.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span>{infrastructure.database.postgresql.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{infrastructure.database.postgresql.size}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Redis Cache</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {infrastructure.database.redis.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span>{infrastructure.database.redis.memory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hit Rate:</span>
                    <span>{infrastructure.database.redis.hits}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Queue */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="w-5 h-5" />
                <span>Message Queue</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">RabbitMQ</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {infrastructure.messageQueue.rabbitmq.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Queues:</span>
                    <span>{infrastructure.messageQueue.rabbitmq.queues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span>{infrastructure.messageQueue.rabbitmq.messages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span>{infrastructure.messageQueue.rabbitmq.throughput}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
