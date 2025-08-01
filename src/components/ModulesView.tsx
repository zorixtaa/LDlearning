import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Award } from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { modules as staticModules } from '../data/modules';
import { useAuth } from '../hooks/useAuth';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import type { Module } from '../types';

export const ModulesView: React.FC = () => {
  const { user } = useAuth();
  const { modules } = useModules();
  const { progress, startModule } = useProgress();
  const allModules = modules.length > 0 ? modules : staticModules;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');


  const handleStartModule = (moduleId: string) => {
    if (user?.role === 'learner') {
      startModule(moduleId);
    }
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

  const filteredModules = allModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    
    let matchesStatus = true;
    if (selectedStatus !== 'all') {
      const progress = getModuleProgress(module.id);
      const status = progress?.status || 'not_started';
      matchesStatus = status === selectedStatus;
    }
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const stats = {
    total: allModules.length,
    completed: progress.filter(p => p.status === 'completed').length,
    inProgress: progress.filter(p => p.status === 'in_progress').length,
    notStarted: allModules.length - progress.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {user?.role === 'admin' ? 'Module Management' : 'My Training Modules'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400">
          {user?.role === 'admin' 
            ? 'Manage and monitor all training modules'
            : 'Complete your logistics training certification'
          }
        </p>
      </div>

      {/* Stats */}
      {user?.role === 'learner' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Total Modules</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Not Started</span>
            </div>
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400 dark:text-gray-400">{stats.notStarted}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {user?.role === 'learner' && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={user?.role === 'learner' ? getModuleProgress(module.id) : undefined}
            onStart={handleStartModule}
            disabled={user?.role === 'learner' ? isModuleDisabled(module) : false}
          />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No modules found</h3>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};