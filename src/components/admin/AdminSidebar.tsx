
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Wrench,
  DollarSign,
  Zap,
  Smartphone,
  Activity,
  Brain,
  FileText,
  Key,
  Bell,
  Monitor
} from 'lucide-react';

const adminMenuItems = [
  { 
    title: 'Overview', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: 'Main dashboard overview',
    color: 'text-blue-600'
  },
  { 
    title: 'User Management', 
    href: '/admin/users', 
    icon: Users,
    description: 'Manage users and permissions',
    color: 'text-purple-600'
  },
  { 
    title: 'Services Management', 
    href: '/admin/services', 
    icon: Wrench,
    description: 'Configure platform services',
    color: 'text-orange-600'
  },
  { 
    title: 'Revenue Reports', 
    href: '/admin/revenue', 
    icon: DollarSign,
    description: 'Financial analytics and reports',
    color: 'text-green-600'
  },
  { 
    title: 'Advanced Analytics', 
    href: '/admin/analytics', 
    icon: Brain,
    description: 'AI-powered insights and predictions',
    color: 'text-indigo-600'
  },
  { 
    title: 'System Analytics', 
    href: '/admin/system-analytics', 
    icon: BarChart3,
    description: 'Platform usage analytics',
    color: 'text-cyan-600'
  },
  { 
    title: 'Security Center', 
    href: '/admin/security', 
    icon: Shield,
    description: 'Security monitoring and config',
    color: 'text-red-600'
  },
  { 
    title: 'Database Admin', 
    href: '/admin/database', 
    icon: Database,
    description: 'Database management tools',
    color: 'text-emerald-600'
  },
  { 
    title: 'System Monitoring', 
    href: '/admin/monitoring', 
    icon: Activity,
    description: 'Real-time system monitoring',
    color: 'text-pink-600'
  },
  { 
    title: 'API Management', 
    href: '/admin/api', 
    icon: Key,
    description: 'API keys and integrations',
    color: 'text-yellow-600'
  },
  { 
    title: 'Logs & Audit', 
    href: '/admin/logs', 
    icon: FileText,
    description: 'System logs and audit trails',
    color: 'text-slate-600'
  },
  { 
    title: 'Notifications', 
    href: '/admin/notifications', 
    icon: Bell,
    description: 'System notifications and alerts',
    color: 'text-amber-600'
  },
  { 
    title: 'System Health', 
    href: '/admin/system-health', 
    icon: Monitor,
    description: 'Infrastructure monitoring',
    color: 'text-teal-600'
  },
  { 
    title: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'Platform configuration',
    color: 'text-gray-600'
  }
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 items-center justify-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">MobiWave</h1>
            <p className="text-xs text-gray-500">Communication Hub</p>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="px-6 py-3 bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-900">Administrator Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-100 text-blue-900 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-blue-600' : item.color + ' group-hover:text-gray-700'
                )} />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {!isActive && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span>Admin v2.0</span>
        </div>
      </div>
    </div>
  );
}
