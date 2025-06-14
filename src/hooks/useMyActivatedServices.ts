
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserServiceActivation } from '@/types/serviceActivation';

export function useMyActivatedServices() {
  return useQuery({
    queryKey: ['my-activated-services'],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      const { data, error } = await supabase
        .from('user_service_activations')
        .select(`
          *,
          services_catalog(service_name, service_type)
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        service: item.services_catalog
      })) as UserServiceActivation[];
    }
  });
}
