import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Supabase types (will be replaced with actual Supabase imports)
type User = {
  id: string;
  email: string;
  email_confirmed_at?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual Supabase client
  const signUp = async (email: string, password: string) => {
    try {
      // Placeholder for Supabase signup
      console.log('TODO: Implement Supabase signUp', { email });
      
      // For now, simulate successful signup
      setUser({ id: 'temp-id', email });
      return {};
    } catch (error) {
      return { error: 'Signup failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Placeholder for Supabase signin
      console.log('TODO: Implement Supabase signIn', { email });
      
      // For now, simulate successful signin
      setUser({ id: 'temp-id', email });
      return {};
    } catch (error) {
      return { error: 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      // Placeholder for Supabase signout
      console.log('TODO: Implement Supabase signOut');
      
      setUser(null);
      
      // Clean up any remaining localStorage (temporary during migration)
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userPosts');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    // TODO: Replace with Supabase auth state listener
    // For now, check if there's any temp auth state
    const checkAuth = () => {
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hook for protecting routes
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setRedirectTo('/create-profile');
    }
  }, [isAuthenticated, loading]);

  return { redirectTo, loading };
}
