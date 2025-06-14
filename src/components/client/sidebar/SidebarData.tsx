import React from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  CreditCard, 
  Settings, 
  Phone,
  Mail,
  FileText,
  Headphones,
  Gift,
  ShoppingCart,
  CheckSquare
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  title: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  submenu?: SidebarItem[];
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'messaging',
    title: 'Communication',
    items: [
      {
        id: 'bulk-sms',
        title: "Bulk SMS",
        label: "Bulk SMS",
        icon: <Phone className="w-5 h-5" />,
        href: "/bulk-sms"
      },
      {
        id: 'email-campaigns',
        title: "Email Campaigns", 
        label: "Email Campaigns",
        icon: <Mail className="w-5 h-5" />,
        href: "/email-campaigns"
      },
      {
        id: 'whatsapp',
        title: "WhatsApp",
        label: "WhatsApp",
        icon: <MessageSquare className="w-5 h-5" />,
        href: "/whatsapp-campaigns"
      }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    items: [
      {
        id: 'browse-services',
        title: "Browse Services",
        label: "Browse Services",
        icon: <ShoppingCart className="w-5 h-5" />,
        href: "/services"
      },
      {
        id: 'my-subscriptions',
        title: "My Subscriptions",
        label: "My Subscriptions",
        icon: <CheckSquare className="w-5 h-5" />,
        href: "/my-subscriptions"
      }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    items: [
      {
        id: 'contacts',
        title: "Contacts",
        label: "Contacts",
        icon: <Users className="w-5 h-5" />,
        href: "/contacts"
      },
      {
        id: 'analytics',
        title: "Analytics",
        label: "Analytics",
        icon: <BarChart3 className="w-5 h-5" />,
        href: "/analytics"
      },
      {
        id: 'surveys',
        title: "Surveys",
        label: "Surveys",
        icon: <FileText className="w-5 h-5" />,
        href: "/surveys"
      }
    ]
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'billing',
        title: "Billing",
        label: "Billing",
        icon: <CreditCard className="w-5 h-5" />,
        href: "/billing"
      },
      {
        id: 'support',
        title: "Support",
        label: "Support",
        icon: <Headphones className="w-5 h-5" />,
        href: "/support"
      },
      {
        id: 'settings',
        title: "Settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        href: "/settings"
      }
    ]
  }
];

// Keep legacy export for backward compatibility
export const sidebarData = sidebarSections.flatMap(section => section.items);
