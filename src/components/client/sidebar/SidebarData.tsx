import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  CreditCard,
  MessageCircle,
  Mail,
  Smartphone,
  FileText,
  Headphones,
  Zap,
  DollarSign,
  Package
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  color?: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

// These are the canonical types for services in the catalog
export const ACTIVATION_REQUIRED_SERVICE_TYPES = [
  'surveys',   // will map to /surveys
  'ussd',      // will map to /ussd
  'mpesa',
  'servicedesk',
  'rewards',
  'whatsapp',
  'sms',
  // ... add more if catalog grows
];

// On the "services" section: Remove survey-builder if not required, deduplicate surveys tab
export const sidebarSections: SidebarSection[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        color: 'bg-blue-500'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging',
    items: [
      {
        id: 'bulk-sms',
        label: 'SMS Campaigns',
        href: '/bulk-sms',
        icon: <Smartphone className="w-5 h-5" />,
        color: 'bg-green-500'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        href: '/whatsapp',
        icon: <MessageCircle className="w-5 h-5" />,
        color: 'bg-green-600'
      },
      {
        id: 'email',
        label: 'Email Campaigns',
        href: '/email',
        icon: <Mail className="w-5 h-5" />,
        color: 'bg-red-500'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    items: [
      {
        id: 'my-services',
        label: 'My Services',
        href: '/my-services',
        icon: <Package className="w-5 h-5" />,
        color: 'bg-gray-600'
      },
      {
        id: 'surveys',
        label: 'Surveys & Forms',
        href: '/surveys',
        icon: <FileText className="w-5 h-5" />,
        color: 'bg-purple-500'
      },
      {
        id: 'service-desk',
        label: 'Service Desk',
        href: '/service-desk',
        icon: <Headphones className="w-5 h-5" />,
        color: 'bg-orange-500'
      },
      {
        id: 'ussd',
        label: 'USSD Services',
        href: '/ussd',
        icon: <Smartphone className="w-5 h-5" />,
        color: 'bg-indigo-500'
      },
      {
        id: 'mpesa',
        label: 'M-Pesa Integration',
        href: '/mpesa',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'bg-emerald-500'
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
        href: '/contacts',
        icon: <Users className="w-5 h-5" />,
        color: 'bg-cyan-500'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'bg-blue-600'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'billing',
        label: 'Billing',
        href: '/billing',
        icon: <CreditCard className="w-5 h-5" />,
        color: 'bg-pink-500'
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/profile',
        icon: <Settings className="w-5 h-5" />,
        color: 'bg-gray-500'
      }
    ]
  }
];

// Legacy export for backward compatibility
export const sidebarData = sidebarSections.flatMap(section => 
  section.items.map(item => ({
    title: item.label,
    path: item.href,
    icon: item.icon,
    group: section.id
  }))
);
