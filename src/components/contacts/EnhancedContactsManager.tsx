import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Upload, Download, Merge, FolderOpen } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { ContactImportExport } from './ContactImportExport';
import { ContactDuplicateDetector } from './ContactDuplicateDetector';
import { ContactGroupManager } from './ContactGroupManager';
import { ErrorBoundary } from '../ErrorBoundary';

export function EnhancedContactsManager() {
  const { 
    contacts, 
    contactGroups, 
    isLoading, 
    error,
    importContacts,
    mergeContacts,
    createContactGroup
  } = useContacts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error loading contacts: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const handleImportContacts = async (contactsToImport: any[]) => {
    await importContacts(contactsToImport);
  };

  const handleMergeContacts = async (keepContact: any, duplicateIds: string[]) => {
    await mergeContacts({ primaryId: keepContact.id, duplicateIds });
  };

  const handleCreateContactGroup = async (group: any) => {
    await createContactGroup(group);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
            Contact Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Organize, import, and manage your contacts with advanced tools.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
                  <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Contact Groups</p>
                  <p className="text-3xl font-bold text-gray-900">{contactGroups.length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">With Email</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {contacts.filter(c => c.email).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">With Tags</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {contacts.filter(c => c.tags && c.tags.length > 0).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="import-export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import-export" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import/Export
            </TabsTrigger>
            <TabsTrigger value="duplicates" className="flex items-center gap-2">
              <Merge className="w-4 h-4" />
              Duplicates
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import-export" className="space-y-6">
            <ContactImportExport
              contacts={contacts}
              onImport={handleImportContacts}
            />
          </TabsContent>

          <TabsContent value="duplicates" className="space-y-6">
            <ContactDuplicateDetector
              contacts={contacts}
              onMergeContacts={handleMergeContacts}
            />
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <ContactGroupManager
              contactGroups={contactGroups}
              onCreateGroup={handleCreateContactGroup}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
