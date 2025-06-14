
import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";

interface SidebarGroupWrapperProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarGroupWrapper({ label, children, className = "mb-6" }: SidebarGroupWrapperProps) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
