
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Image, File, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  content: string;
}

interface WhatsAppCampaign {
  id: string;
  name: string;
  template_id: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export function WhatsAppManager() {
  const [activeTab, setActiveTab] = useState('templates');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'utility' as const,
    content: '',
    language: 'en'
  });

  const templates: WhatsAppTemplate[] = [
    {
      id: '1',
      name: 'Order Confirmation',
      category: 'utility',
      language: 'en',
      status: 'approved',
      content: 'Your order {{1}} has been confirmed. Total: {{2}}. Expected delivery: {{3}}'
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      category: 'utility',
      language: 'en',
      status: 'approved',
      content: 'Hi {{1}}, this is a reminder for your appointment on {{2}} at {{3}}'
    },
    {
      id: '3',
      name: 'Promotional Offer',
      category: 'marketing',
      language: 'en',
      status: 'pending',
      content: 'Special offer! Get {{1}}% off on all products. Use code: {{2}}. Valid until {{3}}'
    }
  ];

  const campaigns: WhatsAppCampaign[] = [
    {
      id: '1',
      name: 'Order Confirmations',
      template_id: '1',
      status: 'completed',
      recipients: 1500,
      sent: 1500,
      delivered: 1485,
      read: 1420,
      failed: 15
    },
    {
      id: '2',
      name: 'Appointment Reminders',
      template_id: '2',
      status: 'active',
      recipients: 800,
      sent: 650,
      delivered: 640,
      read: 580,
      failed: 10
    }
  ];

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('WhatsApp template created and submitted for approval');
    setNewTemplate({ name: '', category: 'utility', content: '', language: 'en' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">WhatsApp Business Manager</h2>
        <p className="text-gray-600">Manage WhatsApp Business API templates and campaigns</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message Templates
              </CardTitle>
              <CardDescription>
                Manage approved WhatsApp Business message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.category} • {template.language}</p>
                      </div>
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-sm font-mono">{template.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Preview</Button>
                      {template.status === 'approved' && (
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Create a new WhatsApp Business message template for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="e.g., order_confirmation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as any})}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="utility">Utility</option>
                    <option value="marketing">Marketing</option>
                    <option value="authentication">Authentication</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  placeholder="Use {{1}}, {{2}}, etc. for dynamic variables"
                  rows={6}
                />
                <p className="text-sm text-gray-500">
                  Use {{1}}, {{2}}, etc. for dynamic variables. Templates must be approved by WhatsApp.
                </p>
              </div>

              <Button onClick={handleCreateTemplate}>
                Submit for Approval
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Campaigns</CardTitle>
              <CardDescription>
                Monitor active and completed WhatsApp campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          Template: {templates.find(t => t.id === campaign.template_id)?.name}
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{campaign.recipients}</p>
                        <p className="text-sm text-gray-600">Recipients</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{campaign.sent}</p>
                        <p className="text-sm text-gray-600">Sent</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{campaign.delivered}</p>
                        <p className="text-sm text-gray-600">Delivered</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">{campaign.read}</p>
                        <p className="text-sm text-gray-600">Read</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{campaign.failed}</p>
                        <p className="text-sm text-gray-600">Failed</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Delivery Rate: {((campaign.delivered / campaign.sent) * 100).toFixed(1)}% • 
                        Read Rate: {((campaign.read / campaign.delivered) * 100).toFixed(1)}%
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Media Library
              </CardTitle>
              <CardDescription>
                Manage images, documents, and other media for WhatsApp messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Upload Image</p>
                  <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <File className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Upload Document</p>
                  <p className="text-xs text-gray-500">PDF, DOC up to 100MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
