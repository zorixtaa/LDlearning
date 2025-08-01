import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Module } from '../types';

export const useModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('modules').select('*');
      if (!error && data) {
        setModules(data.map((m: any) => ({
          ...m,
          lastUpdated: new Date(m.lastUpdated),
        })));
      }
      setLoading(false);
    };

    load();
  }, []);

  return { modules, loading };
};
