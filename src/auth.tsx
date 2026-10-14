import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserCredentials } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  deleteUser: () => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
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
  createdAt: '2026-01-01',
};

// Almacenamiento simulado de usuarios registrados
const getUsersStore = (): Array<User & { password: string }> => {
  try {
    const stored = localStorage.getItem('taskflow_users');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsersStore = (users: Array<User & { password: string }>) => {
  localStorage.setItem('taskflow_users', JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar
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

  // Login con Google (simulado)
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUser(DEMO_USER);
      localStorage.setItem('taskflow_user', JSON.stringify(DEMO_USER));
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login con email y contraseña
  const loginWithCredentials = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getUsersStore();
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!found) {
        return { success: false, error: 'Usuario no encontrado. Regístrate primero.' };
      }
      
      if (found.password !== password) {
        return { success: false, error: 'Contraseña incorrecta.' };
      }
      
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Registro de nuevo usuario
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const users = getUsersStore();
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Este email ya está registrado.' };
      }
      
      if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
      }
      
      const newUser: User & { password: string } = {
        id: uuidv4(),
        name,
        email,
        password,
        avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        role: 'owner',
        provider: 'credentials',
        createdAt: new Date().toISOString(),
      };
      
      saveUsersStore([...users, newUser]);
      
      const { password: _, ...userData } = newUser;
      setUser(userData);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al registrar.' };
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
      
      // Actualizar también en el store de usuarios si existe
      const users = getUsersStore();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        const { password } = users[idx];
        users[idx] = { ...updated, password };
        saveUsersStore(users);
      }
    }
  };

  // Eliminar cuenta del usuario
  const deleteUser = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No hay usuario autenticado' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Eliminar del store de usuarios
      const users = getUsersStore();
      const filteredUsers = users.filter(u => u.id !== user.id);
      saveUsersStore(filteredUsers);
      
      // Cerrar sesión y limpiar datos
      setUser(null);
      localStorage.removeItem('taskflow_user');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al eliminar la cuenta' };
    }
  };

  // Cambiar contraseña
  const changePassword = async (
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No hay usuario autenticado' };
    }

    if (user.provider !== 'credentials') {
      return { success: false, error: 'Solo se puede cambiar la contraseña de cuentas locales' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getUsersStore();
      const userIdx = users.findIndex(u => u.id === user.id);
      
      if (userIdx === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Verificar contraseña actual
      if (users[userIdx].password !== currentPassword) {
        return { success: false, error: 'La contraseña actual es incorrecta' };
      }

      // Actualizar contraseña
      users[userIdx].password = newPassword;
      saveUsersStore(users);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al cambiar la contraseña' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      loginWithGoogle,
      loginWithCredentials,
      register,
      logout,
      updateUser,
      deleteUser,
      changePassword,
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
