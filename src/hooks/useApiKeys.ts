
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ApiKey {
  id: string;
  user_id: string;
  key_name: string;
  api_key: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface ApiUsage {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms?: number;
  created_at: string;
}

export const useApiKeys = () => {
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async (): Promise<ApiKey[]> => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        permissions: Array.isArray(item.permissions) ? item.permissions as string[] : []
      }));
    }
  });

  const createApiKey = useMutation({
    mutationFn: async (keyData: Omit<ApiKey, 'id' | 'user_id' | 'api_key' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate a random API key
      const apiKey = `mb_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      const { data, error } = await supabase
        .from('api_keys')
        .insert({ ...keyData, user_id: user.id, api_key: apiKey })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create API key: ${error.message}`);
    }
  });

  const updateApiKey = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ApiKey> & { id: string }) => {
      const { data, error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update API key: ${error.message}`);
    }
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete API key: ${error.message}`);
    }
  });

  return {
    apiKeys,
    isLoading,
    createApiKey: createApiKey.mutateAsync,
    updateApiKey: updateApiKey.mutateAsync,
    deleteApiKey: deleteApiKey.mutateAsync,
    isCreating: createApiKey.isPending,
    isUpdating: updateApiKey.isPending,
    isDeleting: deleteApiKey.isPending
  };
};

export const useApiUsage = (apiKeyId?: string) => {
  const { data: usage = [], isLoading } = useQuery({
    queryKey: ['api-usage', apiKeyId],
    queryFn: async (): Promise<ApiUsage[]> => {
      if (!apiKeyId) return [];
      
      const { data, error } = await supabase
        .from('api_usage')
        .select('*')
        .eq('api_key_id', apiKeyId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!apiKeyId
  });

  return { usage, isLoading };
};
