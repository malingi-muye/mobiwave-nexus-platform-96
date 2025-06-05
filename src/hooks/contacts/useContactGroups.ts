
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

  const getContactGroups = useQuery({
    queryKey: ['contact-groups'],
    queryFn: async (): Promise<ContactGroup[]> => {
      const { data, error } = await supabase
        .from('contact_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const createContactGroup = useMutation({
    mutationFn: async (group: Omit<ContactGroup, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contact_groups')
        .insert({
          ...group,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
    contactGroups: getContactGroups.data || [],
    isLoading: getContactGroups.isLoading,
    error: getContactGroups.error,
    createContactGroup: createContactGroup.mutateAsync,
    refetch: getContactGroups.refetch
  };
};
