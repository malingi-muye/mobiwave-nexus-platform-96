
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function UserRoleManager() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["rolemanager-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, email, first_name, last_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["rolemanager-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roles").select("id, name, description");
      if (error) throw error;
      return data ?? [];
    }
  });

  const { data: userRoles = [] } = useQuery({
    queryKey: ["rolemanager-user_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    }
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role_id: roleId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["rolemanager-user_roles"] });
    },
    onError: (err: any) => toast.error("Failed to assign role: " + err.message),
  });

  const revokeRole = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string, roleId: string }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role_id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role revoked successfully");
      queryClient.invalidateQueries({ queryKey: ["rolemanager-user_roles"] });
    },
    onError: (err: any) => toast.error("Failed to revoke role: " + err.message),
  });

  if (usersLoading || rolesLoading) {
    return <div className="p-6 text-center">Loading role management...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Assigned Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const rolesForUser = userRoles.filter((ur: any) => ur.user_id === u.id);
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    {u.first_name || u.last_name
                      ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                      : u.email}
                  </TableCell>
                  <TableCell>
                    {rolesForUser.length === 0 && <span className="text-gray-400">No roles</span>}
                    {rolesForUser.map((ur: any) => {
                      const roleObj = roles.find((r: any) => r.id === ur.role_id);
                      return (
                        <Badge key={ur.role_id} className="mr-2">
                          {roleObj?.name || ur.role_id}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-1 p-0 h-4 w-4"
                            onClick={() => revokeRole.mutate({ userId: u.id, roleId: ur.role_id })}
                            title="Revoke"
                          >✕</Button>
                        </Badge>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    <select
                      value=""
                      onChange={(e) => assignRole.mutate({ userId: u.id, roleId: e.target.value })}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Assign role...</option>
                      {roles.map((r: any) => (
                        !rolesForUser.some((ur: any) => ur.role_id === r.id) && (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        )
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
