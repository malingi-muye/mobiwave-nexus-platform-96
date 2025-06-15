
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserServiceActivation {
  id: string;
  user_id: string;
  service_id: string;
  is_active: boolean;
  activated_at: string;
  activated_by?: string;
  service: {
    id: string;
    service_name: string;
    service_type: string;
  };
}

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

      if (error) throw error;
      return data || [];
    }
  });
};
