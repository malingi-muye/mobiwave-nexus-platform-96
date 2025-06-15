
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Check, AlertCircle, Zap, Clock } from "lucide-react";

interface ServiceActivity {
  id: string;
  action: string;
  created_at: string;
  table_name: string | null;
  record_id: string | null;
  old_data: any | null;
  new_data: any | null;
  status: string | null;
}

const ACTION_LABELS: Record<string, { label: string; color: string; Icon: React.FC<any> }> = {
  activate: { label: "Activated", color: "bg-green-100 text-green-700", Icon: Check },
  deactivate: { label: "Deactivated", color: "bg-yellow-100 text-yellow-700", Icon: AlertCircle },
  update: { label: "Updated", color: "bg-blue-100 text-blue-700", Icon: Settings },
  create: { label: "Created", color: "bg-gray-100 text-gray-700", Icon: Zap },
  request: { label: "Requested", color: "bg-purple-100 text-purple-700", Icon: Clock }
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export function ServiceActivityLog() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["service-activity-log", user?.id],
    queryFn: async (): Promise<ServiceActivity[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("system_audit_logs")
        .select("id, action, created_at, table_name, record_id, old_data, new_data, status")
        .eq("user_id", user.id)
        .or("table_name.eq.user_service_activations,table_name.eq.user_service_subscriptions,table_name.eq.service_activation_requests")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    }
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">Please sign in to view your activity log.</CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">Loading activity log...</CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-600">Failed to load activity log.</CardContent>
      </Card>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-400">
          No recent service activity found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          My Service Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Service/Table</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const actionKey = item.action?.toLowerCase();
              const meta = ACTION_LABELS[actionKey] || { label: item.action, color: "bg-gray-100 text-gray-700", Icon: Zap };
              return (
                <TableRow key={item.id}>
                  <TableCell className="text-xs">{formatTime(item.created_at)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded ${meta.color}`}>
                      <meta.Icon className="w-4 h-4" />
                      {meta.label}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{item.table_name?.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.status || "-"}
                    </Badge>
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
