import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Settings, 
  Users, 
  BarChart3,
  LogOut,
  Truck,
  Bot,
  LayoutList
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-config', label: 'AI Tutor', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const learnerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'modules', label: 'My Modules', icon: BookOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  const trainerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'builder', label: 'Builder', icon: LayoutList }
  ];

  const tabs =
    user?.role === 'superadmin'
      ? adminTabs
      : user?.role === 'admin'
      ? adminTabs
      : user?.role === 'trainer'
      ? trainerTabs
      : learnerTabs;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">LÍNEA EDUCATRACK</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">ISO 9001:2015 Compliant</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role} • {user?.department || 'General'}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};