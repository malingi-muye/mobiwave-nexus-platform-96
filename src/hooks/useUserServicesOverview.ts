
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
      console.log('Fetching user services overview...');
      
      try {
        // First, let's try the RPC function
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_services');
        
        if (!rpcError && rpcData && rpcData.length > 0) {
          console.log('Using RPC data:', rpcData.length, 'records');
          
          // Group by user
          const grouped = rpcData.reduce((acc: any, item: any) => {
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
              is_eligible: item.is_eligible !== false,
              status: item.overall_status || 'inactive'
            });
            
            return acc;
          }, {});
          
          return Object.values(grouped);
        }
        
        // Fallback: Manual join query
        console.log('RPC failed, using manual join...');
        
        // Get all users
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, role');
          
        if (usersError) throw usersError;
        
        // Get all services
        const { data: services, error: servicesError } = await supabase
          .from('services_catalog')
          .select('*')
          .eq('is_active', true);
          
        if (servicesError) throw servicesError;
        
        // Get all activations
        const { data: activations, error: activationsError } = await supabase
          .from('user_service_activations')
          .select('*');
          
        if (activationsError) throw activationsError;
        
        console.log('Manual join data:', { users: users?.length, services: services?.length, activations: activations?.length });
        
        // Combine the data
        const result = (users || []).map(user => ({
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role || 'user'
          },
          services: (services || []).map(service => {
            const activation = activations?.find(a => a.user_id === user.id && a.service_id === service.id);
            return {
              id: service.id,
              service_name: service.service_name,
              service_type: service.service_type,
              is_activated: activation?.is_active || false,
              is_eligible: !service.is_premium || user.role !== 'demo_user',
              status: activation?.is_active ? 'active' : 'available'
            };
          })
        }));
        
        return result;
        
      } catch (error) {
        console.error('Error in user services overview:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000
  });

  const toggleService = useMutation({
    mutationFn: async ({ userId, serviceId, operation }: { userId: string; serviceId: string; operation: 'activate' | 'deactivate' }) => {
      console.log('Toggling service:', { userId, serviceId, operation });
      
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
      console.error('Toggle service error:', error);
      toast.error(`Failed to update service: ${error.message}`);
    }
  });

  const bulkServiceOperation = useMutation({
    mutationFn: async ({ userIds, serviceId, operation }: { userIds: string[]; serviceId: string; operation: 'activate' | 'deactivate' }) => {
      console.log('Bulk operation:', { userIds, serviceId, operation });
      
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
      console.error('Bulk operation error:', error);
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
