
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import { useServiceActivationRequests } from '@/hooks/useServiceActivationRequests';
import { useServiceActivationMutations } from '@/hooks/useServiceActivationMutations';
import { RequestsTable } from './activation-requests/RequestsTable';
import { RejectDialog } from './activation-requests/RejectDialog';
import { EmptyState } from './activation-requests/EmptyState';
import { LoadingState } from './activation-requests/LoadingState';

export function ServiceActivationRequests() {
  const { data: activationRequests = [], isLoading } = useServiceActivationRequests();
  const { 
    approveServiceRequest, 
    rejectServiceRequest,
    isApproving,
    isRejecting
  } = useServiceActivationMutations();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    try {
      await approveServiceRequest.mutateAsync(requestId);
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequestId) return;
    
    try {
      await rejectServiceRequest.mutateAsync({ 
        requestId: selectedRequestId, 
        reason: rejectReason || undefined 
      });
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedRequestId(null);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const openRejectDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Service Activation Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activationRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <RequestsTable
            requests={activationRequests}
            onApprove={handleApprove}
            onReject={openRejectDialog}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        )}

        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          rejectReason={rejectReason}
          onRejectReasonChange={setRejectReason}
          onConfirmReject={handleReject}
          isRejecting={isRejecting}
        />
      </CardContent>
    </Card>
  );
}
