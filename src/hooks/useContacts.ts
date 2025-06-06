
import { useContactsData } from './contacts/useContactsData';
import { useContactGroups } from './contacts/useContactGroups';
import { useContactMutations } from './contacts/useContactMutations';

export const useContacts = () => {
  const { data: contacts, isLoading: contactsLoading, error: contactsError, refetch: refetchContacts } = useContactsData();
  const { contactGroups, isLoading: groupsLoading, error: groupsError, createContactGroup, refetch: refetchGroups } = useContactGroups();
  const { createContact, updateContact, deleteContact, importContacts, mergeContacts } = useContactMutations();

  return {
    contacts: contacts || [],
    contactGroups,
    isLoading: contactsLoading || groupsLoading,
    error: contactsError || groupsError,
    createContact,
    updateContact,
    deleteContact,
    createContactGroup,
    importContacts,
    mergeContacts,
    refetch: () => {
      refetchContacts();
      refetchGroups();
    }
  };
};

export type { Contact } from './contacts/useContactsData';
export type { ContactGroup } from './contacts/useContactGroups';
