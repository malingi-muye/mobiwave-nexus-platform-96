
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MpesaIntegration {
  id: string;
  paybill_number: string;
  till_number?: string;
  callback_url: string;
  status: string;
  current_balance: number;
  last_balance_update: string;
  callback_response_type: string;
}

const fetchMpesaIntegrations = async (): Promise<MpesaIntegration[]> => {
  const { data, error } = await supabase
    .from('mspace_pesa_integrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const useMpesaIntegrations = () => {
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['mpesa-integrations'],
    queryFn: fetchMpesaIntegrations
  });

  const createIntegration = useMutation({
    mutationFn: async (integrationData: {
      paybill_number: string;
      till_number?: string;
      callback_url: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: subscription } = await supabase
        .from('user_service_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_id', (await supabase
          .from('services_catalog')
          .select('id')
          .eq('service_type', 'mpesa')
          .single()).data?.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        throw new Error('You need an active M-Pesa service subscription to create integrations');
      }

      const { data, error } = await supabase
        .from('mspace_pesa_integrations')
        .insert({
          subscription_id: subscription.id,
          paybill_number: integrationData.paybill_number,
          till_number: integrationData.till_number || null,
          callback_url: integrationData.callback_url,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mpesa-integrations'] });
      toast.success('M-Pesa integration created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create integration: ${error.message}`);
    }
  });

  return {
    integrations,
    isLoading,
    createIntegration: createIntegration.mutateAsync,
    isCreating: createIntegration.isPending
  };
};
