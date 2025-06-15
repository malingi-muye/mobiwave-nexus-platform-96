
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useServiceActivationMutations = () => {
  const queryClient = useQueryClient();

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
      toast.success('Service request approved successfully');
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
      toast.success('Service request rejected');
    },
    onError: (error: any) => {
      toast.error(`Failed to reject request: ${error.message}`);
    }
  });

  const deactivateUserService = useMutation({
    mutationFn: async ({ userId, serviceId }: { userId: string; serviceId: string }) => {
      const { data, error } = await supabase.rpc('bulk_service_operation', {
        user_ids: [userId],
        service_id: serviceId,
        operation: 'deactivate'
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-service-activations'] });
      toast.success('Service deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to deactivate service: ${error.message}`);
    }
  });

  return {
    approveServiceRequest,
    rejectServiceRequest,
    deactivateUserService,
    isApproving: approveServiceRequest.isPending,
    isRejecting: rejectServiceRequest.isPending
  };
};
