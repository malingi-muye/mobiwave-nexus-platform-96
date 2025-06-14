
import { useState, useMemo } from 'react';

interface ServiceSubscription {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  service: {
    id: string;
    service_name: string;
    service_type: string;
  };
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export function useServiceFilters(subscriptions: ServiceSubscription[], users: User[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(subscription => {
      const user = users.find(u => u.id === subscription.user_id);
      const userEmail = user?.email || '';
      const userName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
      const serviceName = subscription.service.service_name.toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userName.includes(searchTerm.toLowerCase()) ||
        serviceName.includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
      const matchesServiceType = serviceTypeFilter === 'all' || subscription.service.service_type === serviceTypeFilter;

      return matchesSearch && matchesStatus && matchesServiceType;
    });
  }, [subscriptions, users, searchTerm, statusFilter, serviceTypeFilter]);

  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(subscriptions.map(s => s.status))];
    return statuses;
  }, [subscriptions]);

  const availableServiceTypes = useMemo(() => {
    const types = [...new Set(subscriptions.map(s => s.service.service_type))];
    return types;
  }, [subscriptions]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    serviceTypeFilter,
    setServiceTypeFilter,
    filteredSubscriptions,
    availableStatuses,
    availableServiceTypes
  };
}
