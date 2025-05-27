
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Send, BarChart, RefreshCw } from 'lucide-react';

interface DeliveryTrackerProps {
  campaigns: any[];
}

export function DeliveryTracker({ campaigns }: DeliveryTrackerProps) {
  const [deliveryStats, setDeliveryStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 0
  });

  const [realTimeUpdates, setRealTimeUpdates] = useState([
    { id: 1, phone: '+1234567890', status: 'delivered', timestamp: new Date(), campaign: 'Welcome Campaign' },
    { id: 2, phone: '+0987654321', status: 'sent', timestamp: new Date(), campaign: 'Promotion Alert' },
    { id: 3, phone: '+1122334455', status: 'failed', timestamp: new Date(), campaign: 'Welcome Campaign' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const statuses = ['sent', 'delivered', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const newUpdate = {
        id: Date.now(),
        phone: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status: randomStatus,
        timestamp: new Date(),
        campaign: 'Current Campaign'
      };
      
      setRealTimeUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      
      setDeliveryStats(prev => ({
        ...prev,
        [randomStatus]: prev[randomStatus as keyof typeof prev] + 1,
        total: prev.total + 1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sent</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const deliveryRate = deliveryStats.total > 0 ? (deliveryStats.delivered / deliveryStats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{deliveryStats.total.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <BarChart className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-xs text-gray-500">Campaign progress</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryStats.delivered.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs text-gray-500">{deliveryRate.toFixed(1)}% delivery rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deliveryStats.failed.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <XCircle className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-xs text-gray-500">
                {deliveryStats.total > 0 ? ((deliveryStats.failed / deliveryStats.total) * 100).toFixed(1) : 0}% failure rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{deliveryStats.pending.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <Clock className="w-4 h-4 text-yellow-600 mr-1" />
              <span className="text-xs text-gray-500">In queue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Delivery Progress
            </CardTitle>
            <CardDescription>Real-time campaign delivery status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{deliveryStats.total > 0 ? Math.round(((deliveryStats.sent + deliveryStats.delivered) / deliveryStats.total) * 100) : 0}%</span>
              </div>
              <Progress 
                value={deliveryStats.total > 0 ? ((deliveryStats.sent + deliveryStats.delivered) / deliveryStats.total) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery Rate</span>
                <span>{deliveryRate.toFixed(1)}%</span>
              </div>
              <Progress 
                value={deliveryRate} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-600">{deliveryStats.delivered}</div>
                <div className="text-xs text-green-700">Delivered</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-lg font-bold text-red-600">{deliveryStats.failed}</div>
                <div className="text-xs text-red-700">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              Real-time Updates
            </CardTitle>
            <CardDescription>Live delivery status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {realTimeUpdates.map((update) => (
                <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(update.status)}
                    <div>
                      <div className="text-sm font-medium">{update.phone}</div>
                      <div className="text-xs text-gray-500">{update.campaign}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(update.status)}
                    <div className="text-xs text-gray-500 mt-1">
                      {update.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
