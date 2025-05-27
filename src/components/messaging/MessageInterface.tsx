
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  Hash,
  Bell,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export const MessageInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Hey team! The new microservices deployment is looking great. Authentication service is running smoothly.',
      timestamp: '10:30 AM',
      type: 'received'
    },
    {
      id: '2',
      sender: 'You',
      content: 'Excellent! The message routing service is also performing well. Latency is under 50ms.',
      timestamp: '10:32 AM',
      type: 'sent'
    },
    {
      id: '3',
      sender: 'Bob Chen',
      content: 'Database connections are stable. PostgreSQL cluster is handling the load perfectly.',
      timestamp: '10:35 AM',
      type: 'received'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    toast({
      title: "Message Service",
      description: "Message routed through microservice infrastructure",
    });

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'System',
        content: 'Message delivered successfully via RabbitMQ queue system.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received'
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const channels = [
    { name: 'general', active: true, unread: 0 },
    { name: 'development', active: false, unread: 3 },
    { name: 'infrastructure', active: false, unread: 1 },
    { name: 'deployment', active: false, unread: 0 },
  ];

  const onlineUsers = [
    'Alice Johnson',
    'Bob Chen',
    'Carol Davis',
    'David Wilson',
    'Emma Brown'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Mobiwave Team</h2>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-500">All services online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Channels</h3>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                  Real-time
                </Badge>
              </div>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <div
                    key={channel.name}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      channel.active 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {channel.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Online Users */}
            <div className="p-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-3">
                Online — {onlineUsers.length}
              </h3>
              <div className="space-y-2">
                {onlineUsers.map((user) => (
                  <div key={user} className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700">{user}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-slate-600" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">general</h1>
                  <p className="text-sm text-slate-500">Team communication channel</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Message Service: Active
                </Badge>
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${msg.type === 'sent' ? 'order-2' : 'order-1'}`}>
                  {msg.type === 'received' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500" />
                      <span className="text-sm font-medium text-slate-700">{msg.sender}</span>
                      <span className="text-xs text-slate-500">{msg.timestamp}</span>
                    </div>
                  )}
                  <Card className={`border-0 ${
                    msg.type === 'sent' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-white shadow-md'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm">{msg.content}</p>
                      {msg.type === 'sent' && (
                        <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <Button type="button" variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="mt-2 text-xs text-slate-500 flex justify-between">
              <span>Messages routed via RabbitMQ • End-to-end encrypted</span>
              <span>Response time: &lt;50ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
