
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWhatsAppTemplates } from '@/hooks/useWhatsAppSubscriptions';
import { FileText, Plus, MessageSquare, Calendar } from 'lucide-react';

interface WhatsAppTemplateManagerProps {
  subscriptionId: string;
}

export function WhatsAppTemplateManager({ subscriptionId }: WhatsAppTemplateManagerProps) {
  const { templates, isLoading, createTemplate, isCreating } = useWhatsAppTemplates(subscriptionId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'marketing',
    language: 'en',
    header_text: '',
    body_text: '',
    footer_text: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTemplate(formData);
      setFormData({
        name: '',
        category: 'marketing',
        language: 'en',
        header_text: '',
        body_text: '',
        footer_text: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Message Templates
          </h3>
          <p className="text-sm text-gray-600">
            Create and manage WhatsApp message templates for your campaigns.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>
              Design a message template that will be submitted to WhatsApp for approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="my_template_name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="header_text">Header Text (Optional)</Label>
                <Input
                  id="header_text"
                  value={formData.header_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, header_text: e.target.value }))}
                  placeholder="Welcome to our service!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_text">Body Text</Label>
                <Textarea
                  id="body_text"
                  value={formData.body_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_text: e.target.value }))}
                  placeholder="Hello {{1}}, your order {{2}} has been confirmed."
                  className="min-h-[100px]"
                  required
                />
                <p className="text-xs text-gray-500">
                  Use {`{{1}}`}, {`{{2}}`}, etc. for dynamic variables
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text (Optional)</Label>
                <Input
                  id="footer_text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                  placeholder="Thank you for choosing us!"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Template'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">No Templates Yet</h4>
              <p className="text-gray-600 mb-4">
                Create your first message template to start sending WhatsApp messages.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell className="capitalize">{template.category}</TableCell>
                    <TableCell>{template.language.toUpperCase()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(template.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
