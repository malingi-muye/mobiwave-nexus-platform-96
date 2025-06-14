
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SubAccountPayload {
  clientname: string;
  noOfSms: number;
}

export const useMspaceAccounts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const querySubAccounts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mspace-accounts', {
        body: { operation: 'subAccounts' }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error: any) {
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
      const { data, error } = await supabase.functions.invoke('mspace-accounts', {
        body: { operation: 'resellerClients' }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error: any) {
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
      const { data, error } = await supabase.functions.invoke('mspace-accounts', {
        body: {
          operation: 'topUpSubAccount',
          clientname: payload.clientname,
          noOfSms: payload.noOfSms
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Sub-account topped up successfully');
      return data;
    } catch (error: any) {
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
      const { data, error } = await supabase.functions.invoke('mspace-accounts', {
        body: {
          operation: 'topUpResellerClient',
          clientname: payload.clientname,
          noOfSms: payload.noOfSms
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Reseller client topped up successfully');
      return data;
    } catch (error: any) {
      console.error('Error topping up reseller client:', error);
      toast.error(`Failed to top up reseller client: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    querySubAccounts,
    queryResellerClients,
    topUpSubAccount,
    topUpResellerClient,
    isLoading
  };
};
