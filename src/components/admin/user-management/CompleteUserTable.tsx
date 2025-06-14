
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, AlertTriangle } from 'lucide-react';
import { CompleteUserTableRow } from './CompleteUserTableRow';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';

interface CompleteUserTableProps {
  users: CompleteUser[];
  isLoading: boolean;
  onUserUpdated: () => void;
}

export function CompleteUserTable({ users, isLoading, onUserUpdated }: CompleteUserTableProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Complete User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          Complete User Management
          {users.some(u => !u.has_profile) && (
            <AlertTriangle className="w-4 h-4 text-amber-500" title="Some users are missing profiles" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role & Type</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <CompleteUserTableRow 
                key={user.id}
                user={user}
                onUserUpdated={onUserUpdated}
              />
            ))}
          </TableBody>
        </Table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
