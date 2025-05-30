
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Users,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryStatus {
  id: string;
  recipient: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'unsubscribed';
  timestamp: Date;
  errorMessage?: string;
  deliveryTime?: number; // seconds
}

interface CampaignDelivery {
  id: string;
  name: string;
  status: 'preparing' | 'sending' | 'completed' | 'failed';
  totalRecipients: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  startTime: Date;
  estimatedCompletion?: Date;
  deliveryStatuses: DeliveryStatus[];
}

interface DeliveryTrackerProps {
  campaigns?: any[];
}

export function DeliveryTracker({ campaigns = [] }: DeliveryTrackerProps) {
  const [deliveries, setDeliveries] = useState<CampaignDelivery[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds

  // Mock data for demonstration
  useEffect(() => {
    const mockDeliveries: CampaignDelivery[] = [
      {
        id: '1',
        name: 'Black Friday Sale Alert',
        status: 'sending',
        totalRecipients: 10000,
        sent: 7500,
        delivered: 7200,
        failed: 150,
        pending: 2500,
        startTime: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
        estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        deliveryStatuses: []
      },
      {
        id: '2',
        name: 'Payment Reminder',
        status: 'completed',
        totalRecipients: 500,
        sent: 500,
        delivered: 485,
        failed: 15,
        pending: 0,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        deliveryStatuses: []
      },
      {
        id: '3',
        name: 'Weekly Newsletter',
        status: 'preparing',
        totalRecipients: 25000,
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 25000,
        startTime: new Date(),
        deliveryStatuses: []
      }
    ];

    setDeliveries(mockDeliveries);
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setDeliveries(prev => prev.map(delivery => {
        if (delivery.status === 'sending') {
          const progress = Math.min(delivery.sent + Math.floor(Math.random() * 100), delivery.totalRecipients);
          const delivered = Math.floor(progress * 0.96); // 96% delivery rate
          const failed = progress - delivered;
          
          return {
            ...delivery,
            sent: progress,
            delivered,
            failed,
            pending: delivery.totalRecipients - progress,
            status: progress >= delivery.totalRecipients ? 'completed' : 'sending'
          };
        }
        return delivery;
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'sending': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (delivery: CampaignDelivery) => {
    return (delivery.sent / delivery.totalRecipients) * 100;
  };

  const calculateDeliveryRate = (delivery: CampaignDelivery) => {
    if (delivery.sent === 0) return 0;
    return (delivery.delivered / delivery.sent) * 100;
  };

  const formatTimeRemaining = (estimatedCompletion?: Date) => {
    if (!estimatedCompletion) return 'N/A';
    const remaining = estimatedCompletion.getTime() - Date.now();
    if (remaining <= 0) return 'Completed';
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const filteredDeliveries = selectedCampaign === 'all' 
    ? deliveries 
    : deliveries.filter(d => d.id === selectedCampaign);

  const totalStats = deliveries.reduce((acc, delivery) => ({
    totalRecipients: acc.totalRecipients + delivery.totalRecipients,
    sent: acc.sent + delivery.sent,
    delivered: acc.delivered + delivery.delivered,
    failed: acc.failed + delivery.failed,
    pending: acc.pending + delivery.pending
  }), { totalRecipients: 0, sent: 0, delivered: 0, failed: 0, pending: 0 });

  const overallDeliveryRate = totalStats.sent > 0 ? (totalStats.delivered / totalStats.sent) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Tracking</h2>
          <p className="text-gray-600">Real-time monitoring of campaign delivery status</p>
        </div>
        <div className="flex gap-2">
          <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 second</SelectItem>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-xl font-bold">{totalStats.totalRecipients.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-xl font-bold">{totalStats.sent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold">{totalStats.delivered.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-xl font-bold">{totalStats.failed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-xl font-bold">{overallDeliveryRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Campaign:</label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {deliveries.map(delivery => (
                  <SelectItem key={delivery.id} value={delivery.id}>
                    {delivery.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Status Cards */}
      <div className="space-y-4">
        {filteredDeliveries.map(delivery => (
          <Card key={delivery.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <CardTitle className="text-lg">{delivery.name}</CardTitle>
                    <CardDescription>
                      Started {delivery.startTime.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(delivery.status)}>
                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{calculateProgress(delivery).toFixed(1)}%</span>
                  </div>
                  <Progress value={calculateProgress(delivery)} className="h-3" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Total</p>
                    <p className="font-bold">{delivery.totalRecipients.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-blue-600">Sent</p>
                    <p className="font-bold text-blue-800">{delivery.sent.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-green-600">Delivered</p>
                    <p className="font-bold text-green-800">{delivery.delivered.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-red-600">Failed</p>
                    <p className="font-bold text-red-800">{delivery.failed.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="text-yellow-600">Pending</p>
                    <p className="font-bold text-yellow-800">{delivery.pending.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-purple-600">Rate</p>
                    <p className="font-bold text-purple-800">{calculateDeliveryRate(delivery).toFixed(1)}%</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex gap-4">
                    {delivery.status === 'sending' && (
                      <span>Time remaining: {formatTimeRemaining(delivery.estimatedCompletion)}</span>
                    )}
                    <span>Delivery rate: {calculateDeliveryRate(delivery).toFixed(1)}%</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No active delivery campaigns</p>
            <p className="text-sm text-gray-400">Start a campaign to see real-time delivery tracking</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
