
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

interface SubscriptionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  serviceTypeFilter: string;
  setServiceTypeFilter: (type: string) => void;
  availableStatuses: string[];
  availableServiceTypes: string[];
}

export function SubscriptionFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  serviceTypeFilter,
  setServiceTypeFilter,
  availableStatuses,
  availableServiceTypes
}: SubscriptionFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users or services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {availableStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {availableServiceTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
