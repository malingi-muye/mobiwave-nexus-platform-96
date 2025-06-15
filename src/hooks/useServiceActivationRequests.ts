
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ServiceActivationRequest {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  requested_at: string;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  service?: {
    id: string;
    service_name: string;
    service_type: string;
  };
}

export const useServiceActivationRequests = () => {
  return useQuery({
    queryKey: ['service-activation-requests'],
    queryFn: async (): Promise<ServiceActivationRequest[]> => {
      const { data, error } = await supabase
        .from('service_activation_requests')
        .select(`
          *,
          user:profiles!service_activation_requests_user_id_fkey(
            id,
            email,
            first_name,
            last_name
          ),
          service:services_catalog!service_activation_requests_service_id_fkey(
            id,
            service_name,
            service_type
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};
