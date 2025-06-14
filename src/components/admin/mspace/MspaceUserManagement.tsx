
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Users, Database } from 'lucide-react';
import { useMspaceUsers } from '@/hooks/useMspaceUsers';
import { LoadingWrapper } from '@/components/ui/loading-wrapper';

export function MspaceUserManagement() {
  const { 
    storedMspaceUsers, 
    isLoadingStored, 
    fetchAndSyncClients, 
    isLoading 
  } = useMspaceUsers();

  const handleSyncClients = () => {
    fetchAndSyncClients.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Mspace Users Management</h3>
          <p className="text-gray-600">Manage real users from Mspace API reseller clients</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSyncClients}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Fetch & Sync Clients
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Total Mspace Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storedMspaceUsers?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-green-600" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storedMspaceUsers?.filter(u => u.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              Last Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {storedMspaceUsers?.[0]?.fetched_at 
                ? new Date(storedMspaceUsers[0].fetched_at).toLocaleString()
                : 'Never'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Mspace Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWrapper isLoading={isLoadingStored}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storedMspaceUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">{user.mspace_client_id}</TableCell>
                    <TableCell className="font-medium">{user.client_name}</TableCell>
                    <TableCell>{user.username || '-'}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${user.balance.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {!storedMspaceUsers?.length && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No Mspace clients found. Click "Fetch & Sync Clients" to load data.</p>
              </div>
            )}
          </LoadingWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
