
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

interface EnhancedUserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  userTypeFilter: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onUserTypeFilterChange: (value: string) => void;
}

export function EnhancedUserFilters({ 
  searchTerm, 
  roleFilter, 
  userTypeFilter,
  onSearchChange, 
  onRoleFilterChange,
  onUserTypeFilterChange 
}: EnhancedUserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users, emails, names, or client IDs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white shadow-sm"
        />
      </div>
      
      <Select value={userTypeFilter} onValueChange={onUserTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-white shadow-sm">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="real">Real Users</SelectItem>
          <SelectItem value="demo">Demo Users</SelectItem>
          <SelectItem value="mspace_client">Mspace Clients</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-full sm:w-48 bg-white shadow-sm">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
