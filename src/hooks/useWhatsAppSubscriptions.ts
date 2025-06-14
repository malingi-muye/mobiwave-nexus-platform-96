
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WhatsAppSubscription {
  id: string;
  subscription_id: string;
  phone_number_id: string;
  business_account_id: string;
  webhook_url: string;
  verify_token: string;
  message_limit: number;
  current_messages: number;
  status: string;
  created_at: string;
}

interface WhatsAppTemplate {
  id: string;
  subscription_id: string;
  name: string;
  category: string;
  language: string;
  header_type?: string;
  header_text?: string;
  body_text: string;
  footer_text?: string;
  buttons: any[];
  variables: any[];
  status: string;
  whatsapp_template_id?: string;
  created_at: string;
}

interface WhatsAppMessage {
  id: string;
  subscription_id: string;
  recipient_phone: string;
  message_type: string;
  content: string;
  template_name?: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failed_reason?: string;
  created_at: string;
}

const fetchWhatsAppSubscriptions = async (): Promise<WhatsAppSubscription[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('whatsapp_subscriptions')
    .select(`
      *,
      user_service_subscriptions!inner(
        user_id,
        service_id,
        services_catalog(service_name, service_type)
      )
    `)
    .eq('user_service_subscriptions.user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchWhatsAppTemplates = async (subscriptionId?: string): Promise<WhatsAppTemplate[]> => {
  if (!subscriptionId) return [];

  const { data, error } = await supabase
    .from('whatsapp_templates')
    .select('*')
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const fetchWhatsAppMessages = async (subscriptionId?: string): Promise<WhatsAppMessage[]> => {
  if (!subscriptionId) return [];

  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
};

export const useWhatsAppSubscriptions = () => {
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['whatsapp-subscriptions'],
    queryFn: fetchWhatsAppSubscriptions
  });

  const createSubscription = useMutation({
    mutationFn: async (subscriptionData: {
      phone_number_id: string;
      business_account_id: string;
      webhook_url: string;
      verify_token: string;
      access_token: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: subscription } = await supabase
        .from('user_service_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_id', (await supabase
          .from('services_catalog')
          .select('id')
          .eq('service_type', 'whatsapp')
          .single()).data?.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        throw new Error('You need an active WhatsApp service subscription to create integrations');
      }

      const { data, error } = await supabase
        .from('whatsapp_subscriptions')
        .insert({
          subscription_id: subscription.id,
          phone_number_id: subscriptionData.phone_number_id,
          business_account_id: subscriptionData.business_account_id,
          webhook_url: subscriptionData.webhook_url,
          verify_token: subscriptionData.verify_token,
          access_token_encrypted: subscriptionData.access_token,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-subscriptions'] });
      toast.success('WhatsApp integration created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create integration: ${error.message}`);
    }
  });

  return {
    subscriptions,
    isLoading,
    createSubscription: createSubscription.mutateAsync,
    isCreating: createSubscription.isPending
  };
};

export const useWhatsAppTemplates = (subscriptionId?: string) => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['whatsapp-templates', subscriptionId],
    queryFn: () => fetchWhatsAppTemplates(subscriptionId),
    enabled: !!subscriptionId
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: {
      name: string;
      category: string;
      language: string;
      header_type?: string;
      header_text?: string;
      body_text: string;
      footer_text?: string;
      buttons?: any[];
      variables?: any[];
    }) => {
      if (!subscriptionId) throw new Error('No subscription selected');

      const { data, error } = await supabase
        .from('whatsapp_templates')
        .insert({
          subscription_id: subscriptionId,
          ...templateData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-templates', subscriptionId] });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create template: ${error.message}`);
    }
  });

  return {
    templates,
    isLoading,
    createTemplate: createTemplate.mutateAsync,
    isCreating: createTemplate.isPending
  };
};

export const useWhatsAppMessages = (subscriptionId?: string) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['whatsapp-messages', subscriptionId],
    queryFn: () => fetchWhatsAppMessages(subscriptionId),
    enabled: !!subscriptionId
  });

  return {
    messages,
    isLoading
  };
};
