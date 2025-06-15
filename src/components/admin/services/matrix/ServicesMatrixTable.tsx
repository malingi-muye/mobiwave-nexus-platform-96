
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Settings, Users } from 'lucide-react';
import { ServiceStatusBadge } from '../ServiceStatusBadge';
import { UserServiceActions } from '../UserServiceActions';

interface ServicesMatrixTableProps {
  groupedByUser: any[];
  allServices: any[];
  selectedUsers: string[];
  isUpdating: boolean;
  onSelectUser: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleService: (params: { userId: string; serviceId: string; operation: 'activate' | 'deactivate' }) => Promise<void>;
}

export function ServicesMatrixTable({
  groupedByUser,
  allServices,
  selectedUsers,
  isUpdating,
  onSelectUser,
  onSelectAll,
  onToggleService
}: ServicesMatrixTableProps) {
  if (groupedByUser.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === groupedByUser.length && groupedByUser.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role/Type</TableHead>
            {allServices.map((service: any) => (
              <TableHead key={service.service_id} className="text-center min-w-[120px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium">{service.service_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {service.service_type}
                  </Badge>
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedByUser.map((userGroup: any) => (
            <TableRow key={userGroup.user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(userGroup.user.id)}
                  onCheckedChange={(checked) => onSelectUser(userGroup.user.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {userGroup.user.first_name} {userGroup.user.last_name}
                  </div>
                  <div className="text-sm text-gray-500">{userGroup.user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline">{userGroup.user.role}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    {userGroup.user.user_type}
                  </Badge>
                </div>
              </TableCell>
              {allServices.map((service: any) => {
                const userService = userGroup.services.find(
                  (s: any) => s.service_id === service.service_id
                );
                return (
                  <TableCell key={service.service_id} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ServiceStatusBadge 
                        status={userService?.overall_status || 'available'}
                        isEligible={userService?.is_eligible || false}
                      />
                      <UserServiceActions
                        userId={userGroup.user.id}
                        serviceId={service.service_id}
                        isActivated={userService?.is_activated || false}
                        isEligible={userService?.is_eligible || false}
                        onToggle={onToggleService}
                        isLoading={isUpdating}
                      />
                    </div>
                  </TableCell>
                );
              })}
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
