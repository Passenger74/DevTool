import { ReactNode } from 'react';
import { useApp } from '../store';
import { useAuth } from '../auth';
import { ViewMode } from '../types';
import {
  LayoutDashboard,
  List,
  Columns,
  Calendar,
  Users,
  LayoutGrid,
  Settings,
  X,
  Zap,
  LogOut,
} from 'lucide-react';

const navItems: { id: ViewMode; label: string; icon: ReactNode; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'Principal' },
  { id: 'list', label: 'Lista', icon: <List size={20} /> },
  { id: 'board', label: 'Tablero Kanban', icon: <Columns size={20} /> },
  { id: 'calendar', label: 'Calendario', icon: <Calendar size={20} /> },
  { id: 'teams', label: 'Equipos', icon: <Users size={20} />, section: 'Gestión' },
  { id: 'boards', label: 'Tableros', icon: <LayoutGrid size={20} /> },
  { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useApp();
  const { user, logout } = useAuth();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Principal */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Principal
            </p>
            <ul className="space-y-1">
              {navItems.filter(i => !i.section || i.section === 'Principal').map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Gestión */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Gestión
            </p>
            <ul className="space-y-1">
              {navItems.filter(i => i.section === 'Gestión' || i.id === 'settings').map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.avatar || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
