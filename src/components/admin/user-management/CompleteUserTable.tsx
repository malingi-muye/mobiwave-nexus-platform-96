
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, UserPlus } from 'lucide-react';
import { CompleteUserTableRow } from './CompleteUserTableRow';
import { UserCreateDialog } from './UserCreateDialog';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';

interface CompleteUserTableProps {
  users: CompleteUser[];
  isLoading: boolean;
  onUserUpdated: () => void;
}

export function CompleteUserTable({ users, isLoading, onUserUpdated }: CompleteUserTableProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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
    <>
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              Complete User Management
              {users.some(u => !u.has_profile) && (
                <div className="relative group">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Some users are missing profiles
                  </div>
                </div>
              )}
            </CardTitle>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>
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

      <UserCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserCreated={onUserUpdated}
      />
    </>
  );
}
