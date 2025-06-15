
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarSections } from './sidebar/SidebarData';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useActivatedServiceTypes } from './sidebar/ServiceSidebarVisibility';

export function ClientSidebar() {
  const location = useLocation();
  const { data: credits } = useUserCredits();
  const { activatedTypes, isLoading } = useActivatedServiceTypes();

  // Only show service menu items in sidebar when the service is ACTIVATED
  function filterSidebarSections(sections) {
    return sections.map(section => {
      if (section.id !== 'services') {
        return section;
      }
      return {
        ...section,
        items: section.items.filter(item =>
          // Show if service doesn't require activation filtering (i.e. it's not a typed catalog service)
          !item.id ||
          // For eligible menu items, check activation
          activatedTypes.has(item.id)
        )
      };
    });
  }

  const filteredSections = filterSidebarSections(sidebarSections);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <SidebarHeader />
      <ScrollArea className="flex-1 px-2">
        <div className="py-4">
          {filteredSections.map((section) =>
            <SidebarGroup
              key={section.id}
              section={section}
              currentPath={location.pathname}
            />
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Available Credits</div>
          <div className="text-lg font-bold text-green-600">
            ${credits?.credits_remaining?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>
    </div>
  );
}
