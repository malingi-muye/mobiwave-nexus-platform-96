
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { SidebarItem } from './SidebarData';

interface MenuItemProps {
  item: SidebarItem;
  isActive: boolean;
}

export function MenuItem({ item, isActive }: MenuItemProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={`
        group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
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
