
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Edit, Trash2, Copy, Star, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  isFavorite: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}

const TEMPLATE_CATEGORIES = [
  'Marketing',
  'Promotional',
  'Transactional',
  'Appointment',
  'Reminder',
  'Welcome',
  'Other'
];

const COMMON_VARIABLES = [
  '{firstName}',
  '{lastName}',
  '{fullName}',
  '{phone}',
  '{email}',
  '{company}',
  '{date}',
  '{time}',
  '{amount}',
  '{code}'
];

export function TemplateManager() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome to our service, {firstName}! We\'re excited to have you on board. Reply STOP to opt out.',
      category: 'Welcome',
      variables: ['{firstName}'],
      isFavorite: true,
      useCount: 25,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      content: 'Hi {firstName}, this is a reminder of your appointment on {date} at {time}. Please confirm by replying YES.',
      category: 'Appointment',
      variables: ['{firstName}', '{date}', '{time}'],
      isFavorite: false,
      useCount: 12,
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: '',
    variables: [] as string[]
  });

  const detectVariables = (content: string): string[] => {
    const matches = content.match(/{[^}]+}/g) || [];
    return Array.from(new Set(matches));
  };

  const addTemplate = () => {
    if (!newTemplate.name || !newTemplate.content || !newTemplate.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const template: MessageTemplate = {
      id: `template-${Date.now()}`,
      ...newTemplate,
      variables: detectVariables(newTemplate.content),
      isFavorite: false,
      useCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', content: '', category: '', variables: [] });
    setShowAddTemplate(false);
    toast.success('Template created successfully');
  };

  const updateTemplate = () => {
    if (!editingTemplate || !editingTemplate.name || !editingTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setTemplates(prev => prev.map(t => 
      t.id === editingTemplate.id 
        ? { 
            ...editingTemplate, 
            variables: detectVariables(editingTemplate.content),
            updatedAt: new Date().toISOString() 
          }
        : t
    ));
    setEditingTemplate(null);
    toast.success('Template updated successfully');
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success('Template deleted');
  };

  const duplicateTemplate = (template: MessageTemplate) => {
    const duplicate: MessageTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      useCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTemplates(prev => [...prev, duplicate]);
    toast.success('Template duplicated');
  };

  const toggleFavorite = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const insertVariable = (variable: string, isEditing: boolean = false) => {
    if (isEditing && editingTemplate) {
      setEditingTemplate(prev => prev ? {
        ...prev,
        content: prev.content + variable
      } : null);
    } else {
      setNewTemplate(prev => ({
        ...prev,
        content: prev.content + variable
      }));
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.useCount - a.useCount;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-600">Create and manage reusable message templates</p>
        </div>
        <Dialog open={showAddTemplate} onOpenChange={setShowAddTemplate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a reusable message template with variables
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="templateName">Template Name *</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="templateCategory">Category *</Label>
                  <Select 
                    value={newTemplate.category} 
                    onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="templateContent">Message Content *</Label>
                <Textarea
                  id="templateContent"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your message template..."
                  className="min-h-[120px]"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Variables detected: {detectVariables(newTemplate.content).join(', ') || 'None'}
                </div>
              </div>

              <div>
                <Label>Common Variables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMMON_VARIABLES.map(variable => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => insertVariable(variable)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={addTemplate} className="w-full">
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                {templates.length} templates available
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {TEMPLATE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedTemplates.map(template => (
                <Card key={template.id} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{template.category}</Badge>
                          <span className="text-xs text-gray-500">Used {template.useCount} times</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(template.id)}
                        >
                          <Star className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {template.content}
                    </p>
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
              <p className="text-sm text-gray-400">Create a template or adjust your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your message template
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editTemplateName">Template Name *</Label>
                  <Input
                    id="editTemplateName"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="editTemplateCategory">Category *</Label>
                  <Select 
                    value={editingTemplate.category} 
                    onValueChange={(value) => setEditingTemplate(prev => prev ? { ...prev, category: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="editTemplateContent">Message Content *</Label>
                <Textarea
                  id="editTemplateContent"
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, content: e.target.value } : null)}
                  placeholder="Enter your message template..."
                  className="min-h-[120px]"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Variables detected: {detectVariables(editingTemplate.content).join(', ') || 'None'}
                </div>
              </div>

              <div>
                <Label>Common Variables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMMON_VARIABLES.map(variable => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => insertVariable(variable, true)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={updateTemplate} className="w-full">
                Update Template
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
