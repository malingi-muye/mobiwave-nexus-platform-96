
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface UserServiceOverview {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  user_type: string;
  service_id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  is_premium: boolean;
  service_available: boolean;
  is_activated: boolean;
  activated_at: string | null;
  subscription_status: string | null;
  overall_status: string;
  is_eligible: boolean;
}

export interface BulkOperationResult {
  user_id: string;
  success: boolean;
  message: string;
}

export function useUserServicesOverview(targetUserId?: string) {
  const queryClient = useQueryClient();

  // Fetch user services data
  const { data: userServices = [], isLoading, error } = useQuery({
    queryKey: ['user-services-overview', targetUserId],
    queryFn: async (): Promise<UserServiceOverview[]> => {
      const { data, error } = await supabase.rpc('get_user_services', {
        target_user_id: targetUserId || null
      });

      if (error) throw error;
      return data || [];
    }
  });

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('user-services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_service_activations'
        },
        (payload) => {
          console.log('Service activation change:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_service_subscriptions'
        },
        (payload) => {
          console.log('Service subscription change:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services_catalog'
        },
        (payload) => {
          console.log('Service catalog change:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Individual service activation/deactivation
  const toggleServiceMutation = useMutation({
    mutationFn: async ({ userId, serviceId, operation }: { 
      userId: string; 
      serviceId: string; 
      operation: 'activate' | 'deactivate' 
    }) => {
      const { data, error } = await supabase.rpc('bulk_service_operation', {
        user_ids: [userId],
        service_id: serviceId,
        operation: operation
      });

      if (error) throw error;
      return data as BulkOperationResult[];
    },
    onSuccess: (data) => {
      const result = data[0];
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
    },
    onError: (error: any) => {
      console.error('Service toggle failed:', error);
      toast.error('Failed to update service status');
    }
  });

  // Bulk service operations
  const bulkServiceMutation = useMutation({
    mutationFn: async ({ userIds, serviceId, operation }: { 
      userIds: string[]; 
      serviceId: string; 
      operation: 'activate' | 'deactivate' 
    }) => {
      const { data, error } = await supabase.rpc('bulk_service_operation', {
        user_ids: userIds,
        service_id: serviceId,
        operation: operation
      });

      if (error) throw error;
      return data as BulkOperationResult[];
    },
    onSuccess: (data) => {
      const successCount = data.filter(r => r.success).length;
      const failureCount = data.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`${successCount} users updated successfully`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} users failed to update`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
    },
    onError: (error: any) => {
      console.error('Bulk operation failed:', error);
      toast.error('Failed to perform bulk operation');
    }
  });

  // Group data by user for easier display
  const groupedByUser = userServices.reduce((acc, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = {
        user: {
          id: item.user_id,
          email: item.email,
          first_name: item.first_name,
          last_name: item.last_name,
          role: item.role,
          user_type: item.user_type
        },
        services: []
      };
    }
    acc[item.user_id].services.push({
      service_id: item.service_id,
      service_name: item.service_name,
      service_type: item.service_type,
      description: item.description,
      setup_fee: item.setup_fee,
      monthly_fee: item.monthly_fee,
      is_premium: item.is_premium,
      service_available: item.service_available,
      is_activated: item.is_activated,
      activated_at: item.activated_at,
      subscription_status: item.subscription_status,
      overall_status: item.overall_status,
      is_eligible: item.is_eligible
    });
    return acc;
  }, {} as Record<string, any>);

  return {
    userServices,
    groupedByUser: Object.values(groupedByUser),
    isLoading,
    error,
    toggleService: toggleServiceMutation.mutateAsync,
    bulkServiceOperation: bulkServiceMutation.mutateAsync,
    isUpdating: toggleServiceMutation.isPending || bulkServiceMutation.isPending
  };
}
