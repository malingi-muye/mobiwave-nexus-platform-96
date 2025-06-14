import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, GripVertical, Trash2, Eye, Send, FileText, BarChart3, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  status: 'draft' | 'active' | 'closed';
  responses: number;
  created_at: string;
}

export function SurveyBuilder() {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Help us improve our services',
      fields: [],
      status: 'active',
      responses: 156,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'Product Feedback Form',
      description: 'Share your thoughts on our new product',
      fields: [],
      status: 'draft',
      responses: 0,
      created_at: '2024-01-18'
    }
  ]);

  const [currentSurvey, setCurrentSurvey] = useState<Partial<Survey>>({
    title: '',
    description: '',
    fields: []
  });

  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false
  });

  const [showLogicBuilder, setShowLogicBuilder] = useState(false);
  const [conditionalRules, setConditionalRules] = useState([]);
  const [validationRules, setValidationRules] = useState([]);

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'rating', label: 'Rating Scale' }
  ];

  const addField = () => {
    if (!newField.label) {
      toast.error('Please enter a field label');
      return;
    }

    const field: FormField = {
      id: Date.now().toString(),
      type: newField.type as FormField['type'],
      label: newField.label,
      required: newField.required || false,
      options: newField.options || [],
      placeholder: newField.placeholder || ''
    };

    setCurrentSurvey({
      ...currentSurvey,
      fields: [...(currentSurvey.fields || []), field]
    });

    setNewField({ type: 'text', label: '', required: false });
    toast.success('Field added successfully');
  };

  const removeField = (fieldId: string) => {
    setCurrentSurvey({
      ...currentSurvey,
      fields: currentSurvey.fields?.filter(f => f.id !== fieldId) || []
    });
  };

  const saveSurvey = () => {
    if (!currentSurvey.title) {
      toast.error('Please enter a survey title');
      return;
    }

    const survey: Survey = {
      id: Date.now().toString(),
      title: currentSurvey.title,
      description: currentSurvey.description || '',
      fields: currentSurvey.fields || [],
      status: 'draft',
      responses: 0,
      created_at: new Date().toISOString().split('T')[0]
    };

    setSurveys([...surveys, survey]);
    setCurrentSurvey({ title: '', description: '', fields: [] });
    setConditionalRules([]);
    setValidationRules([]);
    toast.success('Survey saved successfully with advanced logic');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Advanced Survey & Forms Builder</h2>
        <p className="text-gray-600">Create intelligent forms with conditional logic and advanced validation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Create New Survey
            </CardTitle>
            <CardDescription>
              Build your survey with drag-and-drop form fields and advanced logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Survey Title</Label>
                <Input
                  id="title"
                  value={currentSurvey.title || ''}
                  onChange={(e) => setCurrentSurvey({...currentSurvey, title: e.target.value})}
                  placeholder="Enter survey title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentSurvey.description || ''}
                  onChange={(e) => setCurrentSurvey({...currentSurvey, description: e.target.value})}
                  placeholder="Enter survey description"
                  rows={3}
                />
              </div>
            </div>

            {/* Add Field */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Add New Field</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select 
                    value={newField.type} 
                    onValueChange={(value) => setNewField({...newField, type: value as FormField['type']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fieldLabel">Field Label</Label>
                  <Input
                    id="fieldLabel"
                    value={newField.label || ''}
                    onChange={(e) => setNewField({...newField, label: e.target.value})}
                    placeholder="Enter field label"
                  />
                </div>
              </div>
              <Button onClick={addField} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>

            {/* Field List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Form Fields</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLogicBuilder(!showLogicBuilder)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Advanced Logic
                </Button>
              </div>
              <div className="space-y-2">
                {currentSurvey.fields?.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 border rounded">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{field.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {showLogicBuilder && currentSurvey.fields && currentSurvey.fields.length > 0 && (
              <ConditionalLogicBuilder
                fields={currentSurvey.fields}
                onRulesChange={setConditionalRules}
                onValidationChange={setValidationRules}
              />
            )}

            <div className="flex gap-2">
              <Button onClick={saveSurvey}>Save Survey</Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Survey List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Surveys
            </CardTitle>
            <CardDescription>
              Manage and track your intelligent surveys and forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{survey.title}</h3>
                      <p className="text-sm text-gray-600">{survey.description}</p>
                    </div>
                    <Badge className={getStatusColor(survey.status)}>
                      {survey.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{survey.responses}</span> responses • 
                      Created {survey.created_at}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
