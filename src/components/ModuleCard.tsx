import React from 'react';
import { Clock, Award, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import type { Module, Progress } from '../types';

interface ModuleCardProps {
  module: Module;
  progress?: Progress;
  onStart: (moduleId: string) => void;
  disabled?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  progress, 
  onStart, 
  disabled = false 
}) => {
  const getStatusColor = () => {
    if (disabled) return 'bg-gray-800 border-gray-700';
    if (!progress) return 'bg-gray-800 border-gray-700 hover:border-blue-500';
    
    switch (progress.status) {
      case 'completed':
        return 'bg-green-900/30 border-green-700';
      case 'in_progress':
        return 'bg-blue-900/30 border-blue-700';
      case 'failed':
        return 'bg-red-900/30 border-red-700';
      default:
        return 'bg-gray-800 border-gray-700 hover:border-blue-500';
    }
  };

  const getStatusIcon = () => {
    if (disabled) return <Lock className="h-5 w-5 text-gray-400" />;
    if (!progress) return <PlayCircle className="h-5 w-5 text-blue-500" />;
    
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <PlayCircle className="h-5 w-5 text-red-500" />;
      default:
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-200 ${getStatusColor()} ${!disabled ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-100 mb-2">{module.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{module.description}</p>
        </div>
        <div className="ml-4">
          {getStatusIcon()}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
          {module.difficulty}
        </span>
        {module.badge && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 flex items-center gap-1">
            <Award className="h-3 w-3" />
            {module.badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{module.duration} min</span>
        </div>
        {progress && (
          <div className="flex items-center gap-2">
            {progress.score && (
              <span className="font-medium text-gray-300">Score: {progress.score}%</span>
            )}
            <span>Attempts: {progress.attempts}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wide">Topics Covered</h4>
        <div className="flex flex-wrap gap-1">
          {module.topics.slice(0, 3).map((topic, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
              {topic}
            </span>
          ))}
          {module.topics.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
              +{module.topics.length - 3} more
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => !disabled && onStart(module.id)}
        disabled={disabled}
        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
          disabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : progress?.status === 'completed'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {disabled 
          ? 'Prerequisites Required'
          : progress?.status === 'completed' 
          ? 'Review Module' 
          : progress?.status === 'in_progress'
          ? 'Continue Module'
          : 'Start Module'
        }
      </button>
    </div>
  );
};