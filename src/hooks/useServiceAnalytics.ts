
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ServiceMetrics {
  total_services: number;
  active_services: number;
  total_subscriptions: number;
  active_subscriptions: number;
  total_revenue: number;
  monthly_revenue: number;
  average_adoption_rate: number;
}

interface ServiceUsageData {
  service_name: string;
  service_type: string;
  active_users: number;
  total_users: number;
  adoption_rate: number;
}

interface ServiceStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface RevenueData {
  month: string;
  setup_fees: number;
  monthly_fees: number;
  total: number;
}

export function useServiceAnalytics() {
  // Fetch service metrics overview
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['service-metrics'],
    queryFn: async (): Promise<ServiceMetrics> => {
      // Get total services
      const { data: services, error: servicesError } = await supabase
        .from('services_catalog')
        .select('id, is_active');
      
      if (servicesError) throw servicesError;

      // Get subscriptions data
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('user_service_subscriptions')
        .select('status, service_id');
      
      if (subscriptionsError) throw subscriptionsError;

      // Get activations data
      const { data: activations, error: activationsError } = await supabase
        .from('user_service_activations')
        .select('is_active, service_id');
      
      if (activationsError) throw activationsError;

      // Calculate metrics
      const totalServices = services?.length || 0;
      const activeServices = services?.filter(s => s.is_active).length || 0;
      const totalSubscriptions = subscriptions?.length || 0;
      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;

      return {
        total_services: totalServices,
        active_services: activeServices,
        total_subscriptions: totalSubscriptions,
        active_subscriptions: activeSubscriptions,
        total_revenue: 0, // Would need billing data
        monthly_revenue: 0, // Would need billing data
        average_adoption_rate: totalServices > 0 ? (activeSubscriptions / totalServices) * 100 : 0
      };
    }
  });

  // Fetch service usage data
  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ['service-usage-data'],
    queryFn: async (): Promise<ServiceUsageData[]> => {
      const { data, error } = await supabase.rpc('get_user_services');
      
      if (error) throw error;

      // Group by service and calculate adoption rates
      const serviceStats = data.reduce((acc: any, row: any) => {
        const serviceId = row.service_id;
        if (!acc[serviceId]) {
          acc[serviceId] = {
            service_name: row.service_name,
            service_type: row.service_type,
            total_users: 0,
            active_users: 0
          };
        }
        
        acc[serviceId].total_users++;
        if (row.is_activated) {
          acc[serviceId].active_users++;
        }
        
        return acc;
      }, {});

      return Object.values(serviceStats).map((stats: any) => ({
        ...stats,
        adoption_rate: stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0
      }));
    }
  });

  // Fetch status distribution
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['service-status-distribution'],
    queryFn: async (): Promise<ServiceStatusData[]> => {
      const { data, error } = await supabase.rpc('get_user_services');
      
      if (error) throw error;

      const statusCounts = data.reduce((acc: Record<string, number>, row: any) => {
        const status = row.overall_status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(statusCounts).reduce((sum: number, count: number) => sum + count, 0);

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count: count as number,
        percentage: total > 0 ? (count / total) * 100 : 0
      }));
    }
  });

  // Mock revenue data (would need actual billing integration)
  const revenueData: RevenueData[] = [
    { month: 'Jan', setup_fees: 150000, monthly_fees: 80000, total: 230000 },
    { month: 'Feb', setup_fees: 180000, monthly_fees: 95000, total: 275000 },
    { month: 'Mar', setup_fees: 220000, monthly_fees: 110000, total: 330000 },
    { month: 'Apr', setup_fees: 190000, monthly_fees: 125000, total: 315000 },
    { month: 'May', setup_fees: 240000, monthly_fees: 140000, total: 380000 },
    { month: 'Jun', setup_fees: 280000, monthly_fees: 155000, total: 435000 }
  ];

  return {
    metrics,
    usageData: usageData || [],
    statusData: statusData || [],
    revenueData,
    isLoading: metricsLoading || usageLoading || statusLoading
  };
}
