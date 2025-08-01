import { useState, useEffect, createContext, useContext } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { User } from '../types';
import { auth, db } from '../firebaseClient';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<boolean>;
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

  const mapUser = (fbUser: FirebaseUser): User => ({
    id: fbUser.uid,
    email: fbUser.email ?? '',
    name: fbUser.displayName ?? fbUser.email ?? '',
    role: 'learner',
    bio: undefined,
    createdAt: fbUser.metadata?.creationTime
      ? new Date(fbUser.metadata.creationTime)
      : new Date(),
    isActive: true,
  });

  useEffect(() => {
    const authInstance = getAuth();
    const current = authInstance.currentUser;
    if (current) {
      const mapped = mapUser(current);
      setUser(mapped);
      localStorage.setItem('educatrack_user', JSON.stringify(mapped));
    }
    setIsLoading(false);

    const unsubscribe = onAuthStateChanged(authInstance, (fbUser) => {
      if (fbUser) {
        const mapped = mapUser(fbUser);
        setUser(mapped);
        localStorage.setItem('educatrack_user', JSON.stringify(mapped));
      } else {
        setUser(null);
        localStorage.removeItem('educatrack_user');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    let email = identifier;
    if (!identifier.includes('@')) {
      const q = query(
        collection(db, 'profiles'),
        where('username', '==', identifier),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setIsLoading(false);
        return false;
      }
      email = snapshot.docs[0].data().email;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const mapped = mapUser(credential.user);
      setUser(mapped);
      localStorage.setItem('educatrack_user', JSON.stringify(mapped));
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
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
