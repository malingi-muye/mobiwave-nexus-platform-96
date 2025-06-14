
import React from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Mail, 
  MessageCircle, 
  Users, 
  CreditCard, 
  Settings, 
  User,
  Home,
  Send,
  TrendingUp,
  Phone
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/dashboard'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging',
    items: [
      {
        id: 'sms',
        label: 'SMS Campaigns',
        icon: MessageSquare,
        href: '/bulk-sms',
        badge: 'Hot'
      },
      {
        id: 'email',
        label: 'Email Campaigns',
        icon: Mail,
        href: '/email-campaigns'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: MessageCircle,
        href: '/whatsapp-campaigns'
      },
      {
        id: 'voice',
        label: 'Voice Calls',
        icon: Phone,
        href: '/voice-campaigns'
      }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    items: [
      {
        id: 'contacts',
        label: 'Contacts',
        icon: Users,
        href: '/contacts'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: TrendingUp,
        href: '/analytics'
      },
      {
        id: 'surveys',
        label: 'Surveys',
        icon: BarChart3,
        href: '/survey-builder'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'billing',
        label: 'Billing & Credits',
        icon: CreditCard,
        href: '/billing'
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: User,
        href: '/profile-settings'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        href: '/settings'
      }
    ]
  }
];
