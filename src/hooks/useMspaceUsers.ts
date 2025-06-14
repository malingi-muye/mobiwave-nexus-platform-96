
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MspaceClient {
  client_id: string;
  client_name: string;
  username?: string;
  phone?: string;
  email?: string;
  balance?: number;
  status?: string;
  created_date?: string;
  last_login?: string;
}

interface MspaceUser {
  id: string;
  mspace_client_id: string;
  client_name: string;
  username?: string;
  phone?: string;
  email?: string;
  balance: number;
  status: string;
  created_date?: string;
  last_login?: string;
  user_type: string;
  fetched_at: string;
  updated_at: string;
}

export const useMspaceUsers = () => {
  const queryClient = useQueryClient();

  // Fetch stored Mspace users from database
  const { data: storedMspaceUsers, isLoading: isLoadingStored } = useQuery({
    queryKey: ['mspace-users-stored'],
    queryFn: async (): Promise<MspaceUser[]> => {
      const { data, error } = await supabase
        .from('mspace_users')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch users from Mspace API
  const fetchMspaceClients = useMutation({
    mutationFn: async (): Promise<MspaceClient[]> => {
      // Get API credentials
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: credentials, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('user_id', user.id)
        .eq('service_name', 'mspace')
        .eq('is_active', true)
        .single();

      if (error || !credentials) {
        throw new Error('Mspace API credentials not configured');
      }

      const config = credentials.additional_config as any;
      const apiKey = config?.api_key;
      const username = config?.username;

      if (!apiKey || !username) {
        throw new Error('Incomplete Mspace API credentials');
      }

      // Fetch reseller clients from Mspace API
      const response = await fetch(
        `https://api.mspace.co.ke/smsapi/v2/reseller/clients/apikey=${apiKey}/username=${username}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch clients from Mspace API');
      }

      const data = await response.json();
      return data.clients || [];
    },
    onSuccess: (clients) => {
      toast.success(`Fetched ${clients.length} clients from Mspace API`);
    },
    onError: (error: any) => {
      toast.error(`Failed to fetch clients: ${error.message}`);
    }
  });

  // Sync Mspace clients to database
  const syncMspaceClients = useMutation({
    mutationFn: async (clients: MspaceClient[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Prepare data for upsert
      const upsertData = clients.map(client => ({
        mspace_client_id: client.client_id,
        client_name: client.client_name,
        username: client.username || null,
        phone: client.phone || null,
        email: client.email || null,
        balance: client.balance || 0,
        status: client.status || 'active',
        created_date: client.created_date ? new Date(client.created_date).toISOString() : null,
        last_login: client.last_login ? new Date(client.last_login).toISOString() : null,
        user_type: 'mspace_client',
        updated_at: new Date().toISOString()
      }));

      // Upsert clients (insert or update)
      const { error } = await supabase
        .from('mspace_users')
        .upsert(upsertData, { 
          onConflict: 'mspace_client_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      return upsertData.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['mspace-users-stored'] });
      toast.success(`Synced ${count} Mspace clients to database`);
    },
    onError: (error: any) => {
      toast.error(`Failed to sync clients: ${error.message}`);
    }
  });

  // Combined fetch and sync operation
  const fetchAndSyncClients = useMutation({
    mutationFn: async () => {
      const clients = await fetchMspaceClients.mutateAsync();
      await syncMspaceClients.mutateAsync(clients);
      return clients;
    }
  });

  return {
    storedMspaceUsers,
    isLoadingStored,
    fetchMspaceClients,
    syncMspaceClients,
    fetchAndSyncClients,
    isLoading: fetchMspaceClients.isPending || syncMspaceClients.isPending || fetchAndSyncClients.isPending
  };
};
