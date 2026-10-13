import { useApp } from '../store';
import { ViewMode } from '../types';
import {
  LayoutDashboard,
  List,
  Columns,
  Calendar,
  Plus,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';

const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'list', label: 'Lista', icon: <List size={20} /> },
  { id: 'board', label: 'Tablero', icon: <Columns size={20} /> },
  { id: 'calendar', label: 'Calendario', icon: <Calendar size={20} /> },
];

export default function Sidebar() {
  const { spaces, currentView, setCurrentView, selectedSpace, setSelectedSpace, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Overlay for mobile */}
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
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Vistas
            </p>
            <ul className="space-y-1">
              {navItems.map(item => (
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

          {/* Spaces */}
          <div>
            <div className="flex items-center justify-between px-3 mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Espacios
              </p>
              <button className="p-1 rounded hover:bg-gray-100">
                <Plus size={14} className="text-gray-400" />
              </button>
            </div>
            <ul className="space-y-1">
              {spaces.map(space => (
                <li key={space.id}>
                  <button
                    onClick={() => {
                      setSelectedSpace(selectedSpace === space.id ? null : space.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedSpace === space.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{space.icon}</span>
                    <span className="flex-1 text-left">{space.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {space.taskCount}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
              JP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Juan Pérez</p>
              <p className="text-xs text-gray-400 truncate">Admin</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
