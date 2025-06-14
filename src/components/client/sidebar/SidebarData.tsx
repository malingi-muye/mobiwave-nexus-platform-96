
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
  HelpCircle,
  Gift,
  Headphones,
  Zap,
  DollarSign,
  Grid3X3
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export const sidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    group: 'main'
  },
  {
    title: 'Messaging',
    icon: MessageSquare,
    group: 'messaging',
    submenu: [
      {
        title: 'SMS Campaigns',
        path: '/bulk-sms',
        icon: Smartphone
      },
      {
        title: 'WhatsApp',
        path: '/whatsapp',
        icon: MessageCircle
      },
      {
        title: 'Email Campaigns',
        path: '/email',
        icon: Mail
      }
    ]
  },
  {
    title: 'Surveys & Forms',
    path: '/surveys',
    icon: FileText,
    group: 'services'
  },
  {
    title: 'Service Desk',
    path: '/service-desk',
    icon: Headphones,
    group: 'services'
  },
  {
    title: 'Rewards System',
    path: '/rewards',
    icon: Gift,
    group: 'services'
  },
  {
    title: 'Services',
    icon: Grid3X3,
    group: 'services',
    submenu: [
      {
        title: 'USSD Services',
        path: '/ussd',
        icon: Smartphone
      },
      {
        title: 'M-Pesa Integration',
        path: '/mpesa',
        icon: DollarSign
      },
      {
        title: 'My Subscriptions',
        path: '/subscriptions',
        icon: Zap
      }
    ]
  },
  {
    title: 'Contacts',
    path: '/contacts',
    icon: Users,
    group: 'management'
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    group: 'analytics'
  },
  {
    title: 'Billing',
    path: '/billing',
    icon: CreditCard,
    group: 'account'
  },
  {
    title: 'Settings',
    path: '/profile',
    icon: Settings,
    group: 'account'
  }
];

export const sidebarSections: SidebarSection[] = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />
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
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        href: '/whatsapp',
        icon: <MessageCircle className="w-5 h-5" />
      },
      {
        id: 'email',
        label: 'Email Campaigns',
        href: '/email',
        icon: <Mail className="w-5 h-5" />
      }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    items: [
      {
        id: 'surveys',
        label: 'Surveys & Forms',
        href: '/surveys',
        icon: <FileText className="w-5 h-5" />
      },
      {
        id: 'service-desk',
        label: 'Service Desk',
        href: '/service-desk',
        icon: <Headphones className="w-5 h-5" />
      },
      {
        id: 'rewards',
        label: 'Rewards System',
        href: '/rewards',
        icon: <Gift className="w-5 h-5" />
      },
      {
        id: 'ussd',
        label: 'USSD Services',
        href: '/ussd',
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: 'mpesa',
        label: 'M-Pesa Integration',
        href: '/mpesa',
        icon: <DollarSign className="w-5 h-5" />
      },
      {
        id: 'subscriptions',
        label: 'My Subscriptions',
        href: '/subscriptions',
        icon: <Zap className="w-5 h-5" />
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
        icon: <Users className="w-5 h-5" />
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
        icon: <BarChart3 className="w-5 h-5" />
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
        icon: <CreditCard className="w-5 h-5" />
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/profile',
        icon: <Settings className="w-5 h-5" />
      }
    ]
  }
];
