import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'team-leader' | 'team-member';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  // Gateway-Only Logout
  const logout = async () => {
    try {
      // Call Gateway logout endpoint for proper session cleanup
     // console.log('logout failed');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // CONTINUE: Don't block logout on backend error
    }
    // ALWAYS: Clean up frontend state regardless of backend response
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role.toLowerCase()) {
      case 'ceo':
      case 'admin': return '/dashboard';
      case 'manager': return '/manager-dashboard';
      case 'team_leader':
      case 'team-leader': return '/team-leader-dashboard';
      case 'member':
      case 'team-member': return '/member-dashboard';
      default: return '/member-dashboard';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
      hasRole,
      getDashboardRoute
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
