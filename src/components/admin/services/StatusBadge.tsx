
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'default' | 'lg';
}

export function StatusBadge({ status, size = 'default' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge 
      className={`text-xs ${getStatusColor(status)}`}
      variant="secondary"
    >
      {status}
    </Badge>
  );
}
