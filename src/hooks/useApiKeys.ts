
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  rate_limit: number;
}

interface CreateApiKeyData {
  key_name: string;
  permissions: string[];
  rate_limit?: number;
  expires_at?: string;
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
      
      // Transform the data to ensure permissions is always an array
      return (data || []).map(item => ({
        ...item,
        permissions: Array.isArray(item.permissions) ? item.permissions : JSON.parse(item.permissions as string || '[]')
      }));
    }
  });

  const createApiKey = useMutation({
    mutationFn: async (keyData: CreateApiKeyData): Promise<ApiKey> => {
      // Generate a random API key
      const apiKey = `mk_${keyData.key_name.includes('live') ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          key_name: keyData.key_name,
          api_key: apiKey,
          permissions: keyData.permissions,
          rate_limit: keyData.rate_limit || 1000,
          expires_at: keyData.expires_at,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        permissions: Array.isArray(data.permissions) ? data.permissions : JSON.parse(data.permissions as string || '[]')
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create API key: ${error.message}`);
    }
  });

  const toggleApiKey = useMutation({
    mutationFn: async ({ keyId, isActive }: { keyId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: isActive })
        .eq('id', keyId);

      if (error) throw error;
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
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

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

  const getApiUsage = async (keyId: string) => {
    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .eq('api_key_id', keyId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  };

  return {
    apiKeys,
    isLoading,
    createApiKey: createApiKey.mutateAsync,
    toggleApiKey: toggleApiKey.mutateAsync,
    deleteApiKey: deleteApiKey.mutateAsync,
    getApiUsage,
    isCreating: createApiKey.isPending
  };
};
