
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserServicesData {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
  };
  services: Array<{
    id: string;
    service_name: string;
    service_type: string;
    is_activated: boolean;
    is_eligible: boolean;
    status: string;
  }>;
}

export const useUserServicesOverview = () => {
  const queryClient = useQueryClient();

  const { data: groupedByUser = [], isLoading } = useQuery({
    queryKey: ['user-services-overview'],
    queryFn: async (): Promise<UserServicesData[]> => {
      const { data, error } = await supabase.rpc('get_user_services');
      
      if (error) throw error;
      
      // Group by user
      const grouped = data.reduce((acc: any, item: any) => {
        const userId = item.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user: {
              id: item.user_id,
              email: item.email,
              first_name: item.first_name,
              last_name: item.last_name,
              role: item.role
            },
            services: []
          };
        }
        
        acc[userId].services.push({
          id: item.service_id,
          service_name: item.service_name,
          service_type: item.service_type,
          is_activated: item.is_activated || false,
          is_eligible: item.is_eligible || false,
          status: item.overall_status || 'inactive'
        });
        
        return acc;
      }, {});
      
      return Object.values(grouped);
    }
  });

  const toggleService = useMutation({
    mutationFn: async ({ userId, serviceId, operation }: { userId: string; serviceId: string; operation: 'activate' | 'deactivate' }) => {
      const { data, error } = await supabase.rpc('bulk_service_operation', {
        user_ids: [userId],
        service_id: serviceId,
        operation
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
      toast.success('Service status updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update service: ${error.message}`);
    }
  });

  const bulkServiceOperation = useMutation({
    mutationFn: async ({ userIds, serviceId, operation }: { userIds: string[]; serviceId: string; operation: 'activate' | 'deactivate' }) => {
      const { data, error } = await supabase.rpc('bulk_service_operation', {
        user_ids: userIds,
        service_id: serviceId,
        operation
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-services-overview'] });
      toast.success('Bulk operation completed successfully');
    },
    onError: (error: any) => {
      toast.error(`Bulk operation failed: ${error.message}`);
    }
  });

  return {
    groupedByUser,
    isLoading,
    toggleService: toggleService.mutateAsync,
    bulkServiceOperation: bulkServiceOperation.mutateAsync,
    isUpdating: toggleService.isPending || bulkServiceOperation.isPending
  };
};
