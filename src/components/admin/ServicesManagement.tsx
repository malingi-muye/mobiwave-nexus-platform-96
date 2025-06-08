
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Search, Crown } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
}

interface UserService {
  id: string;
  user_id: string;
  service_id: string;
  is_enabled: boolean;
  services: Service;
  user_profile?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .order('email');

  if (error) throw error;
  return data || [];
};

const fetchUserServices = async (): Promise<UserService[]> => {
  const { data, error } = await supabase
    .from('user_services')
    .select(`
      *,
      services(*),
      profiles!user_services_user_id_fkey(email, first_name, last_name)
    `)
    .order('user_id');

  if (error) {
    console.error('Error fetching user services:', error);
    return [];
  }
  
  // Transform the data to match our interface, handling potential join failures
  const transformedData = (data || []).map(item => {
    const profiles = item.profiles;
    return {
      ...item,
      user_profile: profiles && 
                    profiles !== null && 
                    typeof profiles === 'object' && 
                    'email' in profiles 
        ? profiles 
        : null
    };
  });

  return transformedData as UserService[];
};

export function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: fetchServices
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-simple'],
    queryFn: fetchUsers
  });

  const { data: userServices = [], isLoading: userServicesLoading } = useQuery({
    queryKey: ['admin-user-services'],
    queryFn: fetchUserServices
  });

  const updateServiceStatus = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update service: ${error.message}`);
    }
  });

  const toggleUserService = useMutation({
    mutationFn: async ({ userId, serviceId, enabled }: { userId: string; serviceId: string; enabled: boolean }) => {
      if (enabled) {
        const currentUser = await supabase.auth.getUser();
        const { error } = await supabase
          .from('user_services')
          .upsert({
            user_id: userId,
            service_id: serviceId,
            is_enabled: true,
            enabled_by: currentUser.data.user?.id
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_services')
          .delete()
          .eq('user_id', userId)
          .eq('service_id', serviceId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-services'] });
      toast.success('User service updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user service: ${error.message}`);
    }
  });

  const enableAllServicesForUser = useMutation({
    mutationFn: async (userId: string) => {
      const currentUser = await supabase.auth.getUser();
      const servicesToInsert = services.filter(s => s.is_active).map(service => ({
        user_id: userId,
        service_id: service.id,
        is_enabled: true,
        enabled_by: currentUser.data.user?.id
      }));

      const { error } = await supabase
        .from('user_services')
        .upsert(servicesToInsert, { onConflict: 'user_id,service_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-services'] });
      toast.success('All services enabled for user');
    },
    onError: (error: any) => {
      toast.error(`Failed to enable services: ${error.message}`);
    }
  });

  const getUserServices = (userId: string) => {
    return userServices.filter(us => us.user_id === userId);
  };

  const isServiceEnabledForUser = (userId: string, serviceId: string) => {
    return userServices.some(us => us.user_id === userId && us.service_id === serviceId && us.is_enabled);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (servicesLoading || usersLoading || userServicesLoading) {
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
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.first_name || user.last_name 
                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                : user.email.split('@')[0]
                              }
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {services.map((service) => {
                              const isEnabled = isServiceEnabledForUser(user.id, service.id);
                              return (
                                <div key={service.id} className="flex items-center gap-2">
                                  <Switch
                                    checked={isEnabled}
                                    onCheckedChange={(checked) => 
                                      toggleUserService.mutate({
                                        userId: user.id,
                                        serviceId: service.id,
                                        enabled: checked
                                      })
                                    }
                                    disabled={!service.is_active}
                                  />
                                  <Badge
                                    variant={isEnabled ? "default" : "secondary"}
                                    className={`text-xs ${service.is_premium ? 'bg-yellow-100 text-yellow-800' : ''}`}
                                  >
                                    {service.name}
                                    {service.is_premium && <Crown className="w-3 h-3 ml-1" />}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => enableAllServicesForUser.mutate(user.id)}
                            disabled={enableAllServicesForUser.isPending}
                          >
                            Enable All
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {service.name}
                            {service.is_premium && <Crown className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {service.route}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.is_premium ? "default" : "secondary"}>
                          {service.is_premium ? 'Premium' : 'Standard'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.is_active ? "default" : "destructive"}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={(checked) => 
                            updateServiceStatus.mutate({
                              serviceId: service.id,
                              isActive: checked
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
