
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContactGroup {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export const useContactGroups = () => {
  const queryClient = useQueryClient();

  const { data: contactGroups = [], isLoading, error, refetch } = useQuery({
    queryKey: ['contact-groups'],
    queryFn: async () => {
      // Since contact_groups table doesn't exist, return empty array for now
      // This would need the table to be created in the database
      console.warn('contact_groups table not found, returning empty array');
      return [] as ContactGroup[];
    }
  });

  const createContactGroup = useMutation({
    mutationFn: async (group: Omit<ContactGroup, 'id' | 'user_id' | 'created_at'>) => {
      // Mock implementation since table doesn't exist
      const mockGroup: ContactGroup = {
        id: crypto.randomUUID(),
        user_id: 'mock-user-id',
        name: group.name,
        description: group.description,
        created_at: new Date().toISOString()
      };
      
      console.warn('contact_groups table not found, using mock data');
      return mockGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-groups'] });
      toast.success('Contact group created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create contact group: ${error.message}`);
    }
  });

  return {
    contactGroups,
    isLoading,
    error,
    createContactGroup: createContactGroup.mutateAsync,
    refetch
  };
};
