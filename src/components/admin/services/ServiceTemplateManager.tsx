
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useServiceTemplates } from '@/hooks/useServiceTemplates';
import { TemplateCard } from './templates/TemplateCard';
import { TemplateCreateForm } from './templates/TemplateCreateForm';

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

interface ServiceTemplateManagerProps {
  services: ServiceCatalog[];
}

export function ServiceTemplateManager({ services }: ServiceTemplateManagerProps) {
  const {
    templates,
    isCreating,
    setIsCreating,
    createTemplate,
    deleteTemplate,
    duplicateTemplate
  } = useServiceTemplates();
  
  const [editingTemplate, setEditingTemplate] = useState(null);

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
        <TemplateCreateForm
          serviceTypes={serviceTypes}
          onSubmit={createTemplate}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={setEditingTemplate}
            onDuplicate={duplicateTemplate}
            onDelete={deleteTemplate}
          />
        ))}
      </div>
    </div>
  );
}
