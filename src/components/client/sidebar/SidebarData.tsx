
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
  title: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: SidebarItem[];
}

export const sidebarData: SidebarItem[] = [
  {
    title: "Messaging",
    icon: <MessageSquare className="w-5 h-5" />,
    submenu: [
      {
        title: "Bulk SMS",
        icon: <Phone className="w-4 h-4" />,
        href: "/bulk-sms"
      },
      {
        title: "Email Campaigns", 
        icon: <Mail className="w-4 h-4" />,
        href: "/email-campaigns"
      },
      {
        title: "WhatsApp",
        icon: <MessageSquare className="w-4 h-4" />,
        href: "/whatsapp-campaigns"
      }
    ]
  },
  {
    title: "Services",
    icon: <ShoppingCart className="w-5 h-5" />,
    submenu: [
      {
        title: "Browse Services",
        icon: <ShoppingCart className="w-4 h-4" />,
        href: "/services"
      },
      {
        title: "My Subscriptions",
        icon: <CheckSquare className="w-4 h-4" />,
        href: "/my-subscriptions"
      }
    ]
  },
  {
    title: "Contacts",
    icon: <Users className="w-5 h-5" />,
    href: "/contacts"
  },
  {
    title: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/analytics"
  },
  {
    title: "Surveys",
    icon: <FileText className="w-5 h-5" />,
    href: "/surveys"
  },
  {
    title: "Billing",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/billing"
  },
  {
    title: "Support",
    icon: <Headphones className="w-5 h-5" />,
    href: "/support"
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings"
  }
];
