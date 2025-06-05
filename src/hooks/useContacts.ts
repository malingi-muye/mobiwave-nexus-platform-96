import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export interface ContactGroup {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export const useContacts = () => {
  const queryClient = useQueryClient();

  // Fetch all contacts
  const getContacts = useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle the custom_fields Json type
      return (data || []).map(contact => ({
        ...contact,
        custom_fields: typeof contact.custom_fields === 'object' && contact.custom_fields !== null 
          ? contact.custom_fields as Record<string, any>
          : {}
      }));
    }
  });

  // Fetch contact groups
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

  // Create contact
  const createContact = useMutation({
    mutationFn: async (contact: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contact,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create contact: ${error.message}`);
    }
  });

  // Update contact
  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update contact: ${error.message}`);
    }
  });

  // Delete contact
  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    }
  });

  // Create contact group
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

  // Import contacts from CSV
  const importContacts = useMutation({
    mutationFn: async (contacts: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const contactsWithUserId = contacts.map(contact => ({
        ...contact,
        user_id: user.id
      }));

      const { data, error } = await supabase
        .from('contacts')
        .insert(contactsWithUserId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success(`Successfully imported ${data?.length || 0} contacts`);
    },
    onError: (error: any) => {
      toast.error(`Failed to import contacts: ${error.message}`);
    }
  });

  return {
    contacts: getContacts.data || [],
    contactGroups: getContactGroups.data || [],
    isLoading: getContacts.isLoading || getContactGroups.isLoading,
    error: getContacts.error || getContactGroups.error,
    createContact: createContact.mutateAsync,
    updateContact: updateContact.mutateAsync,
    deleteContact: deleteContact.mutateAsync,
    createContactGroup: createContactGroup.mutateAsync,
    importContacts: importContacts.mutateAsync,
    refetch: () => {
      getContacts.refetch();
      getContactGroups.refetch();
    }
  };
};
