
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Search } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';
import { ServiceCard } from './services/ServiceCard';
import { UserServiceGrid } from './services/UserServiceGrid';

export function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    services,
    users,
    userServices,
    isLoading,
    updateServiceStatus,
    toggleUserService,
    enableAllServicesForUser
  } = useServicesData();

  const isServiceEnabledForUser = (userId: string, serviceId: string) => {
    return userServices.some(us => us.user_id === userId && us.service_id === serviceId && us.is_enabled);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
          Services Management
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage available services and control which users have access to specific features.
        </p>
      </div>

      <Tabs defaultValue="user-services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user-services" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Services
          </TabsTrigger>
          <TabsTrigger value="global-services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Global Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-services" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                User Service Access
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <UserServiceGrid
                users={filteredUsers}
                services={services}
                isServiceEnabledForUser={isServiceEnabledForUser}
                onToggleUserService={(userId, serviceId, enabled) =>
                  toggleUserService.mutate({ userId, serviceId, enabled })
                }
                onEnableAllServices={(userId) =>
                  enableAllServicesForUser.mutate(userId)
                }
                isEnablingAll={enableAllServicesForUser.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global-services" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Global Service Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onToggle={(serviceId, isActive) =>
                      updateServiceStatus.mutate({ serviceId, isActive })
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
