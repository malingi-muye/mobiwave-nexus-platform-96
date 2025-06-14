
import React from 'react';
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Users, BarChart3, User } from "lucide-react";
import { ClientSidebarHeader } from './sidebar/SidebarHeader';
import { SidebarGroupWrapper } from './sidebar/SidebarGroup';
import { MenuList } from './sidebar/MenuItem';
import { MessagingMenu } from './sidebar/MessagingMenu';
import { mockUserServices, getServicesByCategory, getIcon } from './sidebar/SidebarData';

export function ClientSidebar() {
  const location = useLocation();
  const isLoading = false;

  const isActive = (path: string) => location.pathname === path;

  const userServices = mockUserServices;
  const {
    dashboard,
    messaging,
    campaigns,
    billing,
    settings
  } = getServicesByCategory(userServices);

  if (isLoading) {
    return (
      <Sidebar className="border-r-0 shadow-xl bg-gradient-to-b from-blue-50 to-indigo-50">
        <ClientSidebarHeader />
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
      <ClientSidebarHeader />
      
      <SidebarContent className="p-4 bg-gradient-to-b from-blue-50/30 to-indigo-50/30 backdrop-blur-sm">
        {/* Main Dashboard */}
        {dashboard && (
          <SidebarGroupWrapper label="Overview">
            <MenuList 
              items={[{ ...dashboard, color: 'bg-blue-500' }]} 
              isActive={isActive} 
              getIcon={getIcon} 
            />
          </SidebarGroupWrapper>
        )}

        {/* Messaging Services */}
        {messaging.length > 0 && (
          <SidebarGroupWrapper label="Communications">
            <MessagingMenu 
              services={messaging} 
              isActive={isActive} 
              getIcon={getIcon} 
            />
          </SidebarGroupWrapper>
        )}

        {/* Campaign Services */}
        {campaigns.length > 0 && (
          <SidebarGroupWrapper label="Campaigns">
            <MenuList 
              items={campaigns.map(s => ({ ...s, color: 'bg-purple-500' }))} 
              isActive={isActive} 
              getIcon={getIcon} 
            />
          </SidebarGroupWrapper>
        )}

        {/* Contacts */}
        {messaging.length > 0 && (
          <SidebarGroupWrapper label="">
            <MenuList 
              items={[{
                id: 'contacts',
                name: 'Contacts',
                icon: 'Users',
                route: '/contacts',
                is_premium: false,
                color: 'bg-indigo-500'
              }]} 
              isActive={isActive} 
              getIcon={getIcon} 
            />
          </SidebarGroupWrapper>
        )}

        {/* Analytics */}
        {messaging.length > 0 && (
          <SidebarGroupWrapper label="Analytics">
            <MenuList 
              items={[{
                id: 'analytics',
                name: 'Campaign Analytics',
                icon: 'BarChart3',
                route: '/analytics',
                is_premium: false,
                color: 'bg-orange-500'
              }]} 
              isActive={isActive} 
              getIcon={getIcon} 
            />
          </SidebarGroupWrapper>
        )}

        {/* Account Services */}
        <SidebarGroupWrapper label="Account">
          <MenuList 
            items={[
              ...billing.map(s => ({ ...s, color: 'bg-emerald-500' })),
              {
                id: 'profile',
                name: 'Profile Settings',
                icon: 'Settings',
                route: '/profile',
                is_premium: false,
                color: 'bg-slate-500'
              },
              ...settings.map(s => ({ ...s, color: 'bg-gray-500' }))
            ]} 
            isActive={isActive} 
            getIcon={getIcon} 
          />
        </SidebarGroupWrapper>
      </SidebarContent>
    </Sidebar>
  );
}
