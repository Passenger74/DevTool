import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Space, ViewMode } from './types';

interface AppState {
  tasks: Task[];
  spaces: Space[];
  currentView: ViewMode;
  selectedSpace: string | null;
  sidebarOpen: boolean;
  setCurrentView: (view: ViewMode) => void;
  setSelectedSpace: (space: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Task['status']) => void;
}

const defaultSpaces: Space[] = [
  { id: '1', name: 'Marketing', icon: '📢', color: '#0D9488', taskCount: 5 },
  { id: '2', name: 'Development', icon: '💻', color: '#F97316', taskCount: 8 },
  { id: '3', name: 'Design', icon: '🎨', color: '#8B5CF6', taskCount: 4 },
  { id: '4', name: 'Operations', icon: '⚙️', color: '#06B6D4', taskCount: 3 },
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Rediseñar landing page',
    description: 'Actualizar el diseño de la página principal con el nuevo branding',
    status: 'in-progress',
    priority: 'high',
    assignee: 'María García',
    dueDate: '2026-02-15',
    tags: ['diseño', 'urgente'],
    createdAt: '2026-01-20',
  },
  {
    id: '2',
    title: 'Implementar autenticación OAuth',
    description: 'Integrar login con Google y GitHub',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Carlos López',
    dueDate: '2026-02-10',
    tags: ['backend', 'seguridad'],
    createdAt: '2026-01-22',
  },
  {
    id: '3',
    title: 'Escribir blog post sobre producto',
    description: 'Crear contenido para el blog sobre las nuevas funcionalidades',
    status: 'review',
    priority: 'medium',
    assignee: 'Ana Martínez',
    dueDate: '2026-02-20',
    tags: ['contenido', 'marketing'],
    createdAt: '2026-01-25',
  },
  {
    id: '4',
    title: 'Optimizar consultas de base de datos',
    description: 'Mejorar el rendimiento de las queries principales',
    status: 'done',
    priority: 'high',
    assignee: 'Carlos López',
    dueDate: '2026-02-05',
    tags: ['backend', 'performance'],
    createdAt: '2026-01-18',
  },
  {
    id: '5',
    title: 'Diseñar iconos del sistema',
    description: 'Crear set de iconos personalizados para la interfaz',
    status: 'todo',
    priority: 'low',
    assignee: 'Ana Martínez',
    dueDate: '2026-03-01',
    tags: ['diseño', 'UI'],
    createdAt: '2026-01-28',
  },
  {
    id: '6',
    title: 'Configurar CI/CD pipeline',
    description: 'Implementar integración continua con GitHub Actions',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Pedro Sánchez',
    dueDate: '2026-02-12',
    tags: ['devops', 'automatización'],
    createdAt: '2026-01-21',
  },
  {
    id: '7',
    title: 'Crear campaña de email marketing',
    description: 'Diseñar y programar emails para lanzamiento',
    status: 'todo',
    priority: 'medium',
    assignee: 'María García',
    dueDate: '2026-02-25',
    tags: ['marketing', 'email'],
    createdAt: '2026-01-30',
  },
  {
    id: '8',
    title: 'Revisar accesibilidad del sitio',
    description: 'Auditoría WCAG 2.1 nivel AA',
    status: 'review',
    priority: 'medium',
    assignee: 'Ana Martínez',
    dueDate: '2026-02-18',
    tags: ['accesibilidad', 'QA'],
    createdAt: '2026-01-26',
  },
  {
    id: '9',
    title: 'Migrar a nueva API de pagos',
    description: 'Actualizar integración con Stripe v3',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Pedro Sánchez',
    dueDate: '2026-02-08',
    tags: ['backend', 'pagos'],
    createdAt: '2026-01-29',
  },
  {
    id: '10',
    title: 'Documentar API endpoints',
    description: 'Crear documentación Swagger para todos los endpoints',
    status: 'in-progress',
    priority: 'low',
    assignee: 'Carlos López',
    dueDate: '2026-03-05',
    tags: ['documentación', 'API'],
    createdAt: '2026-01-27',
  },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [spaces] = useState<Space[]>(defaultSpaces);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <AppContext.Provider value={{
      tasks,
      spaces,
      currentView,
      selectedSpace,
      sidebarOpen,
      setCurrentView,
      setSelectedSpace,
      setSidebarOpen,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
