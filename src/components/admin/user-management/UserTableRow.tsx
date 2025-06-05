
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserActions } from './UserActions';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  role?: string;
}

interface UserTableRowProps {
  user: User;
  onRoleUpdate: (userId: string, newRole: 'admin' | 'reseller' | 'client' | 'user') => void;
  onUserUpdated: () => void;
}

export function UserTableRow({ user, onRoleUpdate, onUserUpdated }: UserTableRowProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'reseller': return 'bg-yellow-100 text-yellow-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">
            {user.first_name || user.last_name 
              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
              : user.email.split('@')[0]
            }
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          value={user.role || 'user'}
          onValueChange={(value) => onRoleUpdate(user.id, value as 'admin' | 'reseller' | 'client' | 'user')}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              <Badge className={getRoleBadgeColor(user.role || 'user')} variant="secondary">
                {user.role || 'user'}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="reseller">Reseller</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <UserActions user={user} onUserUpdated={onUserUpdated} />
      </TableCell>
    </TableRow>
  );
}
