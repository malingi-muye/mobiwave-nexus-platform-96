import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SubAccountPayload {
  clientname: string;
  noOfSms: number;
}

interface SubUser {
  smsBalance: string;
  subAccUser: string;
}

interface ResellerClientApiResponse {
  clientUserName: string;
  smsBalance: string;
}

interface ResellerClient {
  clientname: string;
  balance: string;
  status?: string;
}

export const useMspaceAccounts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError, handleSuccess, handleRetry } = useErrorHandler();

  const querySubAccounts = async (): Promise<SubUser[]> => {
    setIsLoading(true);
    try {
      const subAccountsOperation = async () => {
        const { data, error } = await supabase.functions.invoke('mspace-accounts', {
          body: { operation: 'subAccounts' }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data || [];
      };

      const result = await handleRetry(subAccountsOperation);
      handleSuccess('Sub-accounts retrieved successfully');
      return result;
    } catch (error: any) {
      handleError(error, {
        operation: 'Query Sub-Accounts',
        shouldRetry: true,
        retryFn: () => querySubAccounts()
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const queryResellerClients = async (): Promise<ResellerClient[]> => {
    setIsLoading(true);
    try {
      const resellerClientsOperation = async () => {
        const { data, error } = await supabase.functions.invoke('mspace-accounts', {
          body: { operation: 'resellerClients' }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Map the API response to our expected format
        const apiResponse: ResellerClientApiResponse[] = data || [];
        return apiResponse.map(client => ({
          clientname: client.clientUserName,
          balance: client.smsBalance,
          status: 'active'
        }));
      };

      const result = await handleRetry(resellerClientsOperation);
      handleSuccess('Reseller clients retrieved successfully');
      return result;
    } catch (error: any) {
      handleError(error, {
        operation: 'Query Reseller Clients',
        shouldRetry: true,
        retryFn: () => queryResellerClients()
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const topUpSubAccount = async (payload: SubAccountPayload) => {
    setIsLoading(true);
    try {
      const topUpOperation = async () => {
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
        
        return data;
      };

      const result = await handleRetry(topUpOperation);
      handleSuccess(`Sub-account ${payload.clientname} topped up with ${payload.noOfSms} SMS credits`);
      return result;
    } catch (error: any) {
      handleError(error, {
        operation: 'Top-up Sub-Account',
        details: { clientname: payload.clientname, smsCount: payload.noOfSms },
        shouldRetry: true,
        retryFn: () => topUpSubAccount(payload)
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const topUpResellerClient = async (payload: SubAccountPayload) => {
    setIsLoading(true);
    try {
      const topUpOperation = async () => {
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
        
        return data;
      };

      const result = await handleRetry(topUpOperation);
      handleSuccess(`Reseller client ${payload.clientname} topped up with ${payload.noOfSms} SMS credits`);
      return result;
    } catch (error: any) {
      handleError(error, {
        operation: 'Top-up Reseller Client',
        details: { clientname: payload.clientname, smsCount: payload.noOfSms },
        shouldRetry: true,
        retryFn: () => topUpResellerClient(payload)
      });
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
