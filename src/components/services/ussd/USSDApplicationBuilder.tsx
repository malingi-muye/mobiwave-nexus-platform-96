
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Phone } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { USSDMenuBuilder } from './USSDMenuBuilder';
import { USSDApplicationCard } from './USSDApplicationCard';

interface MenuNode {
  id: string;
  text: string;
  options: { key: string; text: string; nextNodeId?: string }[];
  isEndNode: boolean;
  response?: string;
}

type USSDApplicationFromDB = Tables<'mspace_ussd_applications'>;

interface USSDApplication {
  id: string;
  service_code: string;
  menu_structure: MenuNode[];
  callback_url: string;
  status: string;
}

const fetchUSSDApplications = async (): Promise<USSDApplication[]> => {
  const { data, error } = await supabase
    .from('mspace_ussd_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map((item: USSDApplicationFromDB) => ({
    id: item.id,
    service_code: item.service_code,
    menu_structure: Array.isArray(item.menu_structure) ? item.menu_structure as unknown as MenuNode[] : [],
    callback_url: item.callback_url,
    status: item.status || 'pending'
  }));
};

export function USSDApplicationBuilder() {
  const [isCreating, setIsCreating] = useState(false);
  const [serviceCode, setServiceCode] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [menuNodes, setMenuNodes] = useState<MenuNode[]>([
    {
      id: 'root',
      text: 'Welcome to our service. Please select an option:',
      options: [
        { key: '1', text: 'Option 1', nextNodeId: undefined },
        { key: '2', text: 'Option 2', nextNodeId: undefined }
      ],
      isEndNode: false
    }
  ]);

  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['ussd-applications'],
    queryFn: fetchUSSDApplications
  });

  const createApplication = useMutation({
    mutationFn: async (appData: { service_code: string; menu_structure: MenuNode[]; callback_url: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: subscription } = await supabase
        .from('user_service_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('service_id', (await supabase
          .from('services_catalog')
          .select('id')
          .eq('service_type', 'ussd')
          .single()).data?.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        throw new Error('You need an active USSD service subscription to create applications');
      }

      const { data, error } = await supabase
        .from('mspace_ussd_applications')
        .insert({
          subscription_id: subscription.id,
          service_code: appData.service_code,
          menu_structure: appData.menu_structure as unknown as any,
          callback_url: appData.callback_url,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ussd-applications'] });
      toast.success('USSD application created successfully');
      setIsCreating(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create application: ${error.message}`);
    }
  });

  const resetForm = () => {
    setServiceCode('');
    setCallbackUrl('');
    setMenuNodes([{
      id: 'root',
      text: 'Welcome to our service. Please select an option:',
      options: [
        { key: '1', text: 'Option 1', nextNodeId: undefined },
        { key: '2', text: 'Option 2', nextNodeId: undefined }
      ],
      isEndNode: false
    }]);
  };

  const handleSubmit = () => {
    if (!serviceCode || !callbackUrl || menuNodes.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    createApplication.mutate({
      service_code: serviceCode,
      menu_structure: menuNodes,
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
          <h2 className="text-3xl font-bold tracking-tight">USSD Applications</h2>
          <p className="text-gray-600">
            Create and manage your USSD applications with visual menu builders.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Application
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Create USSD Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceCode">Service Code *</Label>
                <Input
                  id="serviceCode"
                  placeholder="e.g., *123#"
                  value={serviceCode}
                  onChange={(e) => setServiceCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="callbackUrl">Callback URL *</Label>
                <Input
                  id="callbackUrl"
                  placeholder="https://your-app.com/ussd/callback"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                />
              </div>
            </div>

            <USSDMenuBuilder 
              menuNodes={menuNodes} 
              setMenuNodes={setMenuNodes} 
            />

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={createApplication.isPending}>
                {createApplication.isPending ? 'Creating...' : 'Create Application'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <USSDApplicationCard key={app.id} application={app} />
        ))}
      </div>

      {applications.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <Phone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No USSD Applications</h3>
            <p className="text-gray-600 mb-4">
              Create your first USSD application to start building interactive menus.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
