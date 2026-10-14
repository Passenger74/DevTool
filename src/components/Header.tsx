import { useApp } from '../store';
import { Menu, Search, Bell, Plus } from 'lucide-react';

interface HeaderProps {
  onNewTask: () => void;
}

export default function Header({ onNewTask }: HeaderProps) {
  const { setSidebarOpen, currentView, calendarConnection } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    list: 'Lista de Tareas',
    board: 'Tablero Kanban',
    calendar: 'Calendario',
    teams: 'Equipos',
    boards: 'Tableros',
    settings: 'Configuración',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {viewTitles[currentView]}
            </h2>
            <p className="text-xs text-gray-400 hidden sm:block">
              Gestiona tus proyectos de forma eficiente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              className="ml-2 bg-transparent text-sm outline-none w-40 lg:w-56 placeholder-gray-400"
            />
          </div>

          {/* Calendar Sync Indicator */}
          {calendarConnection.connected && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 bg-green-50 rounded-lg border border-green-100" title="Google Calendar sincronizado">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Calendar</span>
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* New Task Button */}
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva Tarea</span>
          </button>
        </div>
      </div>
    </header>
  );
}
