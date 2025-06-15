
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserServiceActivation } from '@/types/serviceActivation';

export const useUserServiceActivations = () => {
  return useQuery({
    queryKey: ['user-service-activations'],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      const { data, error } = await supabase
        .from('user_service_activations')
        .select(`
          *,
          service:services_catalog!user_service_activations_service_id_fkey(
            id,
            service_name,
            service_type
          )
        `)
        .eq('is_active', true)
        .order('activated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user service activations:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        service_id: item.service_id,
        is_active: item.is_active,
        activated_at: item.activated_at,
        activated_by: item.activated_by,
        service: Array.isArray(item.service) ? item.service[0] : item.service
      }));
    }
  });
};
