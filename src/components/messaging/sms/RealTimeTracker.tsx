
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle, XCircle, Clock, Send, Activity } from 'lucide-react';

interface MessageStatus {
  id: string;
  recipient: string;
  content: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  failed_at?: string;
  error_message?: string;
  provider_message_id?: string;
}

export function RealTimeTracker() {
  const [messages, setMessages] = useState<MessageStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial messages from campaigns table
    loadMessages();

    // Set up real-time subscription for campaigns
    const channel = supabase
      .channel('campaign-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          loadMessages(); // Reload messages when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    try {
      // Use campaigns table instead of message_history
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('type', 'sms')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform campaign data to message format
      const transformedMessages: MessageStatus[] = (data || []).map(campaign => ({
        id: campaign.id,
        recipient: `${campaign.recipient_count} recipients`,
        content: campaign.content,
        status: campaign.status === 'sent' ? 'delivered' : campaign.status,
        sent_at: campaign.sent_at || campaign.created_at,
        provider_message_id: campaign.id
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'sending':
        return <Send className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      sent: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      sending: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStats = () => {
    const total = messages.length;
    const delivered = messages.filter(m => m.status === 'delivered' || m.status === 'sent').length;
    const failed = messages.filter(m => m.status === 'failed').length;
    const pending = messages.filter(m => m.status === 'draft' || m.status === 'sending').length;

    return { total, delivered, failed, pending };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-green-700">Sent</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-yellow-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-red-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-red-700">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Message List */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Campaign Tracking
              </CardTitle>
              <CardDescription>
                Live updates of SMS campaign status
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadMessages}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No campaigns yet</p>
                <p className="text-sm">Create a campaign to start tracking</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(message.status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {message.recipient}
                      </div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">
                        {message.content}
                      </div>
                      {message.provider_message_id && (
                        <div className="text-xs text-gray-400">
                          ID: {message.provider_message_id}
                        </div>
                      )}
                      {message.error_message && (
                        <div className="text-xs text-red-600 mt-1">
                          Error: {message.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(message.status)}
                    <div className="text-xs text-gray-500 mt-1">
                      {message.delivered_at 
                        ? `Delivered: ${formatTime(message.delivered_at)}`
                        : message.failed_at
                        ? `Failed: ${formatTime(message.failed_at)}`
                        : `Created: ${formatTime(message.sent_at)}`
                      }
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
