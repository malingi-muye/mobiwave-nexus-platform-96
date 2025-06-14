
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceCatalog {
  id: string;
  service_name: string;
  service_type: string;
  description: string;
  setup_fee: number;
  monthly_fee: number;
  transaction_fee_type: string;
  transaction_fee_amount: number;
  is_premium: boolean;
  is_active: boolean;
  provider: string;
}

interface ServiceTemplate {
  id: string;
  name: string;
  service_type: string;
  description: string;
  configuration: any;
  is_default: boolean;
  created_at: string;
}

interface ServiceTemplateManagerProps {
  services: ServiceCatalog[];
}

export function ServiceTemplateManager({ services }: ServiceTemplateManagerProps) {
  const [templates, setTemplates] = useState<ServiceTemplate[]>([
    {
      id: '1',
      name: 'Basic USSD Menu',
      service_type: 'ussd',
      description: 'Simple welcome menu with balance check and airtime purchase',
      configuration: {
        serviceCode: '*123#',
        network: 'safaricom',
        welcomeMessage: 'Welcome to our service',
        menuStructure: {
          '1': { text: 'Check Balance', action: 'check_balance' },
          '2': { text: 'Buy Airtime', action: 'buy_airtime' }
        }
      },
      is_default: true,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Standard M-Pesa Integration',
      service_type: 'mpesa',
      description: 'Basic M-Pesa configuration for payments',
      configuration: {
        responseType: 'json',
        autoReconciliation: true,
        minimumAmount: 10,
        maximumAmount: 70000
      },
      is_default: true,
      created_at: '2024-01-15'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ServiceTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    service_type: '',
    description: '',
    configuration: {}
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.service_type) {
      toast.error('Please fill in template name and service type');
      return;
    }

    const template: ServiceTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      service_type: newTemplate.service_type,
      description: newTemplate.description,
      configuration: newTemplate.configuration,
      is_default: false,
      created_at: new Date().toISOString().split('T')[0]
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', service_type: '', description: '', configuration: {} });
    setIsCreating(false);
    toast.success('Template created successfully');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const handleDuplicateTemplate = (template: ServiceTemplate) => {
    const duplicated: ServiceTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      is_default: false,
      created_at: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, duplicated]);
    toast.success('Template duplicated successfully');
  };

  const serviceTypes = [...new Set(services.map(s => s.service_type))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Configuration Templates</h3>
          <p className="text-gray-600">Manage reusable service configuration templates</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="service-type">Service Type</Label>
                <Select
                  value={newTemplate.service_type}
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                placeholder="Describe this template..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="template-config">Configuration (JSON)</Label>
              <Textarea
                id="template-config"
                placeholder="Enter template configuration..."
                value={JSON.stringify(newTemplate.configuration, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewTemplate(prev => ({ ...prev, configuration: parsed }));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={8}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {template.is_default && <Badge variant="secondary">Default</Badge>}
                  <Badge variant="outline">{template.service_type.toUpperCase()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="text-xs text-gray-500 mb-4">
                Created: {template.created_at}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                {!template.is_default && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
