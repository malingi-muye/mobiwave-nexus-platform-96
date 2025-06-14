
import React from 'react';
import { SidebarSection } from './SidebarData';
import { MenuItem } from './MenuItem';

interface SidebarGroupProps {
  section: SidebarSection;
  currentPath: string;
}

export function SidebarGroup({ section, currentPath }: SidebarGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {section.title}
      </h3>
      <nav className="space-y-1">
        {section.items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>
    </div>
  );
}
