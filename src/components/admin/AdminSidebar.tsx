
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Database,
  FileText,
  Shield,
  Monitor,
  DollarSign,
  Activity,
  Grid3X3,
  TrendingUp,
  Key
} from 'lucide-react';

const adminSidebarItems = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'User Management',
    path: '/admin/users',
    icon: Users
  },
  {
    title: 'Services Management',
    path: '/admin/services',
    icon: Grid3X3
  },
  {
    title: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Advanced Analytics',
    path: '/admin/advanced-analytics',
    icon: TrendingUp
  },
  {
    title: 'Revenue Reports',
    path: '/admin/revenue',
    icon: DollarSign
  },
  {
    title: 'API Management',
    path: '/admin/api',
    icon: Key
  },
  {
    title: 'System Settings',
    path: '/admin/settings',
    icon: Settings
  },
  {
    title: 'Database Admin',
    path: '/admin/database',
    icon: Database
  },
  {
    title: 'System Logs',
    path: '/admin/logs',
    icon: FileText
  },
  {
    title: 'Security Config',
    path: '/admin/security',
    icon: Shield
  },
  {
    title: 'Monitoring',
    path: '/admin/monitoring',
    icon: Monitor
  },
  {
    title: 'System Integrity',
    path: '/admin/integrity',
    icon: Activity
  }
];

export function AdminSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <div className="px-3">
          {adminSidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 mb-1 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
