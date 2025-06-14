
import React from 'react';
import { SidebarHeader } from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";

export function ClientSidebarHeader() {
  return (
    <SidebarHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Communications Hub
          </h2>
          <p className="text-sm text-muted-foreground font-medium">Client Portal</p>
        </div>
      </div>
    </SidebarHeader>
  );
}
