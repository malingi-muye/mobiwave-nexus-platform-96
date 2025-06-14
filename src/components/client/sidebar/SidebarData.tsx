
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
