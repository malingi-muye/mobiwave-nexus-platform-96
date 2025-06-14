
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
import { Settings, Users, Search, Crown, DollarSign } from 'lucide-react';
import { useRealServicesManagement } from '@/hooks/useRealServicesManagement';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .order('email');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { 
    services, 
    userSubscriptions, 
    isLoading, 
    subscribeToService,
    toggleServiceStatus,
    isSubscribing,
    isUpdating
  } = useRealServicesManagement();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-simple'],
    queryFn: fetchUsers
  });

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'ussd': return '📱';
      case 'shortcode': return '💬';
      case 'mpesa': return '💳';
      case 'survey': return '📊';
      case 'servicedesk': return '🎫';
      case 'rewards': return '🎁';
      case 'whatsapp': return '💚';
      default: return '⚙️';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || usersLoading) {
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
          Manage MSpace service integrations, user subscriptions, and billing configurations.
        </p>
      </div>

      <Tabs defaultValue="services-catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services-catalog" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services Catalog
          </TabsTrigger>
          <TabsTrigger value="user-subscriptions" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Subscriptions
          </TabsTrigger>
          <TabsTrigger value="billing-overview" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Billing Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services-catalog" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Available Services Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getServiceIcon(service.service_type)}</span>
                          <div>
                            <h3 className="font-semibold text-sm">{service.service_name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{service.service_type}</p>
                          </div>
                        </div>
                        {service.is_premium && <Crown className="w-4 h-4 text-yellow-600" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3">{service.description}</p>
                      <div className="space-y-1 text-xs">
                        {service.setup_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Setup Fee:</span>
                            <span className="font-medium">{formatCurrency(service.setup_fee)}</span>
                          </div>
                        )}
                        {service.monthly_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Monthly Fee:</span>
                            <span className="font-medium">{formatCurrency(service.monthly_fee)}</span>
                          </div>
                        )}
                        {service.transaction_fee_amount > 0 && (
                          <div className="flex justify-between">
                            <span>Transaction Fee:</span>
                            <span className="font-medium">
                              {service.transaction_fee_type === 'percentage' 
                                ? `${service.transaction_fee_amount}%`
                                : formatCurrency(service.transaction_fee_amount)
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {service.provider}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-subscriptions" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                User Service Subscriptions
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
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {users.find(u => u.id === subscription.user_id)?.email || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500">ID: {subscription.user_id.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getServiceIcon(subscription.service.service_type)}</span>
                          <div>
                            <div className="font-medium text-sm">{subscription.service.service_name}</div>
                            <div className="text-xs text-gray-500">{subscription.service.service_type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Setup: {subscription.setup_fee_paid ? '✓ Paid' : '✗ Pending'}</div>
                          <div>Monthly: {subscription.monthly_billing_active ? '✓ Active' : '✗ Inactive'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={subscription.status === 'active'}
                            onCheckedChange={async (checked) => {
                              await toggleServiceStatus({
                                subscriptionId: subscription.id,
                                newStatus: checked ? 'active' : 'suspended'
                              });
                            }}
                            disabled={isUpdating}
                          />
                          <Button size="sm" variant="outline">
                            Configure
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Active Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userSubscriptions.filter(s => s.status === 'active').length}</div>
                <p className="text-xs text-gray-500">Across all users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Setups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userSubscriptions.filter(s => !s.setup_fee_paid).length}</div>
                <p className="text-xs text-gray-500">Requiring payment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userSubscriptions.filter(s => s.monthly_billing_active).length}</div>
                <p className="text-xs text-gray-500">Active billing cycles</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
