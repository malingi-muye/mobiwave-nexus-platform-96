
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Phone, ArrowRight } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface MenuNode {
  id: string;
  text: string;
  options: { key: string; text: string; nextNodeId?: string }[];
  isEndNode: boolean;
  response?: string;
}

// Use the database type directly
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
  
  // Convert the database records to our interface
  return (data || []).map((item: USSDApplicationFromDB) => ({
    id: item.id,
    service_code: item.service_code,
    menu_structure: Array.isArray(item.menu_structure) ? item.menu_structure as MenuNode[] : [],
    callback_url: item.callback_url,
    status: item.status || 'pending'
  }));
};

export function USSDApplicationBuilder() {
  const [selectedApp, setSelectedApp] = useState<USSDApplication | null>(null);
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

      // First, check if we have a subscription for USSD service
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
          menu_structure: appData.menu_structure as any, // Cast to Json type
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

  const addMenuNode = () => {
    const newNode: MenuNode = {
      id: `node_${Date.now()}`,
      text: 'New menu text',
      options: [{ key: '1', text: 'Option 1', nextNodeId: undefined }],
      isEndNode: false
    };
    setMenuNodes([...menuNodes, newNode]);
  };

  const updateMenuNode = (nodeId: string, updates: Partial<MenuNode>) => {
    setMenuNodes(nodes => 
      nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const addOption = (nodeId: string) => {
    const node = menuNodes.find(n => n.id === nodeId);
    if (node) {
      const newOptionKey = (node.options.length + 1).toString();
      updateMenuNode(nodeId, {
        options: [...node.options, { key: newOptionKey, text: `Option ${newOptionKey}`, nextNodeId: undefined }]
      });
    }
  };

  const removeOption = (nodeId: string, optionKey: string) => {
    const node = menuNodes.find(n => n.id === nodeId);
    if (node) {
      updateMenuNode(nodeId, {
        options: node.options.filter(opt => opt.key !== optionKey)
      });
    }
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

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Menu Structure</Label>
                <Button size="sm" onClick={addMenuNode} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu
                </Button>
              </div>

              <div className="space-y-4">
                {menuNodes.map((node, index) => (
                  <Card key={node.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{node.id === 'root' ? 'Root Menu' : `Menu ${index}`}</Badge>
                          {node.id !== 'root' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setMenuNodes(nodes => nodes.filter(n => n.id !== node.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <Label>Menu Text</Label>
                          <Textarea
                            value={node.text}
                            onChange={(e) => updateMenuNode(node.id, { text: e.target.value })}
                            placeholder="Enter the text users will see"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Options</Label>
                            <Button size="sm" onClick={() => addOption(node.id)} variant="outline">
                              <Plus className="w-3 h-3 mr-1" />
                              Add Option
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {node.options.map((option) => (
                              <div key={option.key} className="flex items-center gap-2 p-2 border rounded">
                                <Input
                                  className="w-16"
                                  value={option.key}
                                  onChange={(e) => {
                                    const updatedOptions = node.options.map(opt =>
                                      opt.key === option.key ? { ...opt, key: e.target.value } : opt
                                    );
                                    updateMenuNode(node.id, { options: updatedOptions });
                                  }}
                                />
                                <Input
                                  className="flex-1"
                                  value={option.text}
                                  onChange={(e) => {
                                    const updatedOptions = node.options.map(opt =>
                                      opt.key === option.key ? { ...opt, text: e.target.value } : opt
                                    );
                                    updateMenuNode(node.id, { options: updatedOptions });
                                  }}
                                  placeholder="Option text"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeOption(node.id, option.key)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

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
          <Card key={app.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {app.service_code}
                </span>
                <Badge 
                  variant={app.status === 'active' ? 'default' : 'secondary'}
                  className={app.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {app.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Callback URL:</p>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded truncate">
                    {app.callback_url}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Menu Nodes:</p>
                  <p className="text-sm">{app.menu_structure.length} menus configured</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
