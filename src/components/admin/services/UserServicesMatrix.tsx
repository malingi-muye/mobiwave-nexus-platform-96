
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Power, 
  PowerOff, 
  Settings, 
  Filter,
  UserCheck,
  UserX
} from 'lucide-react';
import { useUserServicesOverview } from '@/hooks/useUserServicesOverview';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { UserServiceActions } from './UserServiceActions';

export function UserServicesMatrix() {
  const { groupedByUser, isLoading, toggleService, bulkServiceOperation, isUpdating } = useUserServicesOverview();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(groupedByUser.map((item: any) => item.user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkOperation = async (operation: 'activate' | 'deactivate') => {
    if (!selectedService || selectedUsers.length === 0) {
      return;
    }

    try {
      await bulkServiceOperation({
        userIds: selectedUsers,
        serviceId: selectedService,
        operation
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error('Bulk operation failed:', error);
    }
  };

  const handleToggleService = async (params: { userId: string; serviceId: string; operation: 'activate' | 'deactivate' }) => {
    try {
      await toggleService(params);
    } catch (error) {
      console.error('Service toggle failed:', error);
    }
  };

  // Get all unique services for the service selector
  const allServices = groupedByUser.length > 0 
    ? groupedByUser[0].services || []
    : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Operations Panel */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{selectedUsers.length} users selected</span>
              </div>
              
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1"
              >
                <option value="">Select service</option>
                {allServices.map((service: any) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkOperation('activate')}
                  disabled={!selectedService || isUpdating}
                  className="flex items-center gap-1"
                >
                  <Power className="w-3 h-3" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkOperation('deactivate')}
                  disabled={!selectedService || isUpdating}
                  className="flex items-center gap-1"
                >
                  <PowerOff className="w-3 h-3" />
                  Deactivate
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Users & Services Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users & Services Matrix
            <Badge variant="outline" className="ml-2">
              {groupedByUser.length} users
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {groupedByUser.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === groupedByUser.length && groupedByUser.length > 0}
                        onCheckedChange={handleSelectAll}
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
                          onCheckedChange={(checked) => handleSelectUser(userGroup.user.id, checked as boolean)}
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
                                onToggle={handleToggleService}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
