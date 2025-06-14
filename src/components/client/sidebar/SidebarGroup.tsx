
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { SidebarSection } from './SidebarData';

interface SidebarGroupProps {
  section: SidebarSection;
  currentPath: string;
}

export function SidebarGroup({ section, currentPath }: SidebarGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
      >
        <span>{section.title}</span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-1 space-y-0.5">
          {section.items.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              isActive={currentPath === item.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}
