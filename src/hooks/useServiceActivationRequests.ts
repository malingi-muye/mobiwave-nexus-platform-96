
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceActivationRequest } from '@/types/serviceActivation';

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

      if (error) {
        console.error('Error fetching service activation requests:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        service_id: item.service_id,
        status: item.status,
        requested_at: item.requested_at,
        approved_at: item.approved_at,
        approved_by: item.approved_by,
        rejection_reason: item.rejection_reason,
        user: Array.isArray(item.user) ? item.user[0] : item.user,
        service: Array.isArray(item.service) ? item.service[0] : item.service
      }));
    }
  });
};
