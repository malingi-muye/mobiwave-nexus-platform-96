
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SMSPayload {
  username: string;
  senderId: string;
  recipient: string;
  message: string;
  campaignId?: string;
}

interface BalanceResponse {
  balance: number;
  status: string;
}

interface DeliveryReportPayload {
  username: string;
  messageId: string;
}

interface DeliveryReportResponse {
  messageId: string;
  status: string;
  deliveryTime?: string;
  recipient?: string;
}

interface SubAccountPayload {
  username: string;
  clientname: string;
  noOfSms: number;
}

export const useMspaceService = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getApiCredentials = async () => {
    const { data: credentials, error } = await supabase
      .from('api_credentials')
      .select('*')
      .eq('service_name', 'mspace')
      .eq('is_active', true)
      .single();

    if (error || !credentials) {
      throw new Error('No active Mspace API credentials found. Please configure your API settings.');
    }

    // Extract credentials from additional_config
    const config = credentials.additional_config as any;
    return {
      api_key: config?.api_key || credentials.api_key_encrypted || '',
      username: config?.username || '',
      sender_id: config?.sender_id || ''
    };
  };

  const sendSMS = async (payload: SMSPayload) => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await supabase.functions.invoke('mspace-sms', {
        body: payload,
        headers: {
          'x-api-key': credentials.api_key
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error(`Failed to send SMS: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkBalance = async (): Promise<BalanceResponse> => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch(`https://api.mspace.co.ke/smsapi/v2/balance/apikey=${credentials.api_key}/username=${credentials.username}`);
      
      if (!response.ok) {
        throw new Error('Failed to check balance');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking balance:', error);
      toast.error(`Failed to check balance: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDeliveryReport = async (payload: DeliveryReportPayload): Promise<DeliveryReportResponse> => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/deliveryreport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to get delivery report');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting delivery report:', error);
      toast.error(`Failed to get delivery report: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const querySubAccounts = async () => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/subusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify({
          username: credentials.username
        })
      });

      if (!response.ok) {
        throw new Error('Failed to query sub-accounts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error querying sub-accounts:', error);
      toast.error(`Failed to query sub-accounts: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const queryResellerClients = async () => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/resellerclients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify({
          username: credentials.username
        })
      });

      if (!response.ok) {
        throw new Error('Failed to query reseller clients');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error querying reseller clients:', error);
      toast.error(`Failed to query reseller clients: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const topUpSubAccount = async (payload: SubAccountPayload) => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/subacctopup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to top up sub-account');
      }

      const data = await response.json();
      toast.success('Sub-account topped up successfully');
      return data;
    } catch (error) {
      console.error('Error topping up sub-account:', error);
      toast.error(`Failed to top up sub-account: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const topUpResellerClient = async (payload: SubAccountPayload) => {
    setIsLoading(true);
    try {
      const credentials = await getApiCredentials();
      
      const response = await fetch('https://api.mspace.co.ke/smsapi/v2/resellerclienttopup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'apikey': credentials.api_key
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to top up reseller client');
      }

      const data = await response.json();
      toast.success('Reseller client topped up successfully');
      return data;
    } catch (error) {
      console.error('Error topping up reseller client:', error);
      toast.error(`Failed to top up reseller client: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendSMS,
    checkBalance,
    getDeliveryReport,
    querySubAccounts,
    queryResellerClients,
    topUpSubAccount,
    topUpResellerClient,
    isLoading
  };
};
