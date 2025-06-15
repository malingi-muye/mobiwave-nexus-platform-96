
import { useMemo, useState } from 'react';

interface UserServiceSubscription {
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

export const useServiceFilters = (userSubscriptions: UserServiceSubscription[], users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  const filteredSubscriptions = useMemo(() => {
    return userSubscriptions.filter(subscription => {
      const user = users.find(u => u.id === subscription.user_id);
      const userEmail = user?.email || '';
      const userName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
      
      const matchesSearch = searchTerm === '' || 
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.service.service_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
      const matchesServiceType = serviceTypeFilter === 'all' || subscription.service.service_type === serviceTypeFilter;

      return matchesSearch && matchesStatus && matchesServiceType;
    });
  }, [userSubscriptions, users, searchTerm, statusFilter, serviceTypeFilter]);

  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(userSubscriptions.map(sub => sub.status))];
    return statuses.filter(Boolean);
  }, [userSubscriptions]);

  const availableServiceTypes = useMemo(() => {
    const types = [...new Set(userSubscriptions.map(sub => sub.service.service_type))];
    return types.filter(Boolean);
  }, [userSubscriptions]);

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
};
