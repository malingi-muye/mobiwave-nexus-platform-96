
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';

export const useServiceActivation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const requestServiceActivation = useMutation({
    mutationFn: async ({ serviceId }: { serviceId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_activation_requests')
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
      toast.success('Service activation request submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to request activation: ${error.message}`);
    }
  });

  const approveServiceActivation = useMutation({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_activation_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Service activation request approved successfully');
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to approve activation: ${error.message}`);
    }
  });

  const rejectServiceActivation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_activation_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Service activation request rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to reject activation: ${error.message}`);
    }
  });

  return {
    requestServiceActivation: requestServiceActivation.mutateAsync,
    approveServiceActivation: approveServiceActivation.mutateAsync,
    rejectServiceActivation: rejectServiceActivation.mutateAsync,
    isRequesting: requestServiceActivation.isPending
  };
};
