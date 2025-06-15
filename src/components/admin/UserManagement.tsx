
import React, { useState } from 'react';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { useCompleteUserManagement } from '@/hooks/useCompleteUserManagement';
import { CompleteUserStats } from './user-management/CompleteUserStats';
import { EnhancedUserFilters } from './user-management/EnhancedUserFilters';
import { CompleteUserTable } from './user-management/CompleteUserTable';
import { MspaceUserManagement } from './mspace/MspaceUserManagement';
import { UserServicesManagement } from './services/UserServicesManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Globe, AlertTriangle, Settings } from 'lucide-react';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  const { users, isLoading, stats, refetch } = useCompleteUserManagement(searchTerm, roleFilter, userTypeFilter);

  const handleUserUpdated = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Comprehensive User Management
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-lg text-gray-600 max-w-2xl">
            Advanced user management including auth users, profiles, Mspace clients, service activations, and automated profile creation.
          </p>
          {stats.without_profiles > 0 && (
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-sm">
              <AlertTriangle className="w-4 h-4" />
              {stats.without_profiles} users missing profiles
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            User Services
          </TabsTrigger>
          <TabsTrigger value="mspace" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Mspace Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <CompleteUserStats stats={stats} />
          
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
            <CompleteUserTable 
              users={users}
              isLoading={isLoading}
              onUserUpdated={handleUserUpdated}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <UserServicesManagement />
        </TabsContent>

        <TabsContent value="mspace" className="space-y-6">
          <MspaceUserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
