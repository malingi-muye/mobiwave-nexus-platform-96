
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface UserSubscriptionWithService {
  id: string;
  service_id: string;
  status: string;
  setup_fee_paid: boolean;
  monthly_billing_active: boolean;
  activated_at: string | null;
  created_at: string;
  service: {
    service_name: string;
    service_type: string;
    description: string;
    setup_fee: number;
    monthly_fee: number;
  };
}

const fetchUserSubscriptions = async (): Promise<UserSubscriptionWithService[]> => {
  const { data, error } = await supabase
    .from('user_service_subscriptions')
    .select(`
      *,
      service:services_catalog(
        service_name,
        service_type,
        description,
        setup_fee,
        monthly_fee
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export function UserSubscriptionsManager() {
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['user-subscriptions-detailed'],
    queryFn: fetchUserSubscriptions
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data, error } = await supabase
        .from('user_service_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions-detailed'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    }
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-2" />
            <p>No service subscriptions found</p>
            <p className="text-sm">Subscribe to services to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">My Subscriptions</h2>
        <p className="text-gray-600">
          Manage your active service subscriptions and configurations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getServiceIcon(subscription.service.service_type)}</span>
                      <div>
                        <div className="font-medium">{subscription.service.service_name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {subscription.service.service_type}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <Badge className={`text-xs ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Setup: {subscription.setup_fee_paid ? '✓ Paid' : '✗ Pending'}</div>
                      <div>Monthly: {subscription.monthly_billing_active ? '✓ Active' : '✗ Inactive'}</div>
                      {subscription.service.setup_fee > 0 && (
                        <div className="text-xs text-gray-500">
                          Setup: {formatCurrency(subscription.service.setup_fee)}
                        </div>
                      )}
                      {subscription.service.monthly_fee > 0 && (
                        <div className="text-xs text-gray-500">
                          Monthly: {formatCurrency(subscription.service.monthly_fee)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                      {subscription.status !== 'cancelled' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => cancelSubscription.mutate(subscription.id)}
                          disabled={cancelSubscription.isPending}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
