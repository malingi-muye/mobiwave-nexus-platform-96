
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ServiceTemplate {
  id: string;
  name: string;
  service_type: string;
  description: string;
  configuration: any;
  is_default: boolean;
  created_at: string;
}

const initialTemplates: ServiceTemplate[] = [
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
];

export function useServiceTemplates() {
  const [templates, setTemplates] = useState<ServiceTemplate[]>(initialTemplates);
  const [isCreating, setIsCreating] = useState(false);

  const createTemplate = useCallback((templateData: Omit<ServiceTemplate, 'id' | 'created_at' | 'is_default'>) => {
    if (!templateData.name || !templateData.service_type) {
      toast.error('Please fill in template name and service type');
      return false;
    }

    const newTemplate: ServiceTemplate = {
      ...templateData,
      id: Date.now().toString(),
      is_default: false,
      created_at: new Date().toISOString().split('T')[0]
    };

    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template created successfully');
    return true;
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully');
  }, []);

  const duplicateTemplate = useCallback((template: ServiceTemplate) => {
    const duplicated: ServiceTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      is_default: false,
      created_at: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, duplicated]);
    toast.success('Template duplicated successfully');
  }, []);

  return {
    templates,
    isCreating,
    setIsCreating,
    createTemplate,
    deleteTemplate,
    duplicateTemplate
  };
}
