
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_type: string;
  service_type?: string;
  metadata: any;
  revenue: number;
  created_at: string;
}

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: async (): Promise<AnalyticsEvent[]> => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;
      return data || [];
    }
  });

  const logEvent = useMutation({
    mutationFn: async (eventData: Omit<AnalyticsEvent, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase.rpc('log_analytics_event', {
        p_event_type: eventData.event_type,
        p_service_type: eventData.service_type,
        p_metadata: eventData.metadata,
        p_revenue: eventData.revenue
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-events'] });
    },
    onError: (error: any) => {
      console.error('Failed to log analytics event:', error);
    }
  });

  const getRevenueMetrics = () => {
    const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
    const monthlyRevenue = events
      .filter(event => {
        const eventDate = new Date(event.created_at);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, event) => sum + (event.revenue || 0), 0);

    return { totalRevenue, monthlyRevenue };
  };

  const getServiceMetrics = () => {
    const serviceBreakdown = events.reduce((acc, event) => {
      const service = event.service_type || 'unknown';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return serviceBreakdown;
  };

  return {
    events,
    isLoading,
    logEvent: logEvent.mutateAsync,
    getRevenueMetrics,
    getServiceMetrics,
    isLogging: logEvent.isPending
  };
};
