
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Search, Filter, Calendar, BarChart } from 'lucide-react';
import { format } from 'date-fns';

export function CampaignHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Welcome Series - Q4 2024',
      status: 'completed',
      recipients: 15420,
      delivered: 14890,
      failed: 530,
      cost: 771.00,
      createdAt: new Date('2024-01-15'),
      completedAt: new Date('2024-01-15'),
      deliveryRate: 96.6
    },
    {
      id: 2,
      name: 'Black Friday Promotion',
      status: 'completed',
      recipients: 8760,
      delivered: 8520,
      failed: 240,
      cost: 438.00,
      createdAt: new Date('2024-01-10'),
      completedAt: new Date('2024-01-10'),
      deliveryRate: 97.3
    },
    {
      id: 3,
      name: 'Product Launch Alert',
      status: 'sending',
      recipients: 5200,
      delivered: 3400,
      failed: 120,
      cost: 260.00,
      createdAt: new Date('2024-01-12'),
      completedAt: null,
      deliveryRate: 96.5
    },
    {
      id: 4,
      name: 'Customer Survey Request',
      status: 'scheduled',
      recipients: 2850,
      delivered: 0,
      failed: 0,
      cost: 142.50,
      createdAt: new Date('2024-01-14'),
      completedAt: null,
      deliveryRate: 0
    },
    {
      id: 5,
      name: 'Payment Reminder',
      status: 'failed',
      recipients: 980,
      delivered: 650,
      failed: 330,
      cost: 49.00,
      createdAt: new Date('2024-01-08'),
      completedAt: new Date('2024-01-08'),
      deliveryRate: 66.3
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'sending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sending</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Scheduled</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0);
  const totalDelivered = campaigns.reduce((sum, campaign) => sum + campaign.delivered, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
  const averageDeliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalSent.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Total recipients</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageDeliveryRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">Average across all campaigns</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalCost.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">Campaign costs</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Campaign History
          </CardTitle>
          <CardDescription>
            View and analyze your past SMS campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Delivery Rate</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.recipients.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {campaign.delivered.toLocaleString()} delivered, {campaign.failed.toLocaleString()} failed
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          campaign.deliveryRate >= 95 ? 'bg-green-500' :
                          campaign.deliveryRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        {campaign.deliveryRate.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${campaign.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{format(campaign.createdAt, 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500">{format(campaign.createdAt, 'h:mm a')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <BarChart className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No campaigns found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
