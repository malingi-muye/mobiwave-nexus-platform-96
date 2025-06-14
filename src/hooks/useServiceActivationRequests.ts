
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ServiceActivationRequest } from '@/types/serviceActivation';

export function useServiceActivationRequests() {
  return useQuery({
    queryKey: ['service-activation-requests'],
    queryFn: async (): Promise<ServiceActivationRequest[]> => {
      const { data, error } = await supabase
        .from('service_activation_requests')
        .select(`
          *,
          services_catalog!service_activation_requests_service_id_fkey(service_name, service_type, description),
          profiles!service_activation_requests_user_id_fkey(email, first_name, last_name)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        service: item.services_catalog,
        user: item.profiles
      })) as ServiceActivationRequest[];
    }
  });
}
