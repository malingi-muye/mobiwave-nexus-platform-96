
import { LucideIcon, LayoutDashboard, MessageSquare, Mail, Phone, Hash, FileText, CreditCard, Target, Receipt, Settings, Users, BarChart3 } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  is_active: boolean;
  is_premium: boolean;
  color?: string;
}

export const iconMap: Record<string, LucideIcon> = {
  'LayoutDashboard': LayoutDashboard,
  'MessageSquare': MessageSquare,
  'Mail': Mail,
  'Phone': Phone,
  'Hash': Hash,
  'FileText': FileText,
  'CreditCard': CreditCard,
  'Target': Target,
  'Receipt': Receipt,
  'Settings': Settings,
  'Users': Users,
  'BarChart3': BarChart3
};

export const mockUserServices: Service[] = [
  {
    id: '1',
    name: 'Dashboard',
    description: 'Main dashboard',
    icon: 'LayoutDashboard',
    route: '/dashboard',
    is_active: true,
    is_premium: false,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Bulk SMS',
    description: 'Send bulk SMS',
    icon: 'MessageSquare',
    route: '/bulk-sms',
    is_active: true,
    is_premium: false,
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Bulk Email',
    description: 'Send bulk emails',
    icon: 'Mail',
    route: '/email-campaigns',
    is_active: true,
    is_premium: false,
    color: 'bg-blue-500'
  },
  {
    id: '4',
    name: 'WhatsApp',
    description: 'WhatsApp messaging',
    icon: 'Phone',
    route: '/whatsapp-campaigns',
    is_active: true,
    is_premium: true,
    color: 'bg-green-500'
  },
  {
    id: '5',
    name: 'Surveys',
    description: 'Create surveys',
    icon: 'FileText',
    route: '/surveys',
    is_active: true,
    is_premium: false,
    color: 'bg-purple-500'
  },
  {
    id: '6',
    name: 'M-Pesa',
    description: 'Payment integration',
    icon: 'CreditCard',
    route: '/billing',
    is_active: true,
    is_premium: true,
    color: 'bg-emerald-500'
  },
  {
    id: '7',
    name: 'Account Settings',
    description: 'Account configuration',
    icon: 'Settings',
    route: '/settings',
    is_active: true,
    is_premium: false,
    color: 'bg-gray-500'
  }
];

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || MessageSquare;
}

export function getServicesByCategory(services: Service[]) {
  return {
    dashboard: services.find(service => service.name === 'Dashboard'),
    messaging: services.filter(service => 
      ['Bulk SMS', 'Bulk Email', 'WhatsApp', 'USSD', 'Short Codes'].includes(service.name)
    ),
    campaigns: services.filter(service => 
      ['Surveys', 'Campaigns'].includes(service.name)
    ),
    billing: services.filter(service => 
      ['M-Pesa', 'Billing'].includes(service.name)
    ),
    settings: services.filter(service => 
      ['Account Settings'].includes(service.name)
    )
  };
}
