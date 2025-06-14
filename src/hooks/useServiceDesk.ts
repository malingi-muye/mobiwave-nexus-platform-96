
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceDeskTicket {
  id: string;
  subscription_id: string;
  ticket_number: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  assigned_to?: string;
  created_by: string;
  customer_phone?: string;
  customer_email?: string;
  sla_due_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  user_id: string;
  activity_type: 'comment' | 'status_change' | 'assignment' | 'priority_change';
  content?: string;
  metadata: any;
  created_at: string;
}

export const useServiceDesk = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['service-desk-tickets'],
    queryFn: async (): Promise<ServiceDeskTicket[]> => {
      const { data, error } = await supabase
        .from('service_desk_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        priority: item.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: item.status as 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
      }));
    }
  });

  const createTicket = useMutation({
    mutationFn: async (ticketData: Omit<ServiceDeskTicket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_desk_tickets')
        .insert({ ...ticketData, created_by: user.id, ticket_number: '' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-desk-tickets'] });
      toast.success('Ticket created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    }
  });

  const updateTicket = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceDeskTicket> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_desk_tickets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-desk-tickets'] });
      toast.success('Ticket updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update ticket: ${error.message}`);
    }
  });

  return {
    tickets,
    isLoading,
    createTicket: createTicket.mutateAsync,
    updateTicket: updateTicket.mutateAsync,
    isCreating: createTicket.isPending,
    isUpdating: updateTicket.isPending
  };
};

export const useTicketActivities = (ticketId?: string) => {
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['ticket-activities', ticketId],
    queryFn: async (): Promise<TicketActivity[]> => {
      if (!ticketId) return [];
      
      const { data, error } = await supabase
        .from('ticket_activities')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        activity_type: item.activity_type as 'comment' | 'status_change' | 'assignment' | 'priority_change'
      }));
    },
    enabled: !!ticketId
  });

  const addActivity = useMutation({
    mutationFn: async (activityData: Omit<TicketActivity, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ticket_activities')
        .insert({ ...activityData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-activities', ticketId] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add activity: ${error.message}`);
    }
  });

  return {
    activities,
    isLoading,
    addActivity: addActivity.mutateAsync,
    isAdding: addActivity.isPending
  };
};
