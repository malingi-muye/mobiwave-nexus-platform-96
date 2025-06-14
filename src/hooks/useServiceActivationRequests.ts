
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ServiceActivationRequest } from '@/types/serviceActivation';

export function useServiceActivationRequests() {
  return useQuery({
    queryKey: ['service-activation-requests'],
    queryFn: async (): Promise<ServiceActivationRequest[]> => {
      const { data: requests, error: requestsError } = await supabase
        .from('service_activation_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;
      
      if (!requests || requests.length === 0) {
        return [];
      }

      // Get service details
      const serviceIds = requests.map(request => request.service_id);
      const { data: services, error: servicesError } = await supabase
        .from('services_catalog')
        .select('id, service_name, service_type, description')
        .in('id', serviceIds);

      if (servicesError) throw servicesError;

      // Get user details
      const userIds = requests.map(request => request.user_id);
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Combine the data
      return requests.map(request => {
        const service = services?.find(s => s.id === request.service_id);
        const user = users?.find(u => u.id === request.user_id);
        
        return {
          ...request,
          service: service ? {
            service_name: service.service_name,
            service_type: service.service_type,
            description: service.description || ''
          } : {
            service_name: 'Unknown Service',
            service_type: 'unknown',
            description: ''
          },
          user: user ? {
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || ''
          } : {
            email: 'Unknown User',
            first_name: '',
            last_name: ''
          }
        };
      }) as ServiceActivationRequest[];
    }
  });
}
