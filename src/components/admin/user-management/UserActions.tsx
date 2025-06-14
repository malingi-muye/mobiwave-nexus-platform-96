
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Mail, CreditCard } from 'lucide-react';

interface UserActionsProps {
  onEdit: () => void;
  onCredits: () => void;
  onEmail: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function UserActions({ onEdit, onCredits, onEmail, onDelete, isLoading }: UserActionsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="hover:bg-blue-50"
      >
        <Edit className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onCredits}
        className="hover:bg-green-50"
      >
        <CreditCard className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onEmail}
        disabled={isLoading}
        className="hover:bg-purple-50"
      >
        <Mail className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="hover:bg-red-50 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
