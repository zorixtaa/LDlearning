import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Progress } from '../types';
import { useAuth } from './useAuth';

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const stored = localStorage.getItem(`progress_${user.id}`);
      if (stored) {
        try {
          const parsed: Progress[] = JSON.parse(stored).map((p: Record<string, unknown>) => ({
            ...p,
            completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
            lastActivity: new Date(p.lastActivity)
          }));
          setProgress(parsed);
        } catch {
          // ignore parse errors
        }
      }

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('userId', user.id);

      if (!error && data) {
        const mapped = data.map((p: Record<string, unknown>) => ({
          ...p,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
          lastActivity: new Date(p.lastActivity)
        }));
        setProgress(mapped);
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(mapped));
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const updateProgress = async (moduleId: string, changes: Partial<Progress>) => {
    if (!user) return;

    setProgress(prev => {
      const existing = prev.find(p => p.moduleId === moduleId);
      let updated: Progress;
      if (existing) {
        updated = { ...existing, ...changes, lastActivity: new Date() };
        return prev.map(p => (p.moduleId === moduleId ? updated : p));
      } else {
        updated = {
          userId: user.id,
          moduleId,
          status: 'in_progress',
          timeSpent: 0,
          attempts: 1,
          lastActivity: new Date(),
          ...changes
        } as Progress;
        return [...prev, updated];
      }
    });

    try {
      await supabase.from('progress').upsert({
        userId: user.id,
        moduleId,
        ...changes
      });
    } catch {
      // ignore
    }

    const stored = localStorage.getItem(`progress_${user.id}`);
    const list = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((p: { moduleId: string }) => p.moduleId === moduleId);
    if (index > -1) {
      list[index] = { ...list[index], ...changes, lastActivity: new Date() };
    } else {
      list.push({
        userId: user.id,
        moduleId,
        status: 'in_progress',
        timeSpent: 0,
        attempts: 1,
        lastActivity: new Date(),
        ...changes
      });
    }
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(list));
  };

  const getProgress = (moduleId: string) => progress.find(p => p.moduleId === moduleId);

  return { progress, getProgress, updateProgress, loading };
};

