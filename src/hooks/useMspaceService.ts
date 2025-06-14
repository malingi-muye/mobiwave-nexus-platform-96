
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMspaceBalance } from './mspace/useMspaceBalance';
import { useMspaceDelivery } from './mspace/useMspaceDelivery';
import { useMspaceAccounts } from './mspace/useMspaceAccounts';

interface SMSPayload {
  recipients: string[];
  message: string;
  senderId?: string;
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
      const { data, error } = await supabase.functions.invoke('mspace-sms', {
        body: {
          recipients: payload.recipients,
          message: payload.message,
          senderId: payload.senderId,
          campaignId: payload.campaignId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast.error(`Failed to send SMS: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // SMS Sending
    sendSMS,
    
    // Balance checking
    checkBalance: balance.checkBalance,
    
    // Delivery reporting
    getDeliveryReport: delivery.getDeliveryReport,
    getBatchDeliveryReports: delivery.getBatchDeliveryReports,
    
    // Account management
    querySubAccounts: accounts.querySubAccounts,
    queryResellerClients: accounts.queryResellerClients,
    topUpSubAccount: accounts.topUpSubAccount,
    topUpResellerClient: accounts.topUpResellerClient,
    
    // Loading state
    isLoading: isLoading || balance.isLoading || delivery.isLoading || accounts.isLoading
  };
};
