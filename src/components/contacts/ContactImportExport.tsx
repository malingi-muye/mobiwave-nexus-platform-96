
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { Upload, Download, Users } from 'lucide-react';
import { Contact } from '@/hooks/useContacts';

interface ContactImportExportProps {
  contacts: Contact[];
  onImport: (contacts: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
}

export function ContactImportExport({ contacts, onImport }: ContactImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    if (contacts.length === 0) {
      toast.error('No contacts to export');
      return;
    }

    const csvHeaders = ['First Name', 'Last Name', 'Phone', 'Email', 'Tags'];
    const csvData = contacts.map(contact => [
      contact.first_name || '',
      contact.last_name || '',
      contact.phone,
      contact.email || '',
      (contact.tags || []).join(';')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`Exported ${contacts.length} contacts`);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must contain headers and at least one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const dataLines = lines.slice(1);

      const requiredFields = ['phone'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const importedContacts: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        
        if (values.length !== headers.length) continue;

        const contact: any = {
          is_active: true,
          custom_fields: {}
        };

        headers.forEach((header, index) => {
          const value = values[index];
          switch (header) {
            case 'first name':
            case 'firstname':
              contact.first_name = value || null;
              break;
            case 'last name':
            case 'lastname':
              contact.last_name = value || null;
              break;
            case 'phone':
              contact.phone = value;
              break;
            case 'email':
              contact.email = value || null;
              break;
            case 'tags':
              contact.tags = value ? value.split(';').map(t => t.trim()).filter(Boolean) : [];
              break;
            default:
              if (value) {
                contact.custom_fields[header] = value;
              }
          }
        });

        if (contact.phone) {
          importedContacts.push(contact);
        }

        setImportProgress(((i + 1) / dataLines.length) * 100);
      }

      if (importedContacts.length === 0) {
        toast.error('No valid contacts found in CSV file');
        return;
      }

      await onImport(importedContacts);
      toast.success(`Successfully imported ${importedContacts.length} contacts`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import contacts. Please check your CSV format.');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Import/Export Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="csv-file">Import from CSV</Label>
            <div className="flex gap-2 mt-1">
              <Input
                ref={fileInputRef}
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                disabled={isImporting}
                className="flex-1"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            {isImporting && (
              <div className="mt-2">
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">
                  Importing... {Math.round(importProgress)}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">
              Current contacts: <span className="font-medium">{contacts.length}</span>
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">CSV Format Requirements:</p>
          <p>• Required column: phone</p>
          <p>• Optional columns: first name, last name, email, tags</p>
          <p>• Tags should be separated by semicolons (;)</p>
        </div>
      </CardContent>
    </Card>
  );
}
