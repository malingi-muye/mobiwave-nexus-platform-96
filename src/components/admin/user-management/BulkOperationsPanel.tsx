
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Download, 
  Upload, 
  Mail, 
  CreditCard, 
  UserX, 
  Settings,
  CheckCircle
} from 'lucide-react';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';

interface BulkOperationsPanelProps {
  selectedUsers: CompleteUser[];
  onClearSelection: () => void;
  onBulkOperation: (operation: string, params?: any) => Promise<void>;
  isLoading: boolean;
}

export function BulkOperationsPanel({
  selectedUsers,
  onClearSelection,
  onBulkOperation,
  isLoading
}: BulkOperationsPanelProps) {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [serviceToAssign, setServiceToAssign] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<string>('');

  const handleBulkAction = async () => {
    if (!bulkAction) return;

    const params: any = {};
    
    if (bulkAction === 'assign-service' && serviceToAssign) {
      params.serviceId = serviceToAssign;
    }
    
    if (bulkAction === 'add-credits' && creditAmount) {
      params.amount = parseFloat(creditAmount);
    }

    await onBulkOperation(bulkAction, params);
    setBulkAction('');
    setServiceToAssign('');
    setCreditAmount('');
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CheckCircle className="w-5 h-5" />
          Bulk Operations
          <Badge variant="secondary" className="ml-2">
            {selectedUsers.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assign-service">Assign Service</SelectItem>
              <SelectItem value="remove-service">Remove Service</SelectItem>
              <SelectItem value="add-credits">Add Credits</SelectItem>
              <SelectItem value="send-notification">Send Notification</SelectItem>
              <SelectItem value="export-data">Export Data</SelectItem>
              <SelectItem value="deactivate">Deactivate Users</SelectItem>
            </SelectContent>
          </Select>

          {bulkAction === 'assign-service' && (
            <Select value={serviceToAssign} onValueChange={setServiceToAssign}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS Service</SelectItem>
                <SelectItem value="ussd">USSD Service</SelectItem>
                <SelectItem value="mpesa">M-Pesa Integration</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
              </SelectContent>
            </Select>
          )}

          {bulkAction === 'add-credits' && (
            <input
              type="number"
              placeholder="Credit amount"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-32"
            />
          )}

          <Button 
            onClick={handleBulkAction}
            disabled={!bulkAction || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Processing...' : 'Apply Action'}
          </Button>

          <Button 
            variant="outline" 
            onClick={onClearSelection}
            className="text-gray-600"
          >
            Clear Selection
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <div className="text-sm text-gray-600">
            Quick Actions:
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onBulkOperation('export-csv')}
            className="h-7"
          >
            <Download className="w-3 h-3 mr-1" />
            Export CSV
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onBulkOperation('send-welcome-email')}
            className="h-7"
          >
            <Mail className="w-3 h-3 mr-1" />
            Welcome Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
