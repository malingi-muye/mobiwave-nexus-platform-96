
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Crown, LucideIcon } from 'lucide-react';

interface MenuItemData {
  id: string;
  name: string;
  icon: string;
  route: string;
  is_premium: boolean;
  color: string;
}

interface MenuItemProps {
  item: MenuItemData;
  isActive: boolean;
  IconComponent: LucideIcon;
}

export function MenuItem({ item, isActive, IconComponent }: MenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className="w-full group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
      >
        <Link to={item.route} className="flex items-center space-x-3 p-3 rounded-xl">
          <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">{item.name}</span>
          {item.is_premium && <Crown className="w-3 h-3 text-yellow-600" />}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface MenuListProps {
  items: MenuItemData[];
  isActive: (path: string) => boolean;
  getIcon: (iconName: string) => LucideIcon;
}

export function MenuList({ items, isActive, getIcon }: MenuListProps) {
  return (
    <SidebarMenu className="space-y-2">
      {items.map((item) => {
        const IconComponent = getIcon(item.icon);
        return (
          <MenuItem 
            key={item.id}
            item={item}
            isActive={isActive(item.route)}
            IconComponent={IconComponent}
          />
        );
      })}
    </SidebarMenu>
  );
}
