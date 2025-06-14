
import React, { useState } from 'react';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { useEnhancedUserManagement } from '@/hooks/useEnhancedUserManagement';
import { EnhancedUserStats } from './user-management/EnhancedUserStats';
import { EnhancedUserFilters } from './user-management/EnhancedUserFilters';
import { EnhancedUserTable } from './user-management/EnhancedUserTable';
import { MspaceUserManagement } from './mspace/MspaceUserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Globe } from 'lucide-react';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  const { users, isLoading, stats } = useEnhancedUserManagement(searchTerm, roleFilter, userTypeFilter);

  const handleUserUpdated = () => {
    // The useEnhancedUserManagement hook will automatically refetch data
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Enhanced User Management
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage both database users and Mspace API clients with real-time synchronization and comprehensive filtering.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="mspace" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Mspace Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <EnhancedUserStats stats={stats} />
          
          <EnhancedUserFilters 
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            userTypeFilter={userTypeFilter}
            onSearchChange={setSearchTerm}
            onRoleFilterChange={setRoleFilter}
            onUserTypeFilterChange={setUserTypeFilter}
          />

          <LoadingWrapper 
            isLoading={isLoading} 
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            }
          >
            <EnhancedUserTable 
              users={users}
              isLoading={isLoading}
              onUserUpdated={handleUserUpdated}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="mspace" className="space-y-6">
          <MspaceUserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
