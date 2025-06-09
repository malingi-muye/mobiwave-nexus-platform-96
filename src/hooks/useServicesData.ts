
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
}

interface UserService {
  id: string;
  user_id: string;
  service_id: string;
  is_enabled: boolean;
  services: Service;
  user_profile?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .order('email');

  if (error) throw error;
  return data || [];
};

const fetchUserServices = async (): Promise<UserService[]> => {
  const { data, error } = await supabase
    .from('user_services')
    .select(`
      *,
      services(*),
      profiles!user_services_user_id_fkey(email, first_name, last_name)
    `)
    .order('user_id');

  if (error) {
    console.error('Error fetching user services:', error);
    return [];
  }
  
  // Transform the data to match our interface, handling potential join failures
  const transformedData = (data || []).map(item => {
    // Extract profiles data safely with proper type checking
    const profilesData = item.profiles;
    
    // Check if profilesData has the expected structure and is not null
    if (profilesData && 
        typeof profilesData === 'object' && 
        'email' in profilesData) {
      
      // Type assertion after null and structure check
      const validProfile = profilesData as { email: string; first_name?: string; last_name?: string };
      
      return {
        ...item,
        user_profile: {
          email: validProfile.email,
          first_name: validProfile.first_name || undefined,
          last_name: validProfile.last_name || undefined
        }
      };
    }

    // If no valid profile data, return with null user_profile
    return {
      ...item,
      user_profile: null
    };
  });

  return transformedData as UserService[];
};

export function useServicesData() {
  const queryClient = useQueryClient();

  const servicesQuery = useQuery({
    queryKey: ['admin-services'],
    queryFn: fetchServices
  });

  const usersQuery = useQuery({
    queryKey: ['admin-users-simple'],
    queryFn: fetchUsers
  });

  const userServicesQuery = useQuery({
    queryKey: ['admin-user-services'],
    queryFn: fetchUserServices
  });

  const updateServiceStatus = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update service: ${error.message}`);
    }
  });

  const toggleUserService = useMutation({
    mutationFn: async ({ userId, serviceId, enabled }: { userId: string; serviceId: string; enabled: boolean }) => {
      if (enabled) {
        const currentUser = await supabase.auth.getUser();
        const { error } = await supabase
          .from('user_services')
          .upsert({
            user_id: userId,
            service_id: serviceId,
            is_enabled: true,
            enabled_by: currentUser.data.user?.id
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_services')
          .delete()
          .eq('user_id', userId)
          .eq('service_id', serviceId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-services'] });
      toast.success('User service updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user service: ${error.message}`);
    }
  });

  const enableAllServicesForUser = useMutation({
    mutationFn: async (userId: string) => {
      const currentUser = await supabase.auth.getUser();
      const services = servicesQuery.data?.filter(s => s.is_active) || [];
      const servicesToInsert = services.map(service => ({
        user_id: userId,
        service_id: service.id,
        is_enabled: true,
        enabled_by: currentUser.data.user?.id
      }));

      const { error } = await supabase
        .from('user_services')
        .upsert(servicesToInsert, { onConflict: 'user_id,service_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-services'] });
      toast.success('All services enabled for user');
    },
    onError: (error: any) => {
      toast.error(`Failed to enable services: ${error.message}`);
    }
  });

  return {
    services: servicesQuery.data || [],
    users: usersQuery.data || [],
    userServices: userServicesQuery.data || [],
    isLoading: servicesQuery.isLoading || usersQuery.isLoading || userServicesQuery.isLoading,
    updateServiceStatus,
    toggleUserService,
    enableAllServicesForUser
  };
}
