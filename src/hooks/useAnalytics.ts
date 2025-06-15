
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  service_type: string;
  metadata: any;
  revenue: number;
  created_at: string;
}

export const useAnalytics = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: async (): Promise<AnalyticsEvent[]> => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const getRevenueMetrics = () => {
    const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = events
      .filter(event => {
        const eventDate = new Date(event.created_at);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
      })
      .reduce((sum, event) => sum + (event.revenue || 0), 0);

    return {
      totalRevenue,
      monthlyRevenue
    };
  };

  const getServiceMetrics = () => {
    return events.reduce((acc, event) => {
      const service = event.service_type || 'unknown';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    events,
    isLoading,
    getRevenueMetrics,
    getServiceMetrics
  };
};
