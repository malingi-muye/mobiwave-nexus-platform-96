
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Ticket, Clock, Users, AlertCircle } from 'lucide-react';
import { useServiceDesk } from '@/hooks/useServiceDesk';
import { TicketManager } from './TicketManager';
import { TicketDetails } from './TicketDetails';

export function ServiceDeskDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const { tickets, isLoading } = useServiceDesk();

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeTab === 'create') {
    return <TicketManager onBack={() => setActiveTab('overview')} />;
  }

  if (activeTab === 'details' && selectedTicket) {
    return (
      <TicketDetails 
        ticketId={selectedTicket}
        onBack={() => {
          setActiveTab('overview');
          setSelectedTicket(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Desk</h2>
          <p className="text-gray-600">Manage customer support tickets and issues</p>
        </div>
        <Button onClick={() => setActiveTab('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{openTickets}</div>
            <p className="text-xs text-gray-600">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressTickets}</div>
            <p className="text-xs text-gray-600">Being worked on</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentTickets}</div>
            <p className="text-xs text-gray-600">High priority</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Latest support requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tickets found</p>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.slice(0, 10).map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket.id);
                    setActiveTab('details');
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge variant="outline">{ticket.ticket_number}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    {ticket.customer_phone && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{ticket.customer_phone}</span>
                      </div>
                    )}
                    {ticket.sla_due_at && new Date(ticket.sla_due_at) < new Date() && (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>SLA Overdue</span>
                      </div>
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
