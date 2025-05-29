
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle, XCircle, Clock, Send } from 'lucide-react';

interface MessageStatus {
  id: string;
  recipient: string;
  content: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  failed_at?: string;
  error_message?: string;
}

export function RealTimeTracker() {
  const [messages, setMessages] = useState<MessageStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('message-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_history'
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
      const { data, error } = await supabase
        .from('message_history')
        .select('*')
        .eq('type', 'sms')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

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
    const variants = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
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

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Real-time Message Tracking
            </CardTitle>
            <CardDescription>
              Live updates of SMS delivery status
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
              No messages sent yet
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(message.status)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {message.recipient}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {message.content}
                    </div>
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
                      : `Sent: ${formatTime(message.sent_at)}`
                    }
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
