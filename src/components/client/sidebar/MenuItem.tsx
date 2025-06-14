
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { SidebarItem } from './SidebarData';

interface MenuItemProps {
  item: SidebarItem;
  isActive: boolean;
}

export function MenuItem({ item, isActive }: MenuItemProps) {
  return (
    <Link
      to={item.href}
      className={`
        group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-2
        ${isActive 
          ? 'bg-blue-50 text-blue-700 shadow-sm' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${item.color || 'bg-gray-400'} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
          <div className="text-white [&>svg]:w-4 [&>svg]:h-4">
            {item.icon}
          </div>
        </div>
        <span className="truncate">{item.label}</span>
      </div>
      {item.badge && (
        <Badge 
          variant={isActive ? "default" : "secondary"} 
          className={`text-xs ${isActive ? 'bg-blue-600' : 'bg-gray-200 text-gray-600'}`}
        >
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}
