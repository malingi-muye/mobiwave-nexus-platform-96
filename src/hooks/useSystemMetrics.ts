
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ServiceStatus {
  id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  version: string;
  instances: number;
  cpu_usage: number;
  memory_usage: number;
  request_rate: string;
  uptime_percentage: number;
  last_health_check: string;
}

interface SystemMetric {
  metric_name: string;
  metric_value: number;
  timestamp: string;
}

export const useServiceStatus = () => {
  return useQuery({
    queryKey: ['service-status'],
    queryFn: async (): Promise<ServiceStatus[]> => {
      // Mock data for now - in production this would come from monitoring systems
      return [
        {
          id: '1',
          service_name: 'SMS Gateway',
          status: 'healthy',
          version: '1.2.3',
          instances: 3,
          cpu_usage: 45,
          memory_usage: 62,
          request_rate: '150 req/min',
          uptime_percentage: 99.8,
          last_health_check: new Date().toISOString()
        },
        {
          id: '2',
          service_name: 'Email Service',
          status: 'healthy',
          version: '2.1.0',
          instances: 2,
          cpu_usage: 23,
          memory_usage: 41,
          request_rate: '89 req/min',
          uptime_percentage: 99.9,
          last_health_check: new Date().toISOString()
        },
        {
          id: '3',
          service_name: 'Database',
          status: 'warning',
          version: '14.2',
          instances: 1,
          cpu_usage: 78,
          memory_usage: 85,
          request_rate: '300 req/min',
          uptime_percentage: 99.5,
          last_health_check: new Date().toISOString()
        },
        {
          id: '4',
          service_name: 'Authentication',
          status: 'healthy',
          version: '1.5.2',
          instances: 2,
          cpu_usage: 34,
          memory_usage: 52,
          request_rate: '75 req/min',
          uptime_percentage: 99.9,
          last_health_check: new Date().toISOString()
        }
      ];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: async (): Promise<SystemMetric[]> => {
      // Get real user count from auth.users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get campaign count
      const { count: campaignCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true });

      // Get message count from message history
      const { count: messageCount } = await supabase
        .from('message_history')
        .select('*', { count: 'exact', head: true });

      return [
        {
          metric_name: 'total_users',
          metric_value: userCount || 0,
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'total_campaigns',
          metric_value: campaignCount || 0,
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'total_messages',
          metric_value: messageCount || 0,
          timestamp: new Date().toISOString()
        }
      ];
    },
    refetchInterval: 60000 // Refresh every minute
  });
};
