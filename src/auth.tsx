import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario demo por defecto (para pruebas sin OAuth real)
const DEMO_USER: User = {
  id: 'user-1',
  name: 'Juan Pérez',
  email: 'juan.perez@gmail.com',
  avatar: 'JP',
  role: 'owner',
  provider: 'google',
  googleId: 'google-123456',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificación de sesión al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('taskflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login con Google (simulado - en producción usaría Google Identity Services)
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // En producción, aquí iría el flujo real de OAuth:
      // 1. google.accounts.id.initialize({ client_id: 'YOUR_CLIENT_ID' })
      // 2. google.accounts.id.renderButton(element, options)
      // 3. Manejar el credential response
      // 4. Verificar el token con tu backend
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setUser(DEMO_USER);
      localStorage.setItem('taskflow_user', JSON.stringify(DEMO_USER));
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('taskflow_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      loginWithGoogle,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
