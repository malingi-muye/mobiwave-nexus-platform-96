
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  totalUsers: number;
  activeCampaigns: number;
  totalMessages: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
}

interface ServiceStatus {
  id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'error';
  version: string;
  uptime_percentage: number;
  instances: number;
}

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: async (): Promise<SystemMetrics> => {
      try {
        // Get total users count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get active campaigns count
        const { count: activeCampaigns } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get total campaigns as a proxy for total messages
        const { count: totalMessages } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true });

        // Mock system health data
        const systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
        const uptime = '99.9%';
        const responseTime = Math.random() * 100 + 50; // Random response time between 50-150ms

        return {
          totalUsers: totalUsers || 0,
          activeCampaigns: activeCampaigns || 0,
          totalMessages: totalMessages || 0,
          systemHealth,
          uptime,
          responseTime
        };
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        
        // Return default values on error
        return {
          totalUsers: 0,
          activeCampaigns: 0,
          totalMessages: 0,
          systemHealth: 'critical',
          uptime: '0%',
          responseTime: 0
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};

// Add the missing useServiceStatus hook
export const useServiceStatus = () => {
  return useQuery({
    queryKey: ['service-status'],
    queryFn: async (): Promise<ServiceStatus[]> => {
      // Mock service status data since we don't have a services table
      return [
        {
          id: '1',
          service_name: 'Database',
          status: 'healthy',
          version: '14.2',
          uptime_percentage: 99.9,
          instances: 3
        },
        {
          id: '2',
          service_name: 'SMS Gateway',
          status: 'healthy',
          version: '2.1.0',
          uptime_percentage: 99.8,
          instances: 2
        },
        {
          id: '3',
          service_name: 'Email Service',
          status: 'warning',
          version: '1.5.3',
          uptime_percentage: 98.2,
          instances: 1
        },
        {
          id: '4',
          service_name: 'API Gateway',
          status: 'healthy',
          version: '3.0.1',
          uptime_percentage: 99.95,
          instances: 4
        }
      ];
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

// Additional hook for real-time metrics monitoring
export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: async () => {
      // Get recent campaigns
      const { data: recentCampaigns } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get recent audit logs for activity
      const { data: recentActivity } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      return {
        recentCampaigns: recentCampaigns || [],
        recentActivity: recentActivity || []
      };
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
  });
};
