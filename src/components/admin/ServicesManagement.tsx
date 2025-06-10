
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
import { Settings, Users, Search, Shield, Crown } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .order('email');

  if (error) throw error;
  return data || [];
};

export function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-simple'],
    queryFn: fetchUsers
  });

  // Mock services data since we don't have a services table yet
  const mockServices = [
    {
      id: '1',
      name: 'SMS Messaging',
      description: 'Send SMS messages to contacts',
      route: '/bulk-sms',
      is_active: true,
      is_premium: false
    },
    {
      id: '2',
      name: 'Email Campaigns',
      description: 'Create and send email campaigns',
      route: '/email-campaigns',
      is_active: true,
      is_premium: false
    },
    {
      id: '3',
      name: 'WhatsApp Messaging',
      description: 'Send WhatsApp messages',
      route: '/whatsapp-campaigns',
      is_active: true,
      is_premium: true
    },
    {
      id: '4',
      name: 'Analytics Dashboard',
      description: 'View detailed analytics',
      route: '/analytics',
      is_active: true,
      is_premium: true
    }
  ];

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (usersLoading) {
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
                  {filteredUsers.map((user) => (
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
                          {mockServices.map((service) => (
                            <Badge
                              key={service.id}
                              variant="default"
                              className={`text-xs ${service.is_premium ? 'bg-yellow-100 text-yellow-800' : ''}`}
                            >
                              {service.name}
                              {service.is_premium && <Crown className="w-3 h-3 ml-1" />}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {mockServices.map((service) => (
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
                          onCheckedChange={(checked) => {
                            console.log(`Toggling service ${service.name} to ${checked}`);
                          }}
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
