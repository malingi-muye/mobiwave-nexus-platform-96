
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, CheckCircle, XCircle, Send, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MessageStatus {
  id: string;
  recipient: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  content: string;
}

export function RealTimeTracker() {
  const [messageStatuses, setMessageStatuses] = useState<MessageStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignStats, setCampaignStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 0
  });

  const fetchRecentMessages = async () => {
    setIsLoading(true);
    try {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Mock message data from campaign metadata
      const mockMessages: MessageStatus[] = [];
      campaigns?.forEach(campaign => {
        const metadata = campaign.metadata as any;
        const messages = metadata?.messages || [];
        messages.forEach((msg: any, index: number) => {
          mockMessages.push({
            id: `${campaign.id}-${index}`,
            recipient: msg.recipient || 'Unknown',
            status: msg.status || 'pending',
            sent_at: msg.sent_at,
            delivered_at: msg.delivered_at,
            error_message: msg.error_message,
            content: campaign.content.substring(0, 50) + '...'
          });
        });
      });

      setMessageStatuses(mockMessages);

      // Calculate stats
      const stats = {
        total: mockMessages.length,
        sent: mockMessages.filter(m => m.status === 'sent' || m.status === 'delivered').length,
        delivered: mockMessages.filter(m => m.status === 'delivered').length,
        failed: mockMessages.filter(m => m.status === 'failed').length,
        pending: mockMessages.filter(m => m.status === 'pending').length
      };
      setCampaignStats(stats);

    } catch (error) {
      console.error('Error fetching message statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentMessages();
    const interval = setInterval(fetchRecentMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Real-Time Message Tracking</h2>
        </div>
        <Button 
          onClick={fetchRecentMessages} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{campaignStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-xl font-bold text-blue-600">{campaignStats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-green-600">{campaignStats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-xl font-bold text-red-600">{campaignStats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{campaignStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading messages...</p>
            </div>
          ) : messageStatuses.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active campaigns found</p>
              <p className="text-sm text-gray-500 mt-2">Messages will appear here when campaigns are running</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messageStatuses.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(message.status)}
                    <div>
                      <p className="font-medium">{message.recipient}</p>
                      <p className="text-sm text-gray-600">{message.content}</p>
                      {message.error_message && (
                        <p className="text-sm text-red-600">{message.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                    {message.sent_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.sent_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
