
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  is_active: boolean;
  is_premium: boolean;
}

interface UserSubscription {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  activated_at: string;
  configuration: any;
  setup_fee_paid: boolean;
  monthly_billing_active: boolean;
  service: Service;
}

export const useRealServicesManagement = () => {
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services-catalog'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services_catalog')
        .select('*')
        .order('service_name');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: userSubscriptions = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: async (): Promise<UserSubscription[]> => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .select(`
          *,
          service:services_catalog(*)
        `);

      if (error) throw error;
      return data || [];
    }
  });

  return {
    services,
    userSubscriptions,
    isLoading: servicesLoading || subscriptionsLoading
  };
};
