
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useWhatsAppSubscriptionsData = () => {
  return useQuery({
    queryKey: ['whatsapp-subscriptions'],
    queryFn: fetchWhatsAppSubscriptions
  });
};
