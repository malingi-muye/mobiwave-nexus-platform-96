
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Check, AlertCircle, Zap, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ServiceActivity {
  id: string;
  action: string;
  created_at: string;
  table_name: string | null;
  record_id: string | null;
  old_data: any | null;
  new_data: any | null;
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

function downloadCSV(rows: ServiceActivity[]) {
  const headers = ["Date", "Action", "Service/Table", "Record ID"];
  const csvContent =
    headers.join(",") +
    "\n" +
    rows
      .map(
        (item) =>
          [
            `"${formatTime(item.created_at)}"`,
            `"${item.action}"`,
            `"${(item.table_name || "").replace(/_/g, " ")}"`,
            `"${item.record_id || ""}"`
          ].join(",")
      )
      .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "service_activity_log.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success("Activity log downloaded");
}

export function ServiceActivityLog() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["service-activity-log", user?.id],
    queryFn: async (): Promise<ServiceActivity[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("system_audit_logs")
        .select("id, action, created_at, table_name, record_id, old_data, new_data")
        .eq("user_id", user.id)
        .or("table_name.eq.user_service_activations,table_name.eq.user_service_subscriptions,table_name.eq.service_activation_requests")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    }
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((item) => item.action?.toLowerCase() === filter);
  }, [data, filter]);

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
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2">
          <label className="text-sm flex items-center gap-2">
            Filter by Action:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm ml-1"
            >
              <option value="all">All</option>
              <option value="activate">Activated</option>
              <option value="deactivate">Deactivated</option>
              <option value="update">Updated</option>
              <option value="create">Created</option>
              <option value="request">Requested</option>
            </select>
          </label>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto flex items-center gap-2"
            onClick={() => downloadCSV(filteredData)}
            disabled={filteredData.length === 0}
          >
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Service/Table</TableHead>
              <TableHead>Record ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
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
                  <TableCell className="text-xs">{item.record_id && item.record_id !== "null" ? item.record_id : "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
