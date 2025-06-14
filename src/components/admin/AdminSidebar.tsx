
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { 
  Settings, 
  Shield,
  Users,
  Database,
  BarChart,
  TrendingUp,
  MessageSquare,
  Activity,
  Layers
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const adminSidebarItems = [
  { title: "Admin Dashboard", icon: Shield, badge: null, path: "/admin", color: "bg-red-500" },
  { title: "User Management", icon: Users, badge: null, path: "/admin/users", color: "bg-blue-500" },
  { title: "Services Management", icon: Layers, badge: null, path: "/admin/services", color: "bg-purple-500" },
  { title: "System Settings", icon: Settings, badge: null, path: "/admin/settings", color: "bg-gray-500" },
  { title: "Database Admin", icon: Database, badge: null, path: "/admin/database", color: "bg-green-500" },
  { title: "Analytics", icon: BarChart, badge: null, path: "/admin/analytics", color: "bg-purple-500" },
  { title: "Revenue Reports", icon: TrendingUp, badge: null, path: "/admin/revenue", color: "bg-yellow-500" },
  { title: "System Logs", icon: MessageSquare, badge: null, path: "/admin/logs", color: "bg-indigo-500" },
  { title: "Security Center", icon: Shield, badge: "New", path: "/admin/security-center", color: "bg-red-600" },
  { title: "System Health", icon: Activity, badge: null, path: "/admin/system-health", color: "bg-green-600" },
  { title: "Monitoring", icon: Activity, badge: "Live", path: "/admin/monitoring", color: "bg-orange-500" },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6 border-b bg-red-50/70 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Admin Portal
            </h2>
            <p className="text-sm text-muted-foreground font-medium">System Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 bg-red-50/30 backdrop-blur-sm">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
            Administration
          </p>
        </div>
        
        <SidebarMenu className="space-y-2">
          {adminSidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  className="w-full justify-between group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                >
                  <div 
                    className="flex items-center justify-between w-full cursor-pointer p-3 rounded-xl"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="destructive"
                        className="text-xs bg-red-500 text-white"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
