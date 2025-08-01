import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Progress } from '../types';
import { useAuth } from './useAuth';

interface ProgressContextType {
  progress: Progress[];
  startModule: (moduleId: string) => void;
  completeModule: (moduleId: string, score: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`educatrack_progress_${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Progress[];
          setProgress(parsed.map(p => ({ ...p, lastActivity: new Date(p.lastActivity), completedAt: p.completedAt ? new Date(p.completedAt) : undefined }))); 
        } catch {
          setProgress([]);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`educatrack_progress_${user.id}`, JSON.stringify(progress));
    }
  }, [progress, user]);

  const startModule = (moduleId: string) => {
    if (!user) return;
    setProgress(prev => {
      const existing = prev.find(p => p.moduleId === moduleId);
      if (existing) {
        return prev.map(p => p.moduleId === moduleId ? { ...p, status: 'in_progress', attempts: p.attempts + 1, lastActivity: new Date() } : p);
      }
      const newProgress: Progress = {
        userId: user.id,
        moduleId,
        status: 'in_progress',
        attempts: 1,
        timeSpent: 0,
        timeOnPage: 0,
        interactions: 0,
        lastActivity: new Date()
      };
      return [...prev, newProgress];
    });
  };

  const completeModule = (moduleId: string, score: number) => {
    setProgress(prev => prev.map(p => p.moduleId === moduleId ? { ...p, status: score >= 70 ? 'completed' : 'failed', score, completedAt: new Date(), lastActivity: new Date() } : p));
  };

  return (
    <ProgressContext.Provider value={{ progress, startModule, completeModule }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};
