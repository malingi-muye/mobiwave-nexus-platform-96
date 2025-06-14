
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useServiceActivationMutations() {
  const queryClient = useQueryClient();

  const requestServiceActivation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_activation_requests')
        .insert({
          user_id: user.id,
          service_id: serviceId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
      toast.success('Service activation request submitted successfully');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate key')) {
        toast.error('You have already requested access to this service');
      } else {
        toast.error(`Failed to request service activation: ${error.message}`);
      }
    }
  });

  const approveServiceRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase.rpc('approve_service_request', {
        request_id: requestId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-service-activations'] });
      toast.success('Service activation request approved');
    },
    onError: (error: any) => {
      toast.error(`Failed to approve request: ${error.message}`);
    }
  });

  const rejectServiceRequest = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason?: string }) => {
      const { data, error } = await supabase.rpc('reject_service_request', {
        request_id: requestId,
        rejection_reason: reason
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-activation-requests'] });
      toast.success('Service activation request rejected');
    },
    onError: (error: any) => {
      toast.error(`Failed to reject request: ${error.message}`);
    }
  });

  const deactivateUserService = useMutation({
    mutationFn: async ({ userId, serviceId }: { userId: string; serviceId: string }) => {
      const { data, error } = await supabase
        .from('user_service_activations')
        .update({
          is_active: false,
          deactivated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('service_id', serviceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-service-activations'] });
      toast.success('Service deactivated for user');
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate service: ${error.message}`);
    }
  });

  return {
    requestServiceActivation,
    approveServiceRequest,
    rejectServiceRequest,
    deactivateUserService,
    isRequesting: requestServiceActivation.isPending,
    isApproving: approveServiceRequest.isPending,
    isRejecting: rejectServiceRequest.isPending,
    isDeactivating: deactivateUserService.isPending
  };
}
