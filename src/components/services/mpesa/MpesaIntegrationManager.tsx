
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Wallet } from 'lucide-react';
import { MpesaIntegrationForm } from './MpesaIntegrationForm';
import { MpesaIntegrationCard } from './MpesaIntegrationCard';

interface MpesaIntegration {
  id: string;
  paybill_number: string;
  till_number?: string;
  callback_url: string;
  status: string;
  current_balance: number;
  last_balance_update: string;
}

const fetchMpesaIntegrations = async (): Promise<MpesaIntegration[]> => {
  const { data, error } = await supabase
    .from('mspace_pesa_integrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export function MpesaIntegrationManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [paybillNumber, setPaybillNumber] = useState('');
  const [tillNumber, setTillNumber] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['mpesa-integrations'],
    queryFn: fetchMpesaIntegrations
  });

  const createIntegration = useMutation({
    mutationFn: async (integrationData: {
      paybill_number: string;
      till_number?: string;
      callback_url: string;
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
          .eq('service_type', 'mpesa')
          .single()).data?.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        throw new Error('You need an active M-Pesa service subscription to create integrations');
      }

      const { data, error } = await supabase
        .from('mspace_pesa_integrations')
        .insert({
          subscription_id: subscription.id,
          paybill_number: integrationData.paybill_number,
          till_number: integrationData.till_number || null,
          callback_url: integrationData.callback_url,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mpesa-integrations'] });
      toast.success('M-Pesa integration created successfully');
      setIsCreating(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create integration: ${error.message}`);
    }
  });

  const resetForm = () => {
    setPaybillNumber('');
    setTillNumber('');
    setCallbackUrl('');
  };

  const handleSubmit = () => {
    if (!paybillNumber || !callbackUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    createIntegration.mutate({
      paybill_number: paybillNumber,
      till_number: tillNumber || undefined,
      callback_url: callbackUrl
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">M-Pesa Integration</h2>
          <p className="text-gray-600">
            Configure M-Pesa payment processing for your applications.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Integration
        </Button>
      </div>

      {isCreating && (
        <MpesaIntegrationForm
          paybillNumber={paybillNumber}
          setPaybillNumber={setPaybillNumber}
          tillNumber={tillNumber}
          setTillNumber={setTillNumber}
          callbackUrl={callbackUrl}
          setCallbackUrl={setCallbackUrl}
          onSubmit={handleSubmit}
          onCancel={() => setIsCreating(false)}
          isLoading={createIntegration.isPending}
        />
      )}

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <MpesaIntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>

          {integrations.length === 0 && !isCreating && (
            <Card>
              <CardContent className="text-center py-8">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No M-Pesa Integrations</h3>
                <p className="text-gray-600 mb-4">
                  Set up your first M-Pesa integration to start accepting payments.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Integration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
              <p className="text-gray-600">
                Transaction monitoring will be available once you set up an integration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Payment Analytics</h3>
              <p className="text-gray-600">
                Analytics and insights will be available once you start processing payments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
