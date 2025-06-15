
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  secret: string;
  last_delivery?: string;
  delivery_success_rate: number;
  total_deliveries: number;
}

interface CreateWebhookData {
  name: string;
  url: string;
  events: string[];
}

export const useWebhooks = () => {
  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhook-endpoints'],
    queryFn: async (): Promise<WebhookEndpoint[]> => {
      const { data, error } = await supabase
        .from('webhook_endpoints' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure events is always an array
      return (data || []).map(item => ({
        ...item,
        events: Array.isArray(item.events) ? item.events : JSON.parse(item.events as string || '[]')
      }));
    }
  });

  const createWebhook = useMutation({
    mutationFn: async (webhookData: CreateWebhookData): Promise<WebhookEndpoint> => {
      // Generate webhook secret
      const secret = `whsec_${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase
        .from('webhook_endpoints' as any)
        .insert({
          name: webhookData.name,
          url: webhookData.url,
          events: webhookData.events,
          secret: secret,
          is_active: true,
          delivery_success_rate: 0,
          total_deliveries: 0,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        events: Array.isArray(data.events) ? data.events : JSON.parse(data.events as string || '[]')
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook endpoint created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create webhook: ${error.message}`);
    }
  });

  const toggleWebhook = useMutation({
    mutationFn: async ({ webhookId, isActive }: { webhookId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('webhook_endpoints' as any)
        .update({ is_active: isActive })
        .eq('id', webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update webhook: ${error.message}`);
    }
  });

  const deleteWebhook = useMutation({
    mutationFn: async (webhookId: string) => {
      const { error } = await supabase
        .from('webhook_endpoints' as any)
        .delete()
        .eq('id', webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete webhook: ${error.message}`);
    }
  });

  const testWebhook = useMutation({
    mutationFn: async (webhookId: string) => {
      const { data, error } = await supabase.functions.invoke('webhook-test', {
        body: { webhook_id: webhookId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook test sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to test webhook: ${error.message}`);
    }
  });

  const getWebhookDeliveries = async (webhookId: string) => {
    const { data, error } = await supabase
      .from('webhook_deliveries' as any)
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  };

  return {
    webhooks,
    isLoading,
    createWebhook: createWebhook.mutateAsync,
    toggleWebhook: toggleWebhook.mutateAsync,
    deleteWebhook: deleteWebhook.mutateAsync,
    testWebhook: testWebhook.mutateAsync,
    getWebhookDeliveries,
    isCreating: createWebhook.isPending,
    isTesting: testWebhook.isPending
  };
};
