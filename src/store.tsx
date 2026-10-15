import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Space, ViewMode, Team, Board, BoardColumn, GoogleCalendarConnection, Tag, FileLink } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  tasks: Task[];
  spaces: Space[];
  teams: Team[];
  boards: Board[];
  tags: Tag[];
  calendarConnection: GoogleCalendarConnection;
  currentView: ViewMode;
  selectedSpace: string | null;
  selectedBoard: string | null;
  sidebarOpen: boolean;
  selectedTasks: string[];
  setCurrentView: (view: ViewMode) => void;
  setSelectedSpace: (space: string | null) => void;
  setSelectedBoard: (board: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Task['status']) => void;
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  clearTaskSelection: () => void;
  deleteSelectedTasks: () => void;
  updateSelectedTasksStatus: (status: Task['status']) => void;
  verifyTask: (id: string) => void;
  addFileLink: (taskId: string, link: FileLink) => void;
  removeFileLink: (taskId: string, linkId: string) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  addBoardColumn: (boardId: string, column: BoardColumn) => void;
  updateBoardColumn: (boardId: string, columnId: string, updates: Partial<BoardColumn>) => void;
  deleteBoardColumn: (boardId: string, columnId: string) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  addSpace: (space: Space) => void;
  updateSpace: (id: string, updates: Partial<Space>) => void;
  deleteSpace: (id: string) => void;
  connectGoogleCalendar: (email: string) => void;
  disconnectGoogleCalendar: () => void;
  syncTaskToCalendar: (taskId: string) => void;
  unsyncTaskFromCalendar: (taskId: string) => void;
  syncAllTasks: () => void;
}

const defaultSpaces: Space[] = [
  { id: '1', name: 'Marketing', icon: '📢', color: '#0D9488', taskCount: 5, parentId: null, teamId: 'team-1' },
  { id: '2', name: 'Development', icon: '💻', color: '#F97316', taskCount: 8, parentId: null, teamId: 'team-2' },
  { id: '3', name: 'Design', icon: '🎨', color: '#8B5CF6', taskCount: 4, parentId: null, teamId: 'team-3' },
  { id: '4', name: 'Operations', icon: '⚙️', color: '#06B6D4', taskCount: 3, parentId: null },
  { id: '5', name: 'Campañas Q1', icon: '📊', color: '#0D9488', taskCount: 2, parentId: '1', teamId: 'team-1' },
  { id: '6', name: 'Redes Sociales', icon: '📱', color: '#0D9488', taskCount: 3, parentId: '1', teamId: 'team-1' },
  { id: '7', name: 'Frontend', icon: '🎨', color: '#F97316', taskCount: 4, parentId: '2', teamId: 'team-2' },
  { id: '8', name: 'Backend', icon: '⚙️', color: '#F97316', taskCount: 4, parentId: '2', teamId: 'team-2' },
];

const defaultTags: Tag[] = [
  { id: 'tag-1', name: 'diseño', color: '#8B5CF6', createdAt: '2026-01-01' },
  { id: 'tag-2', name: 'urgente', color: '#EF4444', createdAt: '2026-01-01' },
  { id: 'tag-3', name: 'backend', color: '#F97316', createdAt: '2026-01-01' },
  { id: 'tag-4', name: 'seguridad', color: '#DC2626', createdAt: '2026-01-01' },
  { id: 'tag-5', name: 'contenido', color: '#06B6D4', createdAt: '2026-01-01' },
  { id: 'tag-6', name: 'marketing', color: '#0D9488', createdAt: '2026-01-01' },
  { id: 'tag-7', name: 'performance', color: '#F59E0B', createdAt: '2026-01-01' },
  { id: 'tag-8', name: 'UI', color: '#EC4899', createdAt: '2026-01-01' },
  { id: 'tag-9', name: 'devops', color: '#6366F1', createdAt: '2026-01-01' },
  { id: 'tag-10', name: 'automatización', color: '#10B981', createdAt: '2026-01-01' },
  { id: 'tag-11', name: 'email', color: '#14B8A6', createdAt: '2026-01-01' },
  { id: 'tag-12', name: 'accesibilidad', color: '#8B5CF6', createdAt: '2026-01-01' },
  { id: 'tag-13', name: 'QA', color: '#F59E0B', createdAt: '2026-01-01' },
  { id: 'tag-14', name: 'pagos', color: '#EF4444', createdAt: '2026-01-01' },
  { id: 'tag-15', name: 'documentación', color: '#6B7280', createdAt: '2026-01-01' },
  { id: 'tag-16', name: 'API', color: '#F97316', createdAt: '2026-01-01' },
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
    boardId: 'board-1',
    teamId: 'team-1',
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
    boardId: 'board-1',
    teamId: 'team-2',
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
    boardId: 'board-2',
    teamId: 'team-1',
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
    boardId: 'board-1',
    teamId: 'team-2',
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
    boardId: 'board-3',
    teamId: 'team-3',
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
    boardId: 'board-1',
    teamId: 'team-2',
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
    boardId: 'board-2',
    teamId: 'team-1',
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
    boardId: 'board-3',
    teamId: 'team-3',
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
    boardId: 'board-1',
    teamId: 'team-2',
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
    boardId: 'board-1',
    teamId: 'team-2',
  },
];

const defaultTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Marketing',
    description: 'Estrategia de marketing y comunicación',
    icon: '📢',
    color: '#0D9488',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', name: 'Juan Pérez', email: 'juan@gmail.com', avatar: 'JP', role: 'owner', joinedAt: '2026-01-01' },
      { userId: 'user-2', name: 'María García', email: 'maria@gmail.com', avatar: 'MG', role: 'member', joinedAt: '2026-01-05' },
      { userId: 'user-3', name: 'Ana Martínez', email: 'ana@gmail.com', avatar: 'AM', role: 'member', joinedAt: '2026-01-10' },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'team-2',
    name: 'Desarrollo',
    description: 'Equipo de ingeniería y desarrollo',
    icon: '💻',
    color: '#F97316',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', name: 'Juan Pérez', email: 'juan@gmail.com', avatar: 'JP', role: 'owner', joinedAt: '2026-01-01' },
      { userId: 'user-4', name: 'Carlos López', email: 'carlos@gmail.com', avatar: 'CL', role: 'admin', joinedAt: '2026-01-03' },
      { userId: 'user-5', name: 'Pedro Sánchez', email: 'pedro@gmail.com', avatar: 'PS', role: 'member', joinedAt: '2026-01-08' },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'team-3',
    name: 'Diseño',
    description: 'Diseño UX/UI y branding',
    icon: '🎨',
    color: '#8B5CF6',
    ownerId: 'user-3',
    members: [
      { userId: 'user-3', name: 'Ana Martínez', email: 'ana@gmail.com', avatar: 'AM', role: 'owner', joinedAt: '2026-01-02' },
    ],
    createdAt: '2026-01-02',
  },
];

const defaultBoards: Board[] = [
  {
    id: 'board-1',
    name: 'Sprint Actual',
    description: 'Tareas del sprint en curso',
    icon: '🚀',
    teamId: 'team-2',
    ownerId: 'user-1',
    isArchived: false,
    isPublic: false,
    sharedWith: ['team-2'],
    createdAt: '2026-01-15',
    columns: [
      { id: 'col-1', name: 'Por hacer', color: '#9CA3AF', order: 0 },
      { id: 'col-2', name: 'En progreso', color: '#14B8A6', order: 1 },
      { id: 'col-3', name: 'En revisión', color: '#8B5CF6', order: 2 },
      { id: 'col-4', name: 'Completado', color: '#10B981', order: 3 },
    ],
  },
  {
    id: 'board-2',
    name: 'Marketing Q1',
    description: 'Campañas y contenido del primer trimestre',
    icon: '📢',
    teamId: 'team-1',
    ownerId: 'user-1',
    isArchived: false,
    isPublic: true,
    sharedWith: ['team-1'],
    createdAt: '2026-01-10',
    columns: [
      { id: 'col-5', name: 'Ideas', color: '#F59E0B', order: 0 },
      { id: 'col-6', name: 'En producción', color: '#14B8A6', order: 1 },
      { id: 'col-7', name: 'Publicado', color: '#10B981', order: 2 },
    ],
  },
  {
    id: 'board-3',
    name: 'Diseño de Producto',
    description: 'Iteraciones de diseño y prototipos',
    icon: '🎨',
    teamId: 'team-3',
    ownerId: 'user-3',
    isArchived: false,
    isPublic: false,
    sharedWith: ['team-3'],
    createdAt: '2026-01-20',
    columns: [
      { id: 'col-8', name: 'Backlog', color: '#9CA3AF', order: 0 },
      { id: 'col-9', name: 'Diseñando', color: '#8B5CF6', order: 1 },
      { id: 'col-10', name: 'Aprobado', color: '#10B981', order: 2 },
    ],
  },
];

const defaultCalendar: GoogleCalendarConnection = {
  connected: false,
  events: [],
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [spaces, setSpaces] = useState<Space[]>(defaultSpaces);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [boards, setBoards] = useState<Board[]>(defaultBoards);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [calendarConnection, setCalendarConnection] = useState<GoogleCalendarConnection>(defaultCalendar);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Tasks
  const addTask = (task: Task) => setTasks(prev => [task, ...prev]);
  const updateTask = (id: string, updates: Partial<Task>) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const moveTask = (id: string, status: Task['status']) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  // Bulk task operations
  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };
  const selectAllTasks = () => setSelectedTasks(tasks.map(t => t.id));
  const clearTaskSelection = () => setSelectedTasks([]);
  const deleteSelectedTasks = () => {
    setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
  };
  const updateSelectedTasksStatus = (status: Task['status']) => {
    setTasks(prev => prev.map(t => 
      selectedTasks.includes(t.id) ? { ...t, status } : t
    ));
    setSelectedTasks([]);
  };

  // Task verification and file links
  const verifyTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, verified: !t.verified } : t
    ));
  };

  const addFileLink = (taskId: string, link: FileLink) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, fileLinks: [...(t.fileLinks || []), link] }
        : t
    ));
  };

  const removeFileLink = (taskId: string, linkId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, fileLinks: (t.fileLinks || []).filter(l => l.id !== linkId) }
        : t
    ));
  };

  // Tags
  const addTag = (tag: Tag) => setTags(prev => [...prev, tag]);
  const updateTag = (id: string, updates: Partial<Tag>) =>
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTag = (id: string) => setTags(prev => prev.filter(t => t.id !== id));

  // Spaces
  const addSpace = (space: Space) => setSpaces(prev => [...prev, space]);
  const updateSpace = (id: string, updates: Partial<Space>) =>
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSpace = (id: string) => setSpaces(prev => prev.filter(s => s.id !== id));

  // Teams
  const addTeam = (team: Team) => setTeams(prev => [...prev, team]);
  const updateTeam = (id: string, updates: Partial<Team>) =>
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id));

  // Boards
  const addBoard = (board: Board) => setBoards(prev => [...prev, board]);
  const updateBoard = (id: string, updates: Partial<Board>) =>
    setBoards(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  const deleteBoard = (id: string) => setBoards(prev => prev.filter(b => b.id !== id));

  const addBoardColumn = (boardId: string, column: BoardColumn) => {
    setBoards(prev => prev.map(b =>
      b.id === boardId ? { ...b, columns: [...b.columns, column] } : b
    ));
  };

  const updateBoardColumn = (boardId: string, columnId: string, updates: Partial<BoardColumn>) => {
    setBoards(prev => prev.map(b =>
      b.id === boardId
        ? { ...b, columns: b.columns.map(c => c.id === columnId ? { ...c, ...updates } : c) }
        : b
    ));
  };

  const deleteBoardColumn = (boardId: string, columnId: string) => {
    setBoards(prev => prev.map(b =>
      b.id === boardId
        ? { ...b, columns: b.columns.filter(c => c.id !== columnId) }
        : b
    ));
  };

  // Google Calendar
  const connectGoogleCalendar = (email: string) => {
    setCalendarConnection({
      connected: true,
      email,
      calendarId: 'primary',
      lastSync: new Date().toISOString(),
      events: [],
    });
  };

  const disconnectGoogleCalendar = () => {
    setCalendarConnection({ connected: false, events: [] });
  };

  const syncTaskToCalendar = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.dueDate) return;

    const eventId = uuidv4();
    setCalendarConnection(prev => ({
      ...prev,
      lastSync: new Date().toISOString(),
      events: [...prev.events, {
        id: eventId,
        taskId,
        title: task.title,
        start: `${task.dueDate}T09:00:00`,
        end: `${task.dueDate}T10:00:00`,
        description: task.description,
        synced: true,
      }],
    }));
    updateTask(taskId, { syncedToCalendar: true, calendarEventId: eventId });
  };

  const unsyncTaskFromCalendar = (taskId: string) => {
    setCalendarConnection(prev => ({
      ...prev,
      events: prev.events.filter(e => e.taskId !== taskId),
    }));
    updateTask(taskId, { syncedToCalendar: false, calendarEventId: undefined });
  };

  const syncAllTasks = () => {
    const tasksWithDates = tasks.filter(t => t.dueDate && !t.syncedToCalendar);
    const newEvents = tasksWithDates.map(task => ({
      id: uuidv4(),
      taskId: task.id,
      title: task.title,
      start: `${task.dueDate}T09:00:00`,
      end: `${task.dueDate}T10:00:00`,
      description: task.description,
      synced: true,
    }));

    setCalendarConnection(prev => ({
      ...prev,
      lastSync: new Date().toISOString(),
      events: [...prev.events, ...newEvents],
    }));

    tasksWithDates.forEach(task => {
      const event = newEvents.find(e => e.taskId === task.id);
      if (event) {
        updateTask(task.id, { syncedToCalendar: true, calendarEventId: event.id });
      }
    });
  };

  return (
    <AppContext.Provider value={{
      tasks,
      spaces,
      teams,
      boards,
      tags,
      calendarConnection,
      currentView,
      selectedSpace,
      selectedBoard,
      sidebarOpen,
      selectedTasks,
      setCurrentView,
      setSelectedSpace,
      setSelectedBoard,
      setSidebarOpen,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleTaskSelection,
      selectAllTasks,
      clearTaskSelection,
      deleteSelectedTasks,
      updateSelectedTasksStatus,
      verifyTask,
      addFileLink,
      removeFileLink,
      addTeam,
      updateTeam,
      deleteTeam,
      addBoard,
      updateBoard,
      deleteBoard,
      addBoardColumn,
      updateBoardColumn,
      deleteBoardColumn,
      addTag,
      updateTag,
      deleteTag,
      addSpace,
      updateSpace,
      deleteSpace,
      connectGoogleCalendar,
      disconnectGoogleCalendar,
      syncTaskToCalendar,
      unsyncTaskFromCalendar,
      syncAllTasks,
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
