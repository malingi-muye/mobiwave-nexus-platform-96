
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceActivationRequest {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  service: {
    service_name: string;
    service_type: string;
    description: string;
  };
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface UserServiceActivation {
  id: string;
  user_id: string;
  service_id: string;
  is_active: boolean;
  activated_at: string;
  service: {
    service_name: string;
    service_type: string;
  };
}

export function useServiceActivation() {
  const queryClient = useQueryClient();

  // Fetch pending service activation requests (admin view)
  const { data: activationRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['service-activation-requests'],
    queryFn: async (): Promise<ServiceActivationRequest[]> => {
      const { data, error } = await supabase
        .from('service_activation_requests')
        .select(`
          *,
          service:services_catalog(service_name, service_type, description),
          user:profiles(email, first_name, last_name)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user service activations (admin view)
  const { data: userActivations = [], isLoading: activationsLoading } = useQuery({
    queryKey: ['user-service-activations'],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      const { data, error } = await supabase
        .from('user_service_activations')
        .select(`
          *,
          service:services_catalog(service_name, service_type)
        `)
        .eq('is_active', true)
        .order('activated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch current user's activated services
  const { data: myActivatedServices = [], isLoading: myServicesLoading } = useQuery({
    queryKey: ['my-activated-services'],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      const { data, error } = await supabase
        .from('user_service_activations')
        .select(`
          *,
          service:services_catalog(service_name, service_type)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    }
  });

  // Request service activation
  const requestServiceActivation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { data, error } = await supabase
        .from('service_activation_requests')
        .insert({
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

  // Approve service activation request
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

  // Reject service activation request
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

  // Deactivate service for user
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
    activationRequests,
    userActivations,
    myActivatedServices,
    isLoading: requestsLoading || activationsLoading || myServicesLoading,
    requestServiceActivation: requestServiceActivation.mutateAsync,
    approveServiceRequest: approveServiceRequest.mutateAsync,
    rejectServiceRequest: rejectServiceRequest.mutateAsync,
    deactivateUserService: deactivateUserService.mutateAsync,
    isRequesting: requestServiceActivation.isPending,
    isApproving: approveServiceRequest.isPending,
    isRejecting: rejectServiceRequest.isPending,
    isDeactivating: deactivateUserService.isPending
  };
}
