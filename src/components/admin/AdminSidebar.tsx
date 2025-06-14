
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
    icon: LayoutDashboard,
    color: 'bg-blue-500'
  },
  {
    title: 'User Management',
    path: '/admin/users',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    title: 'Services Management',
    path: '/admin/services',
    icon: Grid3X3,
    color: 'bg-purple-500'
  },
  {
    title: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-orange-500'
  },
  {
    title: 'Advanced Analytics',
    path: '/admin/advanced-analytics',
    icon: TrendingUp,
    color: 'bg-indigo-500'
  },
  {
    title: 'Revenue Reports',
    path: '/admin/revenue',
    icon: DollarSign,
    color: 'bg-emerald-500'
  },
  {
    title: 'API Management',
    path: '/admin/api',
    icon: Key,
    color: 'bg-yellow-500'
  },
  {
    title: 'System Settings',
    path: '/admin/settings',
    icon: Settings,
    color: 'bg-gray-500'
  },
  {
    title: 'Database Admin',
    path: '/admin/database',
    icon: Database,
    color: 'bg-red-500'
  },
  {
    title: 'System Logs',
    path: '/admin/logs',
    icon: FileText,
    color: 'bg-blue-600'
  },
  {
    title: 'Security Config',
    path: '/admin/security',
    icon: Shield,
    color: 'bg-red-600'
  },
  {
    title: 'Monitoring',
    path: '/admin/monitoring',
    icon: Monitor,
    color: 'bg-cyan-500'
  },
  {
    title: 'System Integrity',
    path: '/admin/integrity',
    icon: Activity,
    color: 'bg-pink-500'
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
                  `group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mr-3`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="truncate">{item.title}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
