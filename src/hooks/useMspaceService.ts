
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMspaceBalance } from './mspace/useMspaceBalance';
import { useMspaceDelivery } from './mspace/useMspaceDelivery';
import { useMspaceAccounts } from './mspace/useMspaceAccounts';

interface SMSPayload {
  username: string;
  senderId: string;
  recipient: string;
  message: string;
  campaignId?: string;
}

export const useMspaceService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const balance = useMspaceBalance();
  const delivery = useMspaceDelivery();
  const accounts = useMspaceAccounts();

  const sendSMS = async (payload: SMSPayload) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('mspace-sms', {
        body: {
          recipients: [payload.recipient],
          message: payload.message,
          senderId: payload.senderId,
          campaignId: payload.campaignId
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast.error(`Failed to send SMS: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendSMS,
    checkBalance: balance.checkBalance,
    getDeliveryReport: delivery.getDeliveryReport,
    querySubAccounts: accounts.querySubAccounts,
    queryResellerClients: accounts.queryResellerClients,
    topUpSubAccount: accounts.topUpSubAccount,
    topUpResellerClient: accounts.topUpResellerClient,
    isLoading: isLoading || balance.isLoading || delivery.isLoading || accounts.isLoading
  };
};
