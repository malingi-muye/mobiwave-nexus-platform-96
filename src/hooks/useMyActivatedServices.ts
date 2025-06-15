
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserServiceActivation } from '@/types/serviceActivation';
import { useAuth } from '@/components/auth/AuthProvider';

export const useMyActivatedServices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-activated-services', user?.id],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      if (!user?.id) return [];

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
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('activated_at', { ascending: false });

      if (error) {
        console.error('Error fetching my activated services:', error);
        return [];
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
    },
    enabled: !!user?.id
  });
};
