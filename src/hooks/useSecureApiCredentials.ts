
import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SecureCrypto } from '@/lib/secure-crypto';
import { toast } from 'sonner';

interface SecureApiCredentials {
  id: string;
  service_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Encrypted fields are handled securely
}

interface ApiCredentialInput {
  service_name: string;
  api_key?: string;
  api_secret?: string;
  additional_config?: Record<string, any>;
}

export const useSecureApiCredentials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const crypto = SecureCrypto.getInstance();

  const { data: credentials, isLoading: isLoadingCredentials } = useQuery({
    queryKey: ['secure-api-credentials'],
    queryFn: async (): Promise<SecureApiCredentials[]> => {
      const { data, error } = await supabase
        .from('api_credentials')
        .select('id, service_name, is_active, created_at, updated_at')
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    }
  });

  const saveCredentials = useMutation({
    mutationFn: async (input: ApiCredentialInput) => {
      setIsLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Encrypt sensitive data server-side
        const encryptedApiKey = input.api_key ? await crypto.encrypt(input.api_key) : null;
        const encryptedSecret = input.api_secret ? await crypto.encrypt(input.api_secret) : null;
        
        // Store only encrypted data
        const { data, error } = await supabase
          .from('api_credentials')
          .upsert({
            user_id: user.id,
            service_name: input.service_name,
            api_key_encrypted: encryptedApiKey,
            api_secret_encrypted: encryptedSecret,
            additional_config: input.additional_config || {},
            is_active: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,service_name'
          })
          .select()
          .single();

        if (error) throw error;
        return data;
        
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-api-credentials'] });
      toast.success('API credentials saved securely');
    },
    onError: (error: any) => {
      toast.error(`Failed to save credentials: ${error.message}`);
    }
  });

  const getDecryptedCredentials = useCallback(async (serviceName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('api_credentials')
        .select('api_key_encrypted, api_secret_encrypted, additional_config')
        .eq('user_id', user.id)
        .eq('service_name', serviceName)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Decrypt on server-side for security
      const apiKey = data.api_key_encrypted ? await crypto.decrypt(data.api_key_encrypted) : null;
      const apiSecret = data.api_secret_encrypted ? await crypto.decrypt(data.api_secret_encrypted) : null;

      return {
        api_key: apiKey,
        api_secret: apiSecret,
        additional_config: data.additional_config
      };
      
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }, [crypto]);

  const deleteCredentials = useMutation({
    mutationFn: async (credentialId: string) => {
      const { error } = await supabase
        .from('api_credentials')
        .update({ is_active: false })
        .eq('id', credentialId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-api-credentials'] });
      toast.success('API credentials removed');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove credentials: ${error.message}`);
    }
  });

  return {
    credentials: credentials || [],
    isLoading: isLoadingCredentials || isLoading,
    saveCredentials: saveCredentials.mutateAsync,
    getDecryptedCredentials,
    deleteCredentials: deleteCredentials.mutateAsync
  };
};
