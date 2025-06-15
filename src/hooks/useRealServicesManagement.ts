
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Service {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  transaction_fee_type: string;
  transaction_fee_amount: number;
  is_active: boolean;
  is_premium: boolean;
  provider: string;
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
  const queryClient = useQueryClient();

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

  const toggleServiceStatus = useMutation({
    mutationFn: async ({ subscriptionId, newStatus }: { subscriptionId: string; newStatus: string }) => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .update({ status: newStatus })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      toast.success('Service status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update service status: ${error.message}`);
    }
  });

  return {
    services,
    userSubscriptions,
    isLoading: servicesLoading || subscriptionsLoading,
    toggleServiceStatus: toggleServiceStatus.mutateAsync,
    isUpdating: toggleServiceStatus.isPending
  };
};
