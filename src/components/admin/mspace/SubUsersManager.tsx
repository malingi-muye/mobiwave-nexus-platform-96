
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Plus, DollarSign, Users, Settings, AlertCircle } from 'lucide-react';
import { useMspaceAccounts } from '@/hooks/mspace/useMspaceAccounts';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface SubUser {
  smsBalance: string;
  subAccUser: string;
}

interface ResellerClient {
  clientname: string;
  balance: string;
  status?: string;
}

export function SubUsersManager() {
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [resellerClients, setResellerClients] = useState<ResellerClient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [topUpData, setTopUpData] = useState({ clientname: '', noOfSms: 0, type: 'subAccount' });
  const [credentialsError, setCredentialsError] = useState(false);
  
  const { 
    querySubAccounts, 
    queryResellerClients,
    topUpSubAccount,
    topUpResellerClient,
    isLoading 
  } = useMspaceAccounts();

  const loadSubUsers = async () => {
    try {
      setCredentialsError(false);
      const data = await querySubAccounts();
      setSubUsers(data);
    } catch (error: any) {
      console.error('Failed to load sub users:', error);
      if (error.message?.includes('credentials not configured')) {
        setCredentialsError(true);
      }
    }
  };

  const loadResellerClients = async () => {
    try {
      setCredentialsError(false);
      const data = await queryResellerClients();
      setResellerClients(data);
    } catch (error: any) {
      console.error('Failed to load reseller clients:', error);
      if (error.message?.includes('credentials not configured')) {
        setCredentialsError(true);
      }
    }
  };

  const handleTopUp = async () => {
    if (!topUpData.clientname || topUpData.noOfSms <= 0) {
      toast.error('Please enter valid client name and SMS quantity');
      return;
    }

    try {
      if (topUpData.type === 'subAccount') {
        await topUpSubAccount({
          clientname: topUpData.clientname,
          noOfSms: topUpData.noOfSms
        });
        await loadSubUsers(); // Refresh data
      } else {
        await topUpResellerClient({
          clientname: topUpData.clientname,
          noOfSms: topUpData.noOfSms
        });
        await loadResellerClients(); // Refresh data
      }
      
      setIsDialogOpen(false);
      setTopUpData({ clientname: '', noOfSms: 0, type: 'subAccount' });
    } catch (error) {
      console.error('Top-up failed:', error);
    }
  };

  const handleRefresh = () => {
    loadSubUsers();
    loadResellerClients();
  };

  useEffect(() => {
    loadSubUsers();
    loadResellerClients();
  }, []);

  const totalSubUserBalance = subUsers.reduce((sum, user) => sum + parseInt(user.smsBalance || '0'), 0);
  const totalResellerBalance = resellerClients.reduce((sum, client) => sum + parseInt(client.balance || '0'), 0);

  if (credentialsError) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold">Sub Users & Reseller Clients</h3>
          <p className="text-gray-600">Manage sub accounts and reseller client balances</p>
        </div>
        
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p className="font-medium">Mspace API credentials not configured</p>
              <p>To use this feature, you need to configure your Mspace API credentials first.</p>
              <div className="flex gap-2 mt-3">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Credentials
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Sub Users & Reseller Clients</h3>
          <p className="text-gray-600">Manage sub accounts and reseller client balances</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Top Up Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Top Up Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <select
                    id="accountType"
                    value={topUpData.type}
                    onChange={(e) => setTopUpData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="subAccount">Sub Account</option>
                    <option value="resellerClient">Reseller Client</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="clientname">Client Name</Label>
                  <Input
                    id="clientname"
                    value={topUpData.clientname}
                    onChange={(e) => setTopUpData(prev => ({ ...prev, clientname: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="smsCount">SMS Credits</Label>
                  <Input
                    id="smsCount"
                    type="number"
                    value={topUpData.noOfSms}
                    onChange={(e) => setTopUpData(prev => ({ ...prev, noOfSms: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter SMS quantity"
                    min="1"
                  />
                </div>
                <Button 
                  onClick={handleTopUp} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Top Up Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Sub Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subUsers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Sub User Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubUserBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-500">SMS Credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Reseller Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerClients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              Reseller Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResellerBalance.toLocaleString()}</div>
            <p className="text-xs text-gray-500">SMS Credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Sub Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sub Users ({subUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWrapper isLoading={isLoading && subUsers.length === 0}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>SMS Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.subAccUser}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {parseInt(user.smsBalance).toLocaleString()} SMS
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTopUpData({ clientname: user.subAccUser, noOfSms: 0, type: 'subAccount' });
                          setIsDialogOpen(true);
                        }}
                      >
                        Top Up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {subUsers.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sub users found. Click "Refresh" to load data.</p>
              </div>
            )}
          </LoadingWrapper>
        </CardContent>
      </Card>

      {/* Reseller Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Reseller Clients ({resellerClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWrapper isLoading={isLoading && resellerClients.length === 0}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resellerClients.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.clientname}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {parseInt(client.balance || '0').toLocaleString()} SMS
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTopUpData({ clientname: client.clientname, noOfSms: 0, type: 'resellerClient' });
                          setIsDialogOpen(true);
                        }}
                      >
                        Top Up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {resellerClients.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No reseller clients found. Click "Refresh" to load data.</p>
              </div>
            )}
          </LoadingWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
