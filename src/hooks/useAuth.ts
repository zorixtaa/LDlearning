import { useState, useEffect, createContext, useContext } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import type { User } from '../types';
import { auth, db } from '../firebaseClient';

interface AuthContextType {
  user: User | null;
  login: (
    identifier: string,
    password: string,
    role?: User['role']
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface ProfileData {
  name?: string;
  role?: User['role'];
  department?: User['department'];
  bio?: string;
  isActive?: boolean;
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

  const mapUser = (fbUser: FirebaseUser, profile?: ProfileData): User => ({
    id: fbUser.uid,
    email: fbUser.email ?? '',
    name: profile?.name ?? fbUser.displayName ?? fbUser.email ?? '',
    role: (profile?.role as User['role']) ?? 'learner',
    department: profile?.department,
    bio: profile?.bio,
    createdAt: fbUser.metadata?.creationTime
      ? new Date(fbUser.metadata.creationTime)
      : new Date(),
    isActive: profile?.isActive ?? true,
  });

  useEffect(() => {
    const authInstance = getAuth();
    const current = authInstance.currentUser;
    if (current) {
      const stored = localStorage.getItem('educatrack_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as User;
          if (parsed.id === current.uid) {
            setUser({ ...mapUser(current, parsed), ...parsed });
          } else {
            const mapped = mapUser(current);
            setUser(mapped);
          }
        } catch {
          const mapped = mapUser(current);
          setUser(mapped);
        }
      } else {
        const mapped = mapUser(current);
        setUser(mapped);
      }
    } else {
      const stored = localStorage.getItem('educatrack_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as User;
          setUser(parsed);
        } catch {
          localStorage.removeItem('educatrack_user');
        }
      }
    }
    setIsLoading(false);

    const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
      if (fbUser) {
        let profile: ProfileData | undefined = undefined;
        try {
          const docSnap = await getDoc(doc(db, 'profiles', fbUser.uid));
          if (docSnap.exists()) profile = docSnap.data() as ProfileData;
        } catch {
          // ignore profile errors
        }
        const mapped = mapUser(fbUser, profile);
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

  const login = async (
    identifier: string,
    password: string,
    role?: User['role']
  ): Promise<boolean> => {
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
      let profile: ProfileData | undefined = undefined;
      try {
        const docSnap = await getDoc(doc(db, 'profiles', credential.user.uid));
        if (docSnap.exists()) profile = docSnap.data() as ProfileData;
      } catch {
        // ignore profile errors
      }
      const mapped = mapUser(credential.user, profile);
      if (role) {
        mapped.role = role;
      }
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
