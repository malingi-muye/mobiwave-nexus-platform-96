
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Database, 
  Settings, 
  FileText, 
  Activity,
  DollarSign,
  Calendar,
  UserPlus,
  Shield,
  Eye,
  CheckCircle,
  Cloud,
  GitBranch,
  Lock
} from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: Activity, label: 'Dashboard' },
  { path: '/admin/enhanced-users', icon: Users, label: 'User Management' },
  { path: '/admin/enhanced-analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/database', icon: Database, label: 'Database Admin' },
  { path: '/admin/services', icon: Settings, label: 'Services' },
  { path: '/admin/system-integrity', icon: Shield, label: 'System Integrity' },
  { path: '/admin/security-center', icon: Eye, label: 'Security Center' },
  { path: '/admin/system-diagnostics', icon: CheckCircle, label: 'System Health' },
  { path: '/admin/enterprise-integrations', icon: Cloud, label: 'Enterprise Hub' },
  { path: '/admin/devops-pipeline', icon: GitBranch, label: 'DevOps Pipeline' },
  { path: '/admin/production-security', icon: Lock, label: 'Production Security' },
  { path: '/admin/settings', icon: Settings, label: 'System Settings' },
  { path: '/admin/logs', icon: FileText, label: 'System Logs' },
  { path: '/admin/revenue', icon: DollarSign, label: 'Revenue Reports' },
  { path: '/admin/progress', icon: Calendar, label: 'Project Progress' },
  { path: '/admin/user-creation', icon: UserPlus, label: 'User Creation' }
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
