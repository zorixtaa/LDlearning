import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import type { Module } from '../types';

export const useModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'modules'));
        setModules(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Module),
            lastUpdated: new Date((d.data() as { lastUpdated: string }).lastUpdated),
          }))
        );
      } catch (err) {
        console.error('Failed to load modules', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { modules, loading };
};

