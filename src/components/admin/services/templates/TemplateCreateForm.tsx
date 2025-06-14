
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateCreateFormProps {
  serviceTypes: string[];
  onSubmit: (templateData: any) => boolean;
  onCancel: () => void;
}

export function TemplateCreateForm({ serviceTypes, onSubmit, onCancel }: TemplateCreateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    service_type: '',
    description: '',
    configuration: {}
  });

  const handleSubmit = () => {
    const success = onSubmit(formData);
    if (success) {
      setFormData({ name: '', service_type: '', description: '', configuration: {} });
      onCancel();
    }
  };

  const handleConfigurationChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData(prev => ({ ...prev, configuration: parsed }));
    } catch {
      // Invalid JSON, ignore
    }
  };

  return (
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
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="service-type">Service Type</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
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
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="template-config">Configuration (JSON)</Label>
          <Textarea
            id="template-config"
            placeholder="Enter template configuration..."
            value={JSON.stringify(formData.configuration, null, 2)}
            onChange={(e) => handleConfigurationChange(e.target.value)}
            rows={8}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
