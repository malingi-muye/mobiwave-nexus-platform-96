
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Users, Merge, X } from 'lucide-react';
import { Contact } from '@/hooks/useContacts';

interface DuplicateGroup {
  id: string;
  contacts: Contact[];
  duplicateType: 'phone' | 'email' | 'name';
}

interface ContactDuplicateDetectorProps {
  contacts: Contact[];
  onMergeContacts: (keepContact: Contact, duplicateIds: string[]) => Promise<void>;
}

export function ContactDuplicateDetector({ contacts, onMergeContacts }: ContactDuplicateDetectorProps) {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [isMerging, setIsMerging] = useState(false);

  useEffect(() => {
    detectDuplicates();
  }, [contacts]);

  const detectDuplicates = () => {
    const groups: DuplicateGroup[] = [];
    const processed = new Set<string>();

    // Detect phone number duplicates
    const phoneGroups = new Map<string, Contact[]>();
    contacts.forEach(contact => {
      if (!processed.has(contact.id) && contact.phone) {
        const normalizedPhone = contact.phone.replace(/\D/g, '');
        if (!phoneGroups.has(normalizedPhone)) {
          phoneGroups.set(normalizedPhone, []);
        }
        phoneGroups.get(normalizedPhone)!.push(contact);
      }
    });

    phoneGroups.forEach((groupContacts, phone) => {
      if (groupContacts.length > 1) {
        groups.push({
          id: `phone-${phone}`,
          contacts: groupContacts,
          duplicateType: 'phone'
        });
        groupContacts.forEach(contact => processed.add(contact.id));
      }
    });

    // Detect email duplicates
    const emailGroups = new Map<string, Contact[]>();
    contacts.forEach(contact => {
      if (!processed.has(contact.id) && contact.email) {
        const normalizedEmail = contact.email.toLowerCase().trim();
        if (!emailGroups.has(normalizedEmail)) {
          emailGroups.set(normalizedEmail, []);
        }
        emailGroups.get(normalizedEmail)!.push(contact);
      }
    });

    emailGroups.forEach((groupContacts, email) => {
      if (groupContacts.length > 1) {
        groups.push({
          id: `email-${email}`,
          contacts: groupContacts,
          duplicateType: 'email'
        });
        groupContacts.forEach(contact => processed.add(contact.id));
      }
    });

    // Detect name duplicates
    const nameGroups = new Map<string, Contact[]>();
    contacts.forEach(contact => {
      if (!processed.has(contact.id) && contact.first_name && contact.last_name) {
        const normalizedName = `${contact.first_name.toLowerCase().trim()}-${contact.last_name.toLowerCase().trim()}`;
        if (!nameGroups.has(normalizedName)) {
          nameGroups.set(normalizedName, []);
        }
        nameGroups.get(normalizedName)!.push(contact);
      }
    });

    nameGroups.forEach((groupContacts, name) => {
      if (groupContacts.length > 1) {
        groups.push({
          id: `name-${name}`,
          contacts: groupContacts,
          duplicateType: 'name'
        });
      }
    });

    setDuplicateGroups(groups);
  };

  const handleGroupSelection = (groupId: string, checked: boolean) => {
    const newSelected = new Set(selectedGroups);
    if (checked) {
      newSelected.add(groupId);
    } else {
      newSelected.delete(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const handleMergeSelected = async () => {
    if (selectedGroups.size === 0) {
      toast.error('Please select duplicate groups to merge');
      return;
    }

    setIsMerging(true);
    try {
      for (const groupId of selectedGroups) {
        const group = duplicateGroups.find(g => g.id === groupId);
        if (!group || group.contacts.length < 2) continue;

        // Use the contact with the most complete information as the primary
        const primaryContact = group.contacts.reduce((best, current) => {
          const bestScore = getCompletenessScore(best);
          const currentScore = getCompletenessScore(current);
          return currentScore > bestScore ? current : best;
        });

        const duplicateIds = group.contacts
          .filter(c => c.id !== primaryContact.id)
          .map(c => c.id);

        await onMergeContacts(primaryContact, duplicateIds);
      }

      toast.success(`Merged ${selectedGroups.size} duplicate groups`);
      setSelectedGroups(new Set());
      detectDuplicates();
    } catch (error) {
      console.error('Merge error:', error);
      toast.error('Failed to merge some contacts');
    } finally {
      setIsMerging(false);
    }
  };

  const getCompletenessScore = (contact: Contact): number => {
    let score = 0;
    if (contact.first_name) score += 1;
    if (contact.last_name) score += 1;
    if (contact.email) score += 1;
    if (contact.tags && contact.tags.length > 0) score += 1;
    if (contact.custom_fields && Object.keys(contact.custom_fields).length > 0) score += 1;
    return score;
  };

  const getDuplicateTypeColor = (type: string) => {
    switch (type) {
      case 'phone': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'name': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (duplicateGroups.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Duplicate Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 text-center py-4">
            No duplicate contacts found! 🎉
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Duplicate Detection
          </span>
          <Badge variant="secondary">
            {duplicateGroups.length} groups found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Select duplicate groups to merge:
          </p>
          <Button
            onClick={handleMergeSelected}
            disabled={selectedGroups.size === 0 || isMerging}
            variant="outline"
          >
            <Merge className="w-4 h-4 mr-2" />
            Merge Selected ({selectedGroups.size})
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-auto">
          {duplicateGroups.map((group) => (
            <div key={group.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedGroups.has(group.id)}
                    onCheckedChange={(checked) => 
                      handleGroupSelection(group.id, checked as boolean)
                    }
                  />
                  <Badge className={getDuplicateTypeColor(group.duplicateType)}>
                    {group.duplicateType} duplicate
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {group.contacts.length} contacts
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {group.contacts.map((contact, index) => (
                  <div 
                    key={contact.id} 
                    className={`text-sm p-2 rounded ${
                      index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {contact.first_name || contact.last_name 
                          ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                          : 'No name'
                        }
                      </span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="text-gray-600">
                      Phone: {contact.phone} | Email: {contact.email || 'None'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
