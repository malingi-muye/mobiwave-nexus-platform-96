
import { useState } from 'react';
import { toast } from 'sonner';
import { useMspaceCredentials } from './useMspaceCredentials';

interface SubAccountPayload {
  username: string;
  clientname: string;
  noOfSms: number;
}

export const useMspaceAccounts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getApiCredentials } = useMspaceCredentials();

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

      return await response.json();
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

      return await response.json();
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
