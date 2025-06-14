
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Search } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SubscriptionTableRow } from './SubscriptionTableRow';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface UserServiceSubscription {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  configuration: any;
  setup_fee_paid: boolean;
  monthly_billing_active: boolean;
  activated_at: string;
  service: {
    id: string;
    service_name: string;
    service_type: string;
  };
}

interface UserSubscriptionsViewProps {
  userSubscriptions: UserServiceSubscription[];
  users: User[];
  isLoading: boolean;
  isUpdating: boolean;
  onToggleServiceStatus: (subscriptionId: string, newStatus: string) => Promise<void>;
}

export function UserSubscriptionsView({ 
  userSubscriptions, 
  users, 
  isLoading, 
  isUpdating,
  onToggleServiceStatus 
}: UserSubscriptionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = userSubscriptions.filter(subscription => {
    const user = users.find(u => u.id === subscription.user_id);
    const userEmail = user?.email || '';
    const userName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
    const serviceName = subscription.service.service_name.toLowerCase();
    
    return userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           userName.includes(searchTerm.toLowerCase()) ||
           serviceName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
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
              placeholder="Search users or services..."
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
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionTableRow
                key={subscription.id}
                subscription={subscription}
                user={users.find(u => u.id === subscription.user_id)}
                isUpdating={isUpdating}
                onToggleServiceStatus={onToggleServiceStatus}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
