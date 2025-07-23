import React from 'react';
import { Users, BookOpen, Award, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '247',
      change: '+12 this month',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Active Modules',
      value: '8',
      change: '100% completion rate',
      changeType: 'positive' as const,
      icon: BookOpen
    },
    {
      title: 'Certificates Issued',
      value: '1,342',
      change: '+89 this week',
      changeType: 'positive' as const,
      icon: Award
    },
    {
      title: 'Avg. Score',
      value: '87.3%',
      change: '+2.1% from last month',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  const recentActivities = [
    { user: 'Juan Pérez', action: 'Completed', module: 'Romper un Pedido', time: '2 hours ago', score: 92 },
    { user: 'María García', action: 'Started', module: 'Ferry & Customs', time: '4 hours ago', score: null },
    { user: 'Carlos López', action: 'Failed', module: 'Incident Registration', time: '6 hours ago', score: 65 },
    { user: 'Ana Martín', action: 'Completed', module: 'Pallet Exchange', time: '1 day ago', score: 88 },
    { user: 'Pedro Silva', action: 'Completed', module: 'Basic Transport', time: '1 day ago', score: 95 }
  ];

  const departmentProgress = [
    { name: 'Trucking', completed: 89, total: 120, percentage: 74 },
    { name: 'Frigo', completed: 67, total: 85, percentage: 79 },
    { name: 'Tautliner', completed: 34, total: 42, percentage: 81 },
    { name: 'Customs', completed: 28, total: 30, percentage: 93 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor training progress and manage the platform</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">ISO 9001:2015 Compliant</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-900 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">Recent Activities</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-100">{activity.user}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.action === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : activity.action === 'Failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.action}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{activity.module}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.score && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-100">{activity.score}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Department Progress */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">Department Progress</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Export Report
            </button>
          </div>
          
          <div className="space-y-4">
            {departmentProgress.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-100">{dept.name}</span>
                  <span className="text-sm text-gray-400">
                    {dept.completed}/{dept.total} ({dept.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left">
            <h3 className="font-medium text-gray-100 mb-1">Export Audit Log</h3>
            <p className="text-sm text-gray-400">Download compliance documentation</p>
          </button>
          <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left">
            <h3 className="font-medium text-gray-100 mb-1">Send Reminders</h3>
            <p className="text-sm text-gray-400">Notify pending training candidates</p>
          </button>
          <button className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-left">
            <h3 className="font-medium text-gray-100 mb-1">Update Modules</h3>
            <p className="text-sm text-gray-400">Refresh training content</p>
          </button>
        </div>
      </div>
    </div>
  );
};