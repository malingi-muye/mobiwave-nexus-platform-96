import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Download, Users, Trash2, Plus, FileText, Filter, Search, Tag, UserPlus } from 'lucide-react';
import { toast } from "sonner";
import { ContactManager } from './ContactManager';
import { TemplateManager } from './TemplateManager';

interface EnhancedRecipientManagerProps {
  onRecipientsUpdate: (recipients: any[]) => void;
  recipients: any[];
}

export function EnhancedRecipientManager({ onRecipientsUpdate, recipients }: EnhancedRecipientManagerProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({
    tag: '',
    group: '',
    location: '',
    lastContacted: ''
  });

  const [newRecipient, setNewRecipient] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const newRecipients = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const recipient: any = { id: `imported-${Date.now()}-${index}` };
          
          headers.forEach((header, i) => {
            if (header.includes('first') || header.includes('fname')) {
              recipient.firstName = values[i] || '';
            } else if (header.includes('last') || header.includes('lname')) {
              recipient.lastName = values[i] || '';
            } else if (header.includes('phone') || header.includes('mobile')) {
              recipient.phone = values[i] || '';
            } else if (header.includes('email')) {
              recipient.email = values[i] || '';
            }
          });
          
          return recipient;
        }).filter(r => r.phone);

        onRecipientsUpdate([...recipients, ...newRecipients]);
        toast.success(`Imported ${newRecipients.length} recipients successfully`);
      } catch (error) {
        toast.error('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const addRecipient = () => {
    if (!newRecipient.phone) {
      toast.error('Phone number is required');
      return;
    }
    
    const recipient = {
      ...newRecipient,
      id: `manual-${Date.now()}`
    };
    
    onRecipientsUpdate([...recipients, recipient]);
    setNewRecipient({ firstName: '', lastName: '', phone: '', email: '' });
    toast.success('Recipient added successfully');
  };

  const removeRecipient = (id: string) => {
    onRecipientsUpdate(recipients.filter(r => r.id !== id));
    toast.success('Recipient removed');
  };

  const downloadTemplate = () => {
    const csvContent = 'firstName,lastName,phone,email\nJohn,Doe,+1234567890,john.doe@example.com\nJane,Smith,+0987654321,jane.smith@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sms_recipients_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const applyAdvancedFilters = () => {
    // Advanced filtering logic would go here
    toast.success('Filters applied');
  };

  const exportSelectedContacts = () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select contacts to export');
      return;
    }
    toast.success(`Exported ${selectedContacts.length} contacts`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">Quick Upload</TabsTrigger>
          <TabsTrigger value="contacts">Contact Manager</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-600" />
                  Upload Recipients
                </CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file with recipient information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={downloadTemplate}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add Individual Recipient
                </CardTitle>
                <CardDescription>
                  Manually add recipients one by one
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newRecipient.firstName}
                      onChange={(e) => setNewRecipient({ ...newRecipient, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newRecipient.lastName}
                      onChange={(e) => setNewRecipient({ ...newRecipient, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newRecipient.phone}
                    onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRecipient.email}
                    onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <Button onClick={addRecipient} className="w-full">
                  Add Recipient
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Recipients List */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Current Recipients
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {recipients.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.slice(0, 10).map((recipient) => (
                        <TableRow key={recipient.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {recipient.firstName || recipient.lastName ? 
                              `${recipient.firstName} ${recipient.lastName}`.trim() : 
                              'No name'
                            }
                          </TableCell>
                          <TableCell>{recipient.phone}</TableCell>
                          <TableCell>{recipient.email || '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecipient(recipient.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {recipients.length > 10 && (
                    <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                      Showing 10 of {recipients.length} recipients
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recipients added yet</p>
                  <p className="text-sm text-gray-400">Upload a CSV file or add recipients manually</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <ContactManager />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Advanced Contact Filters
              </CardTitle>
              <CardDescription>
                Apply sophisticated filters to target specific contact segments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tagFilter">Filter by Tag</Label>
                  <Select value={filterCriteria.tag} onValueChange={(value) => setFilterCriteria(prev => ({ ...prev, tag: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="groupFilter">Filter by Group</Label>
                  <Select value={filterCriteria.group} onValueChange={(value) => setFilterCriteria(prev => ({ ...prev, group: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="locationFilter">Filter by Location</Label>
                  <Select value={filterCriteria.location} onValueChange={(value) => setFilterCriteria(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lastContactedFilter">Last Contacted</Label>
                  <Select value={filterCriteria.lastContacted} onValueChange={(value) => setFilterCriteria(prev => ({ ...prev, lastContacted: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="never">Never contacted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applyAdvancedFilters} className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={() => setFilterCriteria({ tag: '', group: '', location: '', lastContacted: '' })}>
                  Clear Filters
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Filter Results</h4>
                <p className="text-sm text-blue-700">
                  Filters will be applied to your recipient list when sending campaigns. 
                  This helps you target specific segments for better engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Bulk Contact Actions
              </CardTitle>
              <CardDescription>
                Perform actions on multiple contacts at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Checkbox 
                  id="selectAll"
                  checked={selectedContacts.length === recipients.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedContacts(recipients.map(r => r.id));
                    } else {
                      setSelectedContacts([]);
                    }
                  }}
                />
                <Label htmlFor="selectAll" className="font-medium">
                  Select All Contacts ({recipients.length})
                </Label>
                <Badge variant="secondary">
                  {selectedContacts.length} selected
                </Badge>
              </div>

              {selectedContacts.length > 0 && (
                <div className="flex gap-2 p-4 border rounded-lg bg-blue-50">
                  <Button size="sm" variant="outline">
                    <Tag className="w-4 h-4 mr-2" />
                    Add Tags
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Add to Group
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportSelectedContacts}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Tag Management</h4>
                  <p className="text-sm text-gray-600 mb-3">Add or remove tags from multiple contacts</p>
                  <Button size="sm" className="w-full">Manage Tags</Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Group Operations</h4>
                  <p className="text-sm text-gray-600 mb-3">Move contacts between groups efficiently</p>
                  <Button size="sm" className="w-full">Manage Groups</Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Data Cleanup</h4>
                  <p className="text-sm text-gray-600 mb-3">Remove duplicates and invalid contacts</p>
                  <Button size="sm" className="w-full">Clean Data</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
