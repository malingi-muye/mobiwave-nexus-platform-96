
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Power, PowerOff, UserCheck } from 'lucide-react';

interface BulkOperationsPanelProps {
  selectedUsers: string[];
  selectedService: string;
  allServices: any[];
  isUpdating: boolean;
  onServiceChange: (serviceId: string) => void;
  onBulkOperation: (operation: 'activate' | 'deactivate') => void;
  onClearSelection: () => void;
}

export function BulkOperationsPanel({
  selectedUsers,
  selectedService,
  allServices,
  isUpdating,
  onServiceChange,
  onBulkOperation,
  onClearSelection
}: BulkOperationsPanelProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{selectedUsers.length} users selected</span>
          </div>
          
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
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
              onClick={() => onBulkOperation('activate')}
              disabled={!selectedService || isUpdating}
              className="flex items-center gap-1"
            >
              <Power className="w-3 h-3" />
              Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkOperation('deactivate')}
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
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
