import React from 'react';
import { BookOpen, Award, Clock, TrendingUp, Target, Calendar } from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { modules } from '../data/modules';
import { useProgress } from '../hooks/useProgress';
import type { Module } from '../types';

export const LearnerDashboard: React.FC = () => {
  const { progress, startModule } = useProgress();

  const completed = progress.filter(p => p.status === 'completed');
  const stats = [
    {
      title: 'Modules Completed',
      value: `${completed.length}/${modules.length}`,
      description: `${Math.round((completed.length / modules.length) * 100) || 0}% Complete`,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Average Score',
      value: completed.length ? `${Math.round(completed.reduce((a, c) => a + (c.score || 0), 0) / completed.length)}%` : '0%',
      description: 'Average of passed modules',
      icon: Target,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Time Invested',
      value: `${(progress.reduce((a, c) => a + c.timeSpent, 0) / 60).toFixed(1)}h`,
      description: 'Total time',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Certificates',
      value: completed.filter(p => p.certificateId).length.toString(),
      description: 'Active certificates',
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const upcomingDeadlines = [
    { module: 'Trucking & Romper un Pedido', deadline: '2024-12-25', priority: 'high' },
    { module: 'Ferry & Customs Procedures', deadline: '2025-01-15', priority: 'medium' },
    { module: 'Incident Registration', deadline: '2025-01-30', priority: 'low' }
  ];

  const handleStartModule = (moduleId: string) => {
    startModule(moduleId);
    console.log('Starting module:', moduleId);
  };

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId);
  };

  const isModuleDisabled = (module: Module) => {
    if (!module.prerequisites?.length) return false;
    return !module.prerequisites.every(prereq =>
      progress.some(p => p.moduleId === prereq && p.status === 'completed')
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Juan!</h1>
            <p className="text-blue-100">Continue your logistics training journey</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-100">Department</p>
            <p className="text-lg font-bold">Trucking</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning Progress</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span>2 modules ahead of schedule</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {modules.slice(0, 4).map((module) => {
              const progress = getModuleProgress(module.id);
              const percentage = progress?.status === 'completed' ? 100 : 
                                progress?.status === 'in_progress' ? 60 : 0;
              
              return (
                <div key={module.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{module.title}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {progress?.score ? `${progress.score}%` : `${percentage}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress?.status === 'completed' ? 'bg-green-500' :
                        progress?.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Deadlines</h2>
          </div>
          
          <div className="space-y-4">
            {upcomingDeadlines.map((item, index) => (
              <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{item.deadline}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.module}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Modules</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Modules
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.slice(0, 6).map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              progress={getModuleProgress(module.id)}
              onStart={handleStartModule}
              disabled={isModuleDisabled(module)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};