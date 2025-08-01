import { useState, useEffect, createContext, useContext } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '../types';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = (sbUser: SupabaseUser): User => ({
    id: sbUser.id,
    email: sbUser.email ?? '',
    name: (sbUser.user_metadata as any)?.name ?? sbUser.email ?? '',
    role: (sbUser.user_metadata as any)?.role ?? 'candidate',
    createdAt: new Date(sbUser.created_at),
    isActive: true,
  });

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const mapped = mapUser(data.session.user);
        setUser(mapped);
        localStorage.setItem('educatrack_user', JSON.stringify(mapped));
      }
      setIsLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mapped = mapUser(session.user);
        setUser(mapped);
        localStorage.setItem('educatrack_user', JSON.stringify(mapped));
      } else {
        setUser(null);
        localStorage.removeItem('educatrack_user');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setIsLoading(false);
      return false;
    }
    const mapped = mapUser(data.user);
    setUser(mapped);
    localStorage.setItem('educatrack_user', JSON.stringify(mapped));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('educatrack_user');
  };

  return {
    user,
    login,
    logout,
    isLoading
  };
};

export { AuthContext };