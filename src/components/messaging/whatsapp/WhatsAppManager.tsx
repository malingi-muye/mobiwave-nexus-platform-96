
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle, Users, Image, FileText } from "lucide-react";
import { toast } from "sonner";

interface WhatsAppCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  created_at: string;
  scheduled_at?: string;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  media_type?: 'image' | 'document' | 'video';
  media_url?: string;
  variables: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export function WhatsAppManager() {
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([
    {
      id: '1',
      name: 'Product Launch Announcement',
      status: 'completed',
      recipients: 1500,
      sent: 1500,
      delivered: 1485,
      read: 1420,
      replied: 89,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Customer Survey',
      status: 'sending',
      recipients: 800,
      sent: 600,
      delivered: 580,
      read: 520,
      replied: 45,
      created_at: '2024-01-16T14:30:00Z'
    }
  ]);

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome to {{company_name}}! We\'re excited to have you on board.',
      variables: ['company_name'],
      status: 'approved'
    },
    {
      id: '2',
      name: 'Order Confirmation',
      content: 'Your order #{{order_id}} has been confirmed. Total: {{amount}}',
      variables: ['order_id', 'amount'],
      status: 'approved'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template_id: '',
    recipients: '',
    schedule_time: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    media_type: '',
    media_url: ''
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.template_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const campaign: WhatsAppCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      status: newCampaign.schedule_time ? 'scheduled' : 'draft',
      recipients: parseInt(newCampaign.recipients) || 0,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      created_at: new Date().toISOString(),
      scheduled_at: newCampaign.schedule_time || undefined
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({ name: '', template_id: '', recipients: '', schedule_time: '' });
    toast.success('WhatsApp campaign created successfully');
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast.error('Please fill in template name and content');
      return;
    }

    const template: WhatsAppTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      content: newTemplate.content,
      media_type: newTemplate.media_type as 'image' | 'document' | 'video' | undefined,
      media_url: newTemplate.media_url || undefined,
      variables: extractVariables(newTemplate.content),
      status: 'pending'
    };

    setTemplates([template, ...templates]);
    setNewTemplate({ name: '', content: '', media_type: '', media_url: '' });
    toast.success('Template submitted for approval');
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateEngagementRate = (campaign: WhatsAppCampaign) => {
    return campaign.sent > 0 ? ((campaign.replied / campaign.sent) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Campaigns</h1>
          <p className="text-gray-600">Manage your WhatsApp Business messaging campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-600">WhatsApp Business Connected</span>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.sent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.delivered, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.read, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replies</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.replied, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Campaigns</CardTitle>
              <CardDescription>
                View and manage your WhatsApp messaging campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Recipients</p>
                        <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="font-semibold">{campaign.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Read</p>
                        <p className="font-semibold">{campaign.read.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="font-semibold">{calculateEngagementRate(campaign)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>
                  Approved templates for WhatsApp campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.content}</p>
                      {template.variables.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Template</CardTitle>
                <CardDescription>
                  Create a new message template for approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Welcome Message"
                  />
                </div>

                <div>
                  <Label htmlFor="template-content">Message Content</Label>
                  <Textarea
                    id="template-content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    placeholder="Use {{variable_name}} for dynamic content"
                    rows={4}
                  />
                </div>

                <Button onClick={handleCreateTemplate} className="w-full">
                  Submit for Approval
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create WhatsApp Campaign</CardTitle>
              <CardDescription>
                Create a new WhatsApp messaging campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="e.g., Product Launch Campaign"
                  />
                </div>

                <div>
                  <Label htmlFor="template-select">Message Template</Label>
                  <select
                    id="template-select"
                    className="w-full p-2 border rounded-md"
                    value={newCampaign.template_id}
                    onChange={(e) => setNewCampaign({ ...newCampaign, template_id: e.target.value })}
                  >
                    <option value="">Select a template</option>
                    {templates.filter(t => t.status === 'approved').map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="recipients-count">Number of Recipients</Label>
                  <Input
                    id="recipients-count"
                    type="number"
                    value={newCampaign.recipients}
                    onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <Label htmlFor="schedule-time">Schedule Time (Optional)</Label>
                  <Input
                    id="schedule-time"
                    type="datetime-local"
                    value={newCampaign.schedule_time}
                    onChange={(e) => setNewCampaign({ ...newCampaign, schedule_time: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleCreateCampaign} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
