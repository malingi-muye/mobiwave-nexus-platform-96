
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useServiceStatus, useSystemMetrics } from '@/hooks/useSystemMetrics';
import { 
  Server, 
  Activity, 
  Users, 
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export function AdminMetrics() {
  const { data: services, isLoading: servicesLoading } = useServiceStatus();
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();

  const healthyServices = services?.filter(s => s.status === 'healthy').length || 0;
  const warningServices = services?.filter(s => s.status === 'warning').length || 0;
  const errorServices = services?.filter(s => s.status === 'error').length || 0;
  const maintenanceServices = services?.filter(s => s.status === 'maintenance').length || 0;
  const totalServices = services?.length || 0;

  const avgCpu = services?.reduce((sum, s) => sum + s.cpu_usage, 0) / (services?.length || 1) || 0;
  const avgMemory = services?.reduce((sum, s) => sum + s.memory_usage, 0) / (services?.length || 1) || 0;
  const totalInstances = services?.reduce((sum, s) => sum + s.instances, 0) || 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (servicesLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalServices}</p>
                <p className="text-sm text-gray-500">{healthyServices} healthy</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Instances</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{totalInstances}</p>
                <p className="text-sm text-gray-500">Across all services</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg CPU Usage</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(avgCpu)}%</p>
                <p className="text-sm text-gray-500">System wide</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Memory</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(avgMemory)}%</p>
                <p className="text-sm text-gray-500">System wide</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Overview */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Service Status Overview
          </CardTitle>
          <CardDescription>
            Real-time monitoring of all microservices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services?.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-gray-900">{service.service_name}</p>
                    <p className="text-sm text-gray-500">
                      {service.version} • {service.instances} instance{service.instances !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">CPU: {service.cpu_usage}%</p>
                    <p className="text-sm text-gray-600">Memory: {service.memory_usage}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{service.request_rate}</p>
                    <p className="text-sm text-gray-600">{service.uptime_percentage}% uptime</p>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Cards */}
      {(warningServices > 0 || errorServices > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warningServices > 0 && (
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Services Requiring Attention</p>
                    <p className="text-sm text-yellow-700">
                      {warningServices} service{warningServices !== 1 ? 's' : ''} reporting warnings
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {errorServices > 0 && (
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Critical Issues</p>
                    <p className="text-sm text-red-700">
                      {errorServices} service{errorServices !== 1 ? 's' : ''} reporting errors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
