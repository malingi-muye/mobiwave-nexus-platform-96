
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings,
  CreditCard,
  User,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  Hash,
  Target,
  Receipt,
  Crown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
}

const iconMap: Record<string, any> = {
  'LayoutDashboard': LayoutDashboard,
  'MessageSquare': MessageSquare,
  'Mail': Mail,
  'Phone': Phone,
  'Hash': Hash,
  'FileText': FileText,
  'CreditCard': CreditCard,
  'Target': Target,
  'Receipt': Receipt,
  'Settings': Settings,
  'Users': Users,
  'BarChart3': BarChart3
};

// Mock services data since user_services table doesn't exist
const mockUserServices: Service[] = [
  {
    id: '1',
    name: 'Dashboard',
    description: 'Main dashboard',
    icon: 'LayoutDashboard',
    route: '/dashboard',
    is_active: true,
    is_premium: false
  },
  {
    id: '2',
    name: 'Bulk SMS',
    description: 'Send bulk SMS',
    icon: 'MessageSquare',
    route: '/sms',
    is_active: true,
    is_premium: false
  },
  {
    id: '3',
    name: 'Bulk Email',
    description: 'Send bulk emails',
    icon: 'Mail',
    route: '/email-campaigns',
    is_active: true,
    is_premium: false
  },
  {
    id: '4',
    name: 'WhatsApp',
    description: 'WhatsApp messaging',
    icon: 'Phone',
    route: '/whatsapp-campaigns',
    is_active: true,
    is_premium: true
  },
  {
    id: '5',
    name: 'Surveys',
    description: 'Create surveys',
    icon: 'FileText',
    route: '/survey-builder',
    is_active: true,
    is_premium: false
  },
  {
    id: '6',
    name: 'M-Pesa',
    description: 'Payment integration',
    icon: 'CreditCard',
    route: '/billing',
    is_active: true,
    is_premium: true
  },
  {
    id: '7',
    name: 'Account Settings',
    description: 'Account configuration',
    icon: 'Settings',
    route: '/settings',
    is_active: true,
    is_premium: false
  }
];

export function ClientSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Use mock data instead of querying non-existent table
  const userServices = mockUserServices;
  const isLoading = false;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || MessageSquare;
    return IconComponent;
  };

  // Group services by category
  const messagingServices = userServices.filter(service => 
    ['Bulk SMS', 'Bulk Email', 'WhatsApp', 'USSD', 'Short Codes'].includes(service.name)
  );

  const campaignServices = userServices.filter(service => 
    ['Surveys', 'Campaigns'].includes(service.name)
  );

  const billingServices = userServices.filter(service => 
    ['M-Pesa', 'Billing'].includes(service.name)
  );

  const settingsServices = userServices.filter(service => 
    ['Account Settings'].includes(service.name)
  );

  const dashboardService = userServices.find(service => service.name === 'Dashboard');

  if (isLoading) {
    return (
      <Sidebar className="border-r-0 shadow-xl bg-gradient-to-b from-blue-50 to-indigo-50">
        <SidebarHeader className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r-0 shadow-xl bg-gradient-to-b from-blue-50 to-indigo-50">
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
      
      <SidebarContent className="p-4 bg-gradient-to-b from-blue-50/30 to-indigo-50/30 backdrop-blur-sm">
        {/* Main Dashboard */}
        {dashboardService && (
          <SidebarGroup className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
              Overview
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(dashboardService.route)}
                    className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                  >
                    <Link to={dashboardService.route} className="flex items-center space-x-3 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{dashboardService.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Messaging Services */}
        {messagingServices.length > 0 && (
          <SidebarGroup className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
              Communications
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center space-x-3 p-3 rounded-xl w-full">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">Messaging</span>
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 mt-2 space-y-1">
                        {messagingServices.map((service) => {
                          const IconComponent = getIcon(service.icon);
                          return (
                            <SidebarMenuSubItem key={service.id}>
                              <SidebarMenuSubButton asChild isActive={isActive(service.route)}>
                                <Link to={service.route} className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{service.name}</span>
                                  {service.is_premium && <Crown className="w-3 h-3 text-yellow-600" />}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Campaign Services */}
        {campaignServices.length > 0 && (
          <SidebarGroup className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
              Campaigns
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {campaignServices.map((service) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <SidebarMenuItem key={service.id}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(service.route)}
                        className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                      >
                        <Link to={service.route} className="flex items-center space-x-3 p-3 rounded-xl">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{service.name}</span>
                          {service.is_premium && <Crown className="w-3 h-3 text-yellow-600" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Contacts - Always show if user has messaging services */}
        {messagingServices.length > 0 && (
          <SidebarGroup className="mb-6">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive('/contacts')}
                    className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                  >
                    <Link to="/contacts" className="flex items-center space-x-3 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Contacts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Analytics - Always show if user has any messaging services */}
        {messagingServices.length > 0 && (
          <SidebarGroup className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
              Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive('/analytics')}
                    className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                  >
                    <Link to="/analytics" className="flex items-center space-x-3 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Campaign Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Account Services */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {billingServices.map((service) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <SidebarMenuItem key={service.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(service.route)}
                      className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                    >
                      <Link to={service.route} className="flex items-center space-x-3 p-3 rounded-xl">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{service.name}</span>
                        {service.is_premium && <Crown className="w-3 h-3 text-yellow-600" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive('/profile')}
                  className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                >
                  <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl">
                    <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Profile Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {settingsServices.map((service) => {
                const IconComponent = getIcon(service.icon);
                return (
                  <SidebarMenuItem key={service.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(service.route)}
                      className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                    >
                      <Link to={service.route} className="flex items-center space-x-3 p-3 rounded-xl">
                        <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
