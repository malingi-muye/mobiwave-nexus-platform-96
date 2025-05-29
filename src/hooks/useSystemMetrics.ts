
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram';
  labels: Record<string, any>;
  recorded_at: string;
}

export interface ServiceStatus {
  id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  version?: string;
  instances: number;
  cpu_usage: number;
  memory_usage: number;
  request_rate?: string;
  uptime_percentage: number;
  last_health_check: string;
  created_at: string;
  updated_at: string;
}

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SystemMetric[];
    },
  });
};

export const useServiceStatus = () => {
  return useQuery({
    queryKey: ['service-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_status')
        .select('*')
        .order('service_name');

      if (error) throw error;
      return data as ServiceStatus[];
    },
  });
};

export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ service_name, status, ...updates }: Partial<ServiceStatus> & { service_name: string }) => {
      const { data, error } = await supabase
        .from('service_status')
        .upsert({
          service_name,
          status: status || 'healthy',
          last_health_check: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-status'] });
    },
  });
};
