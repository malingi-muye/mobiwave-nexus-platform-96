
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceCatalog {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  transaction_fee_type: string;
  transaction_fee_amount: number;
  is_premium: boolean;
  is_active: boolean;
  provider: string;
}

interface UserServiceSubscription {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  configuration: any;
  setup_fee_paid: boolean;
  monthly_billing_active: boolean;
  activated_at: string;
  service: ServiceCatalog;
}

export const useRealServicesManagement = () => {
  const queryClient = useQueryClient();

  // Fetch all available services
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services-catalog'],
    queryFn: async (): Promise<ServiceCatalog[]> => {
      const { data, error } = await supabase
        .from('services_catalog')
        .select('*')
        .eq('is_active', true)
        .order('service_name');

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user subscriptions
  const { data: userSubscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['user-service-subscriptions'],
    queryFn: async (): Promise<UserServiceSubscription[]> => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .select(`
          *,
          service:services_catalog(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Subscribe to a service
  const subscribeToService = useMutation({
    mutationFn: async (serviceId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-service-subscriptions'] });
      toast.success('Service subscription request submitted');
    },
    onError: (error: any) => {
      toast.error(`Failed to subscribe to service: ${error.message}`);
    }
  });

  // Toggle service status
  const toggleServiceStatus = useMutation({
    mutationFn: async ({ subscriptionId, newStatus }: { subscriptionId: string, newStatus: string }) => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .update({ 
          status: newStatus,
          activated_at: newStatus === 'active' ? new Date().toISOString() : null
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-service-subscriptions'] });
      toast.success('Service status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update service status: ${error.message}`);
    }
  });

  return {
    services: servicesData || [],
    userSubscriptions: userSubscriptions || [],
    isLoading: servicesLoading || subscriptionsLoading,
    subscribeToService: subscribeToService.mutateAsync,
    toggleServiceStatus: toggleServiceStatus.mutateAsync,
    isSubscribing: subscribeToService.isPending,
    isUpdating: toggleServiceStatus.isPending
  };
};
