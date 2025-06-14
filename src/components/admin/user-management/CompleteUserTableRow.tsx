
import React from 'react';
import { TableRow } from "@/components/ui/table";
import { UserTableCell } from './UserTableCell';
import { UserStatusCell } from './UserStatusCell';
import { UserRoleCell } from './UserRoleCell';
import { UserCreditsCell } from './UserCreditsCell';
import { UserLastActivityCell } from './UserLastActivityCell';
import { UserActions } from './UserActions';
import { UserEditDialog } from './UserEditDialog';
import { UserCreditsDialog } from './UserCreditsDialog';
import { UserDeleteDialog } from './UserDeleteDialog';
import { CompleteUser } from '@/hooks/useCompleteUserManagement';
import { useUserEditHandlers } from './UserEditHandlers';

interface CompleteUserTableRowProps {
  user: CompleteUser;
  onUserUpdated: () => void;
}

export function CompleteUserTableRow({ user, onUserUpdated }: CompleteUserTableRowProps) {
  const {
    showEditDialog,
    setShowEditDialog,
    showCreditsDialog,
    setShowCreditsDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isLoading,
    editForm,
    setEditForm,
    handleEdit,
    handleSaveEdit,
    handleCredits,
    handleEmail,
    handleDelete,
    handleConfirmDelete
  } = useUserEditHandlers(user, onUserUpdated);

  return (
    <>
      <TableRow>
        <UserTableCell user={user} />
        <UserStatusCell user={user} />
        <UserRoleCell user={user} />
        <UserCreditsCell user={user} />
        <UserLastActivityCell user={user} />
        
        <UserActions
          onEdit={handleEdit}
          onCredits={handleCredits}
          onEmail={handleEmail}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </TableRow>

      <UserEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        editForm={editForm}
        onFormChange={setEditForm}
        onSubmit={handleSaveEdit}
        isLoading={isLoading}
      />

      <UserCreditsDialog
        open={showCreditsDialog}
        onOpenChange={setShowCreditsDialog}
        user={user}
        onUserUpdated={onUserUpdated}
      />

      <UserDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        user={user}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </>
  );
}
