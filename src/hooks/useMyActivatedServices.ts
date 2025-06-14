
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserServiceActivation } from '@/types/serviceActivation';

export function useMyActivatedServices() {
  return useQuery({
    queryKey: ['my-activated-services'],
    queryFn: async (): Promise<UserServiceActivation[]> => {
      const { data: activations, error: activationsError } = await supabase
        .from('user_service_activations')
        .select('*')
        .eq('is_active', true);

      if (activationsError) throw activationsError;
      
      if (!activations || activations.length === 0) {
        return [];
      }

      // Get service details for each activation
      const serviceIds = activations.map(activation => activation.service_id);
      const { data: services, error: servicesError } = await supabase
        .from('services_catalog')
        .select('id, service_name, service_type')
        .in('id', serviceIds);

      if (servicesError) throw servicesError;

      // Combine the data
      return activations.map(activation => {
        const service = services?.find(s => s.id === activation.service_id);
        return {
          ...activation,
          service: service ? {
            service_name: service.service_name,
            service_type: service.service_type
          } : {
            service_name: 'Unknown Service',
            service_type: 'unknown'
          }
        };
      }) as UserServiceActivation[];
    }
  });
}
