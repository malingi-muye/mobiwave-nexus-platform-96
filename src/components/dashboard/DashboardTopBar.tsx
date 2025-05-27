
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User } from 'lucide-react';

export function DashboardTopBar() {
  return (
    <header className="h-16 border-b bg-white/70 backdrop-blur-md flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="hover:bg-gray-100 transition-colors" />
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Live
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>🏢 Acme Corporation</option>
            <option>🚀 TechCorp Ltd</option>
            <option>🌍 Global Enterprises</option>
          </select>
        </div>
        
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500 animate-pulse">
            3
          </Badge>
        </Button>
        
        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
          <Avatar className="w-9 h-9 shadow-md">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@company.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
