
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMspaceBalance } from './mspace/useMspaceBalance';
import { useMspaceDelivery } from './mspace/useMspaceDelivery';
import { useMspaceAccounts } from './mspace/useMspaceAccounts';
import { useMspaceReliability } from './mspace/useMspaceReliability';
import { useMspaceConnection } from './mspace/useMspaceConnection';

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
  const { executeWithRetry, batchValidatePhones } = useMspaceReliability();
  const connection = useMspaceConnection();

  const sendSMS = async (payload: SMSPayload) => {
    setIsLoading(true);
    
    try {
      // Pre-validate all phone numbers
      const { valid: validRecipients, invalid: invalidRecipients } = batchValidatePhones(payload.recipients);
      
      if (invalidRecipients.length > 0) {
        console.warn('Invalid recipients detected:', invalidRecipients);
        toast.warning(`${invalidRecipients.length} invalid phone numbers were skipped`);
      }

      if (validRecipients.length === 0) {
        throw new Error('No valid recipients found');
      }

      // Check connection health before sending
      if (!connection.isHealthy) {
        await connection.checkConnection();
        if (!connection.isHealthy) {
          throw new Error('Mspace API connection is not healthy. Please check your settings.');
        }
      }

      const result = await executeWithRetry(
        async () => {
          const { data, error } = await supabase.functions.invoke('mspace-sms', {
            body: {
              recipients: validRecipients,
              message: payload.message,
              senderId: payload.senderId,
              campaignId: payload.campaignId
            }
          });

          if (error) {
            throw new Error(error.message);
          }

          return data;
        },
        'SMS sending',
        { maxRetries: 2, baseDelay: 2000 }
      );

      // Show detailed results
      if (result?.summary) {
        const { successful, failed, total } = result.summary;
        if (successful > 0 && failed === 0) {
          toast.success(`All ${successful} SMS sent successfully`);
        } else if (successful > 0 && failed > 0) {
          toast.warning(`${successful}/${total} SMS sent successfully, ${failed} failed`);
        } else {
          toast.error(`All ${failed} SMS failed to send`);
        }
      }

      return result;

    } catch (error: any) {
      console.error('SMS sending failed:', error);
      
      // Don't show toast here as it's handled by the error handler
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Enhanced SMS sending with validation and retry
    sendSMS,
    
    // Connection monitoring
    connectionStatus: connection,
    
    // Balance checking with retry
    checkBalance: balance.checkBalance,
    
    // Delivery reporting with enhanced error handling
    getDeliveryReport: delivery.getDeliveryReport,
    getBatchDeliveryReports: delivery.getBatchDeliveryReports,
    
    // Account management
    querySubAccounts: accounts.querySubAccounts,
    queryResellerClients: accounts.queryResellerClients,
    topUpSubAccount: accounts.topUpSubAccount,
    topUpResellerClient: accounts.topUpResellerClient,
    
    // Loading states
    isLoading: isLoading || balance.isLoading || delivery.isLoading || accounts.isLoading,
    
    // Utility functions
    validatePhoneNumbers: batchValidatePhones
  };
};
