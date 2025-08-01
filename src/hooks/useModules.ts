import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import type { Module } from '../types';

export const useModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snapshot = await getDocs(collection(db, 'modules'));
      setModules(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
          lastUpdated: new Date((d.data() as any).lastUpdated),
        }))
      );
      setLoading(false);
    };

    load();
  }, []);

  return { modules, loading };
};

