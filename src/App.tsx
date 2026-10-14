import { useState } from 'react';
import { AppProvider, useApp } from './store';
import { AuthProvider, useAuth } from './auth';
import { ThemeProvider } from './theme';
import { Task } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import LoginScreen from './components/LoginScreen';
import TeamsManager from './components/TeamsManager';
import BoardsManager from './components/BoardsManager';
import SettingsView from './components/SettingsView';

function AppContent() {
  const { currentView, addTask, updateTask, deleteTask } = useApp();
  const { isAuthenticated, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Cargando TaskFlow...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task.id, { ...task });
    } else {
      addTask(task);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'list':
        return <TaskList onEditTask={handleEditTask} />;
      case 'board':
        return <KanbanBoard onEditTask={handleEditTask} />;
      case 'calendar':
        return <CalendarView />;
      case 'teams':
        return <TeamsManager />;
      case 'boards':
        return <BoardsManager />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onNewTask={handleNewTask} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={editingTask}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
