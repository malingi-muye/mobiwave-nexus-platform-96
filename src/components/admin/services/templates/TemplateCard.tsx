
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Copy, Trash2 } from 'lucide-react';

interface ServiceTemplate {
  id: string;
  name: string;
  service_type: string;
  description: string;
  configuration: any;
  is_default: boolean;
  created_at: string;
}

interface TemplateCardProps {
  template: ServiceTemplate;
  onEdit: (template: ServiceTemplate) => void;
  onDuplicate: (template: ServiceTemplate) => void;
  onDelete: (templateId: string) => void;
}

export function TemplateCard({ template, onEdit, onDuplicate, onDelete }: TemplateCardProps) {
  return (
    <Card>
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
            onClick={() => onEdit(template)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDuplicate(template)}
          >
            <Copy className="w-3 h-3" />
          </Button>
          {!template.is_default && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
