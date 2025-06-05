
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Contact {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useContactsData = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(contact => ({
        ...contact,
        custom_fields: typeof contact.custom_fields === 'object' && contact.custom_fields !== null 
          ? contact.custom_fields as Record<string, any>
          : {}
      }));
    }
  });
};
