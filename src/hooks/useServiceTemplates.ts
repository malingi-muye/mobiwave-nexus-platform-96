
import { useState } from 'react';
import { toast } from 'sonner';

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  service_type: string;
  template_config: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useServiceTemplates = () => {
  const [templates, setTemplates] = useState<ServiceTemplate[]>([
    {
      id: '1',
      name: 'Basic SMS Template',
      description: 'Standard SMS service configuration',
      service_type: 'sms',
      template_config: {
        monthly_fee: 5000,
        setup_fee: 2000,
        transaction_fee_type: 'fixed',
        transaction_fee_amount: 1
      },
      is_default: true,
      created_at: '2024-06-01',
      updated_at: '2024-06-01'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);

  const createTemplate = async (templateData: any) => {
    try {
      const newTemplate: ServiceTemplate = {
        id: Date.now().toString(),
        ...templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      setIsCreating(false);
      toast.success('Template created successfully');
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const duplicateTemplate = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        const duplicated: ServiceTemplate = {
          ...template,
          id: Date.now().toString(),
          name: `${template.name} (Copy)`,
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTemplates(prev => [...prev, duplicated]);
        toast.success('Template duplicated successfully');
      }
    } catch (error) {
      toast.error('Failed to duplicate template');
    }
  };

  return {
    templates,
    isCreating,
    setIsCreating,
    createTemplate,
    deleteTemplate,
    duplicateTemplate
  };
};
