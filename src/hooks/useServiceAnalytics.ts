
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ServiceMetrics {
  total_services: number;
  active_subscriptions: number;
  average_adoption_rate: number;
}

interface UsageDataPoint {
  date: string;
  usage: number;
  service_type: string;
}

interface StatusDataPoint {
  status: string;
  count: number;
}

interface RevenueDataPoint {
  month: string;
  revenue: number;
  subscriptions: number;
}

export const useServiceAnalytics = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['service-analytics-metrics'],
    queryFn: async (): Promise<ServiceMetrics> => {
      const [servicesResult, subscriptionsResult] = await Promise.all([
        supabase.from('services_catalog').select('id').eq('is_active', true),
        supabase.from('user_service_subscriptions').select('id, status').eq('status', 'active')
      ]);

      const totalServices = servicesResult.data?.length || 0;
      const activeSubscriptions = subscriptionsResult.data?.length || 0;
      
      // Calculate adoption rate (active subscriptions / total possible combinations)
      const { data: totalUsers } = await supabase.from('profiles').select('id');
      const totalUsers_ = totalUsers?.length || 1;
      const possibleCombinations = totalServices * totalUsers_;
      const adoptionRate = possibleCombinations > 0 ? (activeSubscriptions / possibleCombinations) * 100 : 0;

      return {
        total_services: totalServices,
        active_subscriptions: activeSubscriptions,
        average_adoption_rate: Math.round(adoptionRate * 100) / 100
      };
    }
  });

  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ['service-usage-data'],
    queryFn: async (): Promise<UsageDataPoint[]> => {
      // Generate sample usage data for the last 30 days
      const data: UsageDataPoint[] = [];
      const serviceTypes = ['sms', 'ussd', 'mpesa', 'whatsapp', 'survey'];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        serviceTypes.forEach(type => {
          data.push({
            date: date.toISOString().split('T')[0],
            usage: Math.floor(Math.random() * 100) + 20,
            service_type: type
          });
        });
      }
      
      return data;
    }
  });

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['service-status-distribution'],
    queryFn: async (): Promise<StatusDataPoint[]> => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .select('status');

      if (error) throw error;

      const statusCounts = (data || []).reduce((acc: Record<string, number>, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));
    }
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['service-revenue-data'],
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      // Generate sample revenue data for the last 12 months
      const data: RevenueDataPoint[] = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      months.forEach((month, index) => {
        data.push({
          month,
          revenue: Math.floor(Math.random() * 50000) + 200000,
          subscriptions: Math.floor(Math.random() * 50) + 100
        });
      });
      
      return data;
    }
  });

  return {
    metrics,
    usageData: usageData || [],
    statusData: statusData || [],
    revenueData: revenueData || [],
    isLoading: metricsLoading || usageLoading || statusLoading || revenueLoading
  };
};
